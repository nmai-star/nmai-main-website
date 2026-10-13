import { NextRequest, NextResponse } from "next/server";
import { randomBytes, randomUUID } from "node:crypto";
import { Account, applyGoogleIdentity, createSession, getSession, hashPassword, hashToken, publicAccount, safeEqual, transaction, verifyPassword } from "@/lib/auth-store";
import { getCourseCatalog, getStudentCourses, getAllCoursesForStudent } from "@/lib/course-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const cookieOptions = { httpOnly: true, sameSite: "lax" as const, secure: process.env.NODE_ENV === "production", path: "/" };
const reply = (message: string, status = 400) => NextResponse.json({ message }, { status, headers: { "Cache-Control": "no-store" } });
const counters = new Map<string, { count: number; reset: number }>();
function rateLimited(key: string) {
  const now = Date.now();
  for (const [id, value] of counters) if (value.reset < now) counters.delete(id);
  const item = counters.get(key) || { count: 0, reset: now + 60_000 };
  item.count++; counters.set(key, item);
  return item.count > 15;
}
function origin(request: NextRequest) { return process.env.NMAI_BASE_URL || request.nextUrl.origin; }
function loginRedirect(request: NextRequest, message: string, mode: "signup" | "signin" = "signin") {
  const url = new URL("/login", origin(request)); url.searchParams.set("notice", message);
  url.searchParams.set("mode", mode);
  const response = NextResponse.redirect(url);
  response.cookies.set("nmai_oauth_state", "", { ...cookieOptions, path: "/api/auth/google", maxAge: 0 });
  response.cookies.set("nmai_oauth_intent", "", { ...cookieOptions, path: "/api/auth/google", maxAge: 0 });
  return response;
}
async function establish(account: Account) {
  const response = NextResponse.json({ account: publicAccount(account) });
  response.cookies.set("nmai_session", await createSession(account.id), { ...cookieOptions, maxAge: 8 * 3600 });
  return response;
}

