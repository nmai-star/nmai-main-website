import assert from "node:assert/strict";
import { createHash, randomUUID } from "node:crypto";
import { existsSync, readFileSync, writeFileSync, renameSync } from "node:fs";
import path from "node:path";

// Run against the local dev server only. Test records are removed in finally.
process.loadEnvFile(".env.local");
const base = process.env.NMAI_BASE_URL;
assert.ok(base === "http://127.0.0.1:3000" || base === "http://localhost:3000", "Local preview only");
const email = `auth-test-${randomUUID()}@example.com`;
const password = "Test-only-password-7391";
let accountId;
let testCourseId;
let adminCookie;
const tokenHashes = new Set();
function cookieFrom(response, name) {
  const value = response.headers.getSetCookie().find(v => v.startsWith(name + "="))?.split(";")[0];
  if (value) tokenHashes.add(createHash("sha256").update(value.slice(name.length + 1)).digest("hex"));
  return value;
}
async function post(action, body, cookie, expected, requestOrigin = base) {
  const response = await fetch(base + "/api/auth/" + action, { method: "POST", headers: { "Content-Type": "application/json", Origin: requestOrigin, ...(cookie ? { Cookie: cookie } : {}) }, body: JSON.stringify(body), redirect: "manual" });
  assert.equal(response.status, expected, `${action}: ${response.status}`);
  return response;
}
try {
  const home = await fetch(base + "/", { redirect: "manual" });
  assert.equal(home.status, 200, "Visitors should see the public dashboard");
  const homeHtml = await home.text();
  assert.ok(homeHtml.includes("Next Gen Masters"));
  assert.ok(homeHtml.includes("What is NMAI?"));
  assert.ok(homeHtml.includes("Create an Account"));
  assert.ok(!homeHtml.includes("replace;/login;307;"));
  assert.ok(!homeHtml.includes("Network Marketing Success"), "Homepage should not display the course catalog");
  for (const route of ["/all-courses", "/ai-tools", "/learning-paths", "/my-course", "/settings", "/courses/network-marketing"]) {
    const response = await fetch(base + route, { redirect: "manual" });
    const html = await response.text();
    assert.ok(response.headers.get("location") === "/login" || html.includes("replace;/login;307;"), `${route} must redirect unauthenticated visitors`);
  }
  const unknown = await post("login", { email, password }, null, 401);
  assert.match((await unknown.json()).message, /Details not found/);
  await post("login", { email, password }, null, 403, "https://untrusted.example");
  await post("login", null, null, 400);
  const signup = await post("signup", { email, password, name: "Temporary Auth Test", courses: ["*"] }, null, 200);
  const signupCookie = cookieFrom(signup, "nmai_session");
  assert.ok(signupCookie);
  const signupAccount = await signup.json();
  const emptyCourses = await (await fetch(base + "/api/auth/my-courses", { headers: { Cookie: signupCookie } })).json();
  assert.deepEqual(emptyCourses.courses, []);
  assert.equal((await fetch(base + "/api/auth/all-courses")).status, 401);
  const lockedCatalog = await (await fetch(base + "/api/auth/all-courses", { headers: { Cookie: signupCookie } })).json();
  const signupCatalog = await (await fetch(base + "/api/auth/courses", { headers: { Cookie: signupCookie } })).json();
  assert.deepEqual(lockedCatalog.courses.map(c => c.id), signupCatalog.courses.map(c => c.id));
  assert.ok(lockedCatalog.courses.every(c => c.hasAccess === false));
  const allPage = await fetch(base + "/all-courses", { headers: { Cookie: signupCookie } });
  assert.equal(allPage.status, 200);
  const allHtml = await allPage.text();
  assert.ok(allHtml.includes("allCourses"), "All Courses page must receive its catalog mode");
  assert.ok(!allHtml.includes("replace;/login;307;"));
  assert.equal((await fetch(base + "/api/auth/my-courses")).status, 401);
  assert.deepEqual(signupAccount.account.courses, [], "Signup must ignore requested course grants");
  const freePortal = await fetch(base + "/", { headers: { Cookie: signupCookie }, redirect: "manual" });
  assert.equal(freePortal.status, 200);
  assert.ok(!(await freePortal.text()).includes("replace;/login;307;"));
  const lockedAtSignup = await fetch(base + "/courses/network-marketing", { headers: { Cookie: signupCookie }, redirect: "manual" });
  assert.ok(lockedAtSignup.headers.get("location") === "/my-course" || (await lockedAtSignup.text()).includes("replace;/my-course;307;"));
  await post("signup", { email, password }, null, 409);
  const freeLogin = await post("login", { email, password }, null, 200);
  cookieFrom(freeLogin, "nmai_session");
  await post("login", { email, password: "wrong-password" }, null, 401);
  assert.equal((await fetch(base + "/api/auth/session", { headers: { Cookie: "nmai_session=forged" } })).status, 401);
  assert.equal((await fetch(base + "/api/auth/admin/accounts")).status, 401);
  await post("admin/accounts", { id: "unknown", status: "approved", courses: [] }, null, 401);
  const admin = await post("admin/login", { passkey: process.env.NMAI_ADMIN_PASSKEY }, null, 200);
  adminCookie = cookieFrom(admin, "nmai_admin"); assert.ok(adminCookie);
  const accounts = await (await fetch(base + "/api/auth/admin/accounts", { headers: { Cookie: adminCookie } })).json();
  const account = accounts.accounts.find(a => a.email === email);
  assert.ok(account); accountId = account.id;
  assert.equal(account.status, "pending"); assert.equal(account.passwordHash, undefined);
  await post("admin/accounts", { id: accountId, status: "approved", courses: [] }, adminCookie, 200);
  const login = await post("login", { email, password }, null, 200);
  const studentCookie = cookieFrom(login, "nmai_session"); assert.ok(studentCookie);
  assert.match(login.headers.getSetCookie().join(" "), /HttpOnly/i);
  const current = await (await fetch(base + "/api/auth/session", { headers: { Cookie: studentCookie } })).json();
  assert.equal(current.account.email, email); assert.deepEqual(current.account.courses, []);
  const portal = await fetch(base + "/", { headers: { Cookie: studentCookie }, redirect: "manual" });
  assert.equal(portal.status, 200);
  assert.ok(!(await portal.text()).includes("replace;/login;307;"));
  const lockedCourse = await fetch(base + "/courses/network-marketing", { headers: { Cookie: studentCookie }, redirect: "manual" });
  const lockedHtml = await lockedCourse.text();
  assert.ok(lockedCourse.headers.get("location") === "/my-course" || lockedHtml.includes("replace;/my-course;307;"));
  await post("admin/accounts", { id: accountId, status: "approved", courses: ["course-nm"] }, adminCookie, 200);
  const updated = await (await fetch(base + "/api/auth/session", { headers: { Cookie: studentCookie } })).json();
  assert.deepEqual(updated.account.courses, ["course-nm"]);
  const assignedOnly = await (await fetch(base + "/api/auth/my-courses", { headers: { Cookie: studentCookie } })).json();
  assert.deepEqual(assignedOnly.courses.map(c => c.id), ["course-nm"]);
  const selective = await (await fetch(base + "/api/auth/all-courses", { headers: { Cookie: studentCookie } })).json();
  assert.deepEqual(selective.courses.filter(c => c.hasAccess).map(c => c.id), ["course-nm"]);
  await post("admin/accounts", { id: accountId, status: "approved", courses: ["*"] }, adminCookie, 200);
  const allAssigned = await (await fetch(base + "/api/auth/my-courses", { headers: { Cookie: studentCookie } })).json();
  const fullCatalog = await (await fetch(base + "/api/auth/courses", { headers: { Cookie: studentCookie } })).json();
  assert.deepEqual(allAssigned.courses.map(c => c.id), fullCatalog.courses.map(c => c.id));
  const unlocked = await (await fetch(base + "/api/auth/all-courses", { headers: { Cookie: studentCookie } })).json();
  assert.ok(unlocked.courses.every(c => c.hasAccess === true));
  await post("admin/accounts", { id: accountId, status: "approved", courses: [] }, adminCookie, 200);
  const revoked = await (await fetch(base + "/api/auth/my-courses", { headers: { Cookie: studentCookie } })).json();
  assert.deepEqual(revoked.courses, []);
  const relocked = await (await fetch(base + "/api/auth/all-courses", { headers: { Cookie: studentCookie } })).json();
  assert.ok(relocked.courses.every(c => c.hasAccess === false));
  await post("admin/accounts", { id: accountId, status: "suspended", courses: ["course-nm"] }, adminCookie, 200);
  assert.equal((await fetch(base + "/api/auth/session", { headers: { Cookie: studentCookie } })).status, 401);
  assert.equal((await fetch(base + "/api/auth/my-courses", { headers: { Cookie: studentCookie } })).status, 401);
  await post("login", { email, password }, null, 403);
  await post("admin/accounts", { id: accountId, status: "approved", courses: [] }, adminCookie, 200);
  // Revoked tokens stay revoked even after reapproval.
  assert.equal((await fetch(base + "/api/auth/session", { headers: { Cookie: studentCookie } })).status, 401);
  const newLogin = await post("login", { email, password }, null, 200);
  const newCookie = cookieFrom(newLogin, "nmai_session");
  await post("logout", {}, newCookie, 200);
  assert.equal((await fetch(base + "/api/auth/session", { headers: { Cookie: newCookie } })).status, 401);
  const callback = await fetch(base + "/api/auth/google/callback?state=forged&code=fake", { redirect: "manual" });
  assert.equal(callback.status, 307); assert.ok(callback.headers.get("location").includes("/login?notice="));
  assert.equal(cookieFrom(callback, "nmai_session"), undefined);
  if (!process.env.GOOGLE_CLIENT_ID) {
    const google = await fetch(base + "/api/auth/google", { redirect: "manual" });
    assert.match(google.headers.get("location"), /not\+configured/);
  }
  await post("admin/courses", { operation: "save", course: {} }, newCookie, 401);
  const draft = { title: "Temporary Test Course", category: "Test", description: "Test catalog item", lessons: 2, duration: "20m", available: false, href: "#", visual: "network" };
  const added = await post("admin/courses", { operation: "save", course: draft }, adminCookie, 200);
  const newCourse = (await added.json()).course; testCourseId = newCourse.id;
  const edited = await post("admin/courses", { operation: "save", course: { ...newCourse, title: "Updated Test Course", lessons: 3 } }, adminCookie, 200);
  assert.equal((await edited.json()).course.lessons, 3);
  await post("admin/accounts", { id: accountId, status: "approved", courses: [testCourseId] }, adminCookie, 200);
  const catalog = await (await fetch(base + "/api/auth/courses", { headers: { Cookie: adminCookie } })).json();
  assert.ok(catalog.courses.some(c => c.id === testCourseId && c.title === "Updated Test Course"));
  await post("admin/courses", { operation: "delete", id: testCourseId }, adminCookie, 200);
  const afterDelete = await (await fetch(base + "/api/auth/admin/accounts", { headers: { Cookie: adminCookie } })).json();
  assert.deepEqual(afterDelete.accounts.find(a => a.id === accountId).courses, []);
  const beforeRemoval = await post("login", { email, password }, null, 200);
  const removalCookie = cookieFrom(beforeRemoval, "nmai_session");
  await post("admin/accounts", { operation: "delete", id: accountId, email }, removalCookie, 401);
  await post("admin/accounts", { operation: "delete", id: accountId, email }, adminCookie, 200);
  assert.equal((await fetch(base + "/api/auth/session", { headers: { Cookie: removalCookie } })).status, 401);
  await post("login", { email, password }, null, 401);
  for (let refresh = 0; refresh < 2; refresh++) {
    const remaining = await (await fetch(base + "/api/auth/admin/accounts", { headers: { Cookie: adminCookie } })).json();
    assert.ok(!remaining.accounts.some(a => a.email === email), "Deleted account must not return after refresh");
  }
  await post("admin/logout", {}, adminCookie, 200);
  assert.equal((await fetch(base + "/api/auth/admin/accounts", { headers: { Cookie: adminCookie } })).status, 401);
  console.log("PASS: unknown/wrong credentials, free signup portal access with courses locked, admin authorization, course CRUD, My Courses filtering and All Courses locks (none, specific, all, revoked), suspension, reapproval, logout, forged sessions, CSRF, invalid OAuth callback, missing Google setup, account deletion and session revocation.");
} finally {
  const filename = path.join(process.env.NMAI_AUTH_DATA_DIR || ".local-data", "auth.json");
  if (existsSync(filename)) {
    const store = JSON.parse(readFileSync(filename, "utf8"));
    const testIds = new Set(store.accounts.filter(a => a.email === email).map(a => a.id));
    if (testCourseId && store.courses) store.courses = store.courses.filter(c => c.id !== testCourseId);
    store.accounts = store.accounts.filter(a => !testIds.has(a.id));
    store.sessions = store.sessions.filter(s => !testIds.has(s.accountId) && !tokenHashes.has(s.tokenHash));
    writeFileSync(filename + ".test-cleanup", JSON.stringify(store, null, 2), { mode: 0o600 });
    renameSync(filename + ".test-cleanup", filename);
  }
}