export async function GET(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const action = (await context.params).path.join("/");
  if (action === "all-courses") {
    const account = await getSession(request.cookies.get("nmai_session")?.value);
    if (!account || account === true) return reply("Please sign in.", 401);
    return NextResponse.json({ courses: await getAllCoursesForStudent(account) }, { headers: { "Cache-Control": "no-store" } });
  }
  if (action === "my-courses") {
    const account = await getSession(request.cookies.get("nmai_session")?.value);
    if (!account || account === true) return reply("Please sign in.", 401);
    return NextResponse.json({ courses: await getStudentCourses(account) }, { headers: { "Cache-Control": "no-store" } });
  }
  if (action === "courses") {
    if (!await getSession(request.cookies.get("nmai_session")?.value) && !await getSession(request.cookies.get("nmai_admin")?.value, true)) return reply("Please sign in.", 401);
    return NextResponse.json({ courses: await getCourseCatalog() }, { headers: { "Cache-Control": "no-store" } });
  }
  if (action === "session") {
    const account = await getSession(request.cookies.get("nmai_session")?.value);
    return account && account !== true ? NextResponse.json({ account: publicAccount(account) }, { headers: { "Cache-Control": "no-store" } }) : reply("Details not found. Please sign in with an approved account.", 401);
  }
  if (action === "admin/session") {
    return await getSession(request.cookies.get("nmai_admin")?.value, true) ? NextResponse.json({ authorized: true }) : reply("Admin sign-in required.", 401);
  }
  if (action === "admin/accounts") {
    if (!await getSession(request.cookies.get("nmai_admin")?.value, true)) return reply("Admin sign-in required.", 401);
    return NextResponse.json({ accounts: await transaction(s => s.accounts.map(publicAccount)) }, { headers: { "Cache-Control": "no-store" } });
  }
  if (action === "google") {
    const intent = request.nextUrl.searchParams.get("intent") === "signin" ? "signin" : "signup";
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) return loginRedirect(request, "Google connection is not configured yet. Please contact the administrator.", intent);
    const state = randomBytes(32).toString("hex");
    const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    url.search = new URLSearchParams({ client_id: process.env.GOOGLE_CLIENT_ID, redirect_uri: origin(request) + "/api/auth/google/callback", response_type: "code", scope: "openid email profile", state, prompt: "select_account" }).toString();
    const response = NextResponse.redirect(url);
    response.cookies.set("nmai_oauth_state", state, { ...cookieOptions, maxAge: 600, path: "/api/auth/google" });
    response.cookies.set("nmai_oauth_intent", intent, { ...cookieOptions, maxAge: 600, path: "/api/auth/google" });
    return response;
  }
  if (action === "google/callback") {
    const intent = request.cookies.get("nmai_oauth_intent")?.value === "signin" ? "signin" : "signup";
    const state = request.nextUrl.searchParams.get("state");
    const expected = request.cookies.get("nmai_oauth_state")?.value;
    const code = request.nextUrl.searchParams.get("code");
    if (!state || !expected || !safeEqual(state, expected) || !code) return loginRedirect(request, "Google sign-in was cancelled or expired. Please try again.");
    try {
      const tokenResponse = await fetch("https://oauth2.googleapis.com/token", { method: "POST", body: new URLSearchParams({ code, client_id: process.env.GOOGLE_CLIENT_ID || "", client_secret: process.env.GOOGLE_CLIENT_SECRET || "", redirect_uri: origin(request) + "/api/auth/google/callback", grant_type: "authorization_code" }), signal: AbortSignal.timeout(15_000) });
      const token = await tokenResponse.json();
      if (!tokenResponse.ok || !token.access_token) throw new Error("Token exchange failed");
      const identityResponse = await fetch("https://openidconnect.googleapis.com/v1/userinfo", { headers: { Authorization: `Bearer ${token.access_token}` }, signal: AbortSignal.timeout(15_000) });
      const identity = await identityResponse.json();
      if (!identityResponse.ok || identity.email_verified !== true || !identity.sub || typeof identity.email !== "string") throw new Error("Unverified identity");
      const outcome = await transaction(store => applyGoogleIdentity(store.accounts, identity, intent));
      if (outcome.result === "exists") return loginRedirect(request, "Account already exists. Please use Login with Gmail.");
      if (outcome.result === "missing") return loginRedirect(request, "Details not found. Please sign up with Gmail first.", "signup");
      const account = outcome.account;
      if (account.status === "suspended") return loginRedirect(request, "Your access has been suspended. Please contact the administrator.");
      const response = NextResponse.redirect(new URL("/", origin(request)));
      response.cookies.set("nmai_session", await createSession(account.id), { ...cookieOptions, maxAge: 8 * 3600 });
      response.cookies.set("nmai_oauth_state", "", { ...cookieOptions, path: "/api/auth/google", maxAge: 0 });
      response.cookies.set("nmai_oauth_intent", "", { ...cookieOptions, path: "/api/auth/google", maxAge: 0 });
      return response;
    } catch { return loginRedirect(request, "Google verification failed. Please try again."); }
  }
  return reply("Not found", 404);
}

export async function POST(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  if (request.headers.get("origin") !== origin(request)) return reply("Invalid request origin.", 403);
  const action = (await context.params).path.join("/");
  if (rateLimited(action)) return reply("Too many attempts. Please wait one minute.", 429);
  let body;
  try { body = await request.json(); } catch { return reply("Invalid request."); }
  if (!body || typeof body !== "object" || Array.isArray(body)) return reply("Invalid request.");
  if (action === "logout" || action === "admin/logout") {
    const cookie = action === "logout" ? "nmai_session" : "nmai_admin";
    const token = request.cookies.get(cookie)?.value;
    if (token) await transaction(store => { store.sessions = store.sessions.filter(s => s.tokenHash !== hashToken(token)); });
    const response = reply("Signed out.", 200); response.cookies.delete(cookie); return response;
  }
  if (action === "admin/login") {
    const secret = process.env.NMAI_ADMIN_PASSKEY;
    if (!secret) return reply("The administrator must configure NMAI_ADMIN_PASSKEY on the server.", 503);
    if (typeof body.passkey !== "string" || !safeEqual(body.passkey, secret)) return reply("Incorrect admin passkey.", 401);
    const response = reply("Admin signed in.", 200);
    response.cookies.set("nmai_admin", await createSession("admin", true), { ...cookieOptions, maxAge: 8 * 3600 });
    return response;
  }
  if (action === "admin/accounts") {
    if (!await getSession(request.cookies.get("nmai_admin")?.value, true)) return reply("Admin sign-in required.", 401);
    if (body.operation === "delete") {
      if (typeof body.id !== "string" || !body.id || typeof body.email !== "string" || !body.email.trim()) return reply("Account ID and email are required.");
      await transaction(store => {
        const email = body.email.trim().toLowerCase();
        const removedIds = new Set(store.accounts.filter(account => account.id === body.id || account.email === email).map(account => account.id));
        store.accounts = store.accounts.filter(account => !removedIds.has(account.id));
        store.sessions = store.sessions.filter(session => !removedIds.has(session.accountId));
      });
      return reply("Account and login sessions deleted.", 200);
    }
    const validCourses = ["*", ...(await getCourseCatalog()).map(c => c.id)];
    if (!["approved", "suspended", "pending"].includes(body.status) || !Array.isArray(body.courses) || body.courses.some((c: unknown) => typeof c !== "string" || !validCourses.includes(c))) return reply("Invalid account update.");
    const found = await transaction(store => {
      const account = store.accounts.find(a => a.id === body.id);
      if (!account) return false;
      account.status = body.status; account.courses = body.courses;
      if (account.status === "suspended") store.sessions = store.sessions.filter(s => s.accountId !== account.id);
      return true;
    });
    return reply(found ? "Access updated." : "Account not found.", found ? 200 : 404);
  }
  if (action === "admin/courses") {
    if (!await getSession(request.cookies.get("nmai_admin")?.value, true)) return reply("Admin sign-in required.", 401);
    await getCourseCatalog();
    if (body.operation === "delete") {
      const removed = await transaction(store => {
        if (!store.courses?.some(c => c.id === body.id)) return false;
        store.courses = store.courses.filter(c => c.id !== body.id);
        store.accounts.forEach(account => { account.courses = account.courses.filter(id => id !== body.id); });
        return true;
      });
      return reply(removed ? "Course deleted and student access removed." : "Course not found.", removed ? 200 : 404);
    }
    const c = body.course;
    if (body.operation !== "save" || !c || typeof c.title !== "string" || !c.title.trim() || c.title.length > 150 || typeof c.category !== "string" || c.category.length > 100 || typeof c.description !== "string" || c.description.length > 3000 || !Number.isInteger(c.lessons) || c.lessons < 0 || c.lessons > 10000 || typeof c.duration !== "string" || c.duration.length > 50 || typeof c.available !== "boolean" || typeof c.href !== "string" || !(c.href === "#" || /^\/courses\/[a-z0-9-]+$/.test(c.href))) return reply("Check the course title, lesson count and course path.");
    const course = { id: typeof c.id === "string" && c.id ? c.id : `course-${randomUUID()}`, title: c.title.trim(), category: c.category.trim(), description: c.description.trim(), lessons: c.lessons, duration: c.duration.trim(), available: c.available, href: c.href, visual: ["network", "ai", "design", "video", "social", "business"].includes(c.visual) ? c.visual : "network", progress: 0 };
    const saved = await transaction(store => {
      const index = store.courses!.findIndex(item => item.id === course.id);
      if (c.id && index < 0) return false;
      if (index >= 0) store.courses![index] = course; else store.courses!.push(course);
      return true;
    });
    return saved ? NextResponse.json({ course }) : reply("Course not found.", 404);
  }
  if (action !== "login" && action !== "signup") return reply("Not found", 404);
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || password.length > 256) return reply("Details not found.", 401);
  if (action === "signup") {
    if (password.length < 8) return reply("Use at least 8 characters for your NMAI password.");
    const created = await transaction(store => {
      if (store.accounts.some(a => a.email === email)) return null;
      const account: Account = { id: randomUUID(), email, name: typeof body.name === "string" ? body.name.trim().slice(0, 100) || email.split("@")[0] : email.split("@")[0], passwordHash: hashPassword(password), status: "pending", courses: [], createdAt: new Date().toISOString() };
      store.accounts.unshift(account);
      return account;
    });
    return created ? establish(created) : reply("Account already exists. Please sign in.", 409);
  }
  const account = await transaction(store => store.accounts.find(a => a.email === email));
  if (!verifyPassword(password, account?.passwordHash) || !account) return reply("Details not found. Check your email and NMAI password.", 401);
  if (account.status === "suspended") return reply("Your access has been suspended. Please contact the administrator.", 403);
  return establish(account);
}
