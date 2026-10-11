"use client";

import { useCallback, useEffect, useState } from "react";
import { removeAccount } from "../utils/removeAccount";

type Account = {
  id: string; email: string; name: string; createdAt: string;
  status: "pending" | "approved" | "suspended"; courses: string[];
};


export default function AccessRequests() {
  const [courseOptions, setCourseOptions] = useState<string[][]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [selection, setSelection] = useState<Record<string, string[]>>({});
  const refresh = useCallback(() => fetch("/api/auth/admin/accounts", { cache: "no-store" })
    .then(async response => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setAccounts(data.accounts);
      const catalogResponse = await fetch("/api/auth/courses", { cache: "no-store" });
      if (!catalogResponse.ok) throw new Error("Unable to load course catalog.");
      const catalog = await catalogResponse.json();
      setCourseOptions([...catalog.courses.map((c: { id: string; title: string }) => [c.id, c.title]), ["*", "All courses"]]);
      setLoading(false);
    }).catch(error => {
      setMessage(error instanceof Error ? error.message : "Unable to load access requests.");
      setLoading(false);
    }), []);
  useEffect(() => {
    void refresh();
    const interval = setInterval(refresh, 15000);
    window.addEventListener("nmai-courses-updated", refresh);
    window.addEventListener("nmai-accounts-updated", refresh);
    return () => { clearInterval(interval); window.removeEventListener("nmai-courses-updated", refresh); window.removeEventListener("nmai-accounts-updated", refresh); };
  }, [refresh]);
  async function update(account: Account, status: Account["status"]) {
    setBusy(account.id); setMessage("");
    try {
      const response = await fetch("/api/auth/admin/accounts", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: account.id, status, courses: selection[account.id] ?? account.courses }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setMessage(`${account.email}: ${status === "approved" ? "access approved" : status === "suspended" ? "access suspended" : "approval pending"}.`);
      setSelection(current => { const next = { ...current }; delete next[account.id]; return next; });
      await refresh();
    } catch (error) { setMessage(error instanceof Error ? error.message : "Unable to update access."); }
    finally { setBusy(null); }
  }
  async function deleteAccount(account: Account) {
    if (!window.confirm(`Delete ${account.email} and all their login sessions? This cannot be undone. They can register again as a new student with no courses.`)) return;
    setBusy(account.id); setMessage("");
    try {
      await removeAccount(account.id, account.email);
      setSelection(current => { const next = { ...current }; delete next[account.id]; return next; });
      await refresh();
      setMessage(`Account deleted: ${account.email}`);
    } catch (error) { setMessage(error instanceof Error ? error.message : "Unable to delete account."); }
    finally { setBusy(null); }
  }
  return (
    <section className="rounded-2xl border border-cyan-400/20 bg-[#091122] p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white">Student Course Access</h2>
          <p className="mt-1 text-xs text-slate-400">{accounts.length} registered students · Signup gives portal access only. Select courses and save to unlock them.</p>
        </div>
        <button type="button" onClick={() => void refresh()} className="rounded-lg border border-white/20 px-3 py-2 text-xs text-white">Refresh</button>
      </div>
      {message && <p role="status" className="rounded-lg bg-white/5 p-3 text-sm text-cyan-200">{message}</p>}
      {loading ? <p className="text-sm text-slate-400">Loading requests…</p> : accounts.length === 0 ? <p className="py-6 text-sm text-slate-400">No students yet. Signed-up students will appear here automatically.</p> : accounts.map(account => (
        <article key={account.id} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div><h3 className="font-semibold text-white">{account.name}</h3><p className="break-all text-sm text-slate-300">{account.email}</p><p className="mt-1 text-xs text-slate-500">Joined {new Date(account.createdAt).toLocaleDateString()}</p></div>
            <span className={`rounded-full px-3 py-1 text-xs capitalize ${account.status === "approved" ? "bg-emerald-500/15 text-emerald-300" : account.status === "pending" ? "bg-amber-500/15 text-amber-300" : "bg-rose-500/15 text-rose-300"}`}>{account.status === "suspended" ? "Suspended" : account.courses.length ? "Courses assigned" : "Portal only — courses locked"}</span>
          </div>
          <fieldset disabled={busy !== null} className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-300">
            <legend className="mb-2 text-slate-500">Course access</legend>
            {courseOptions.map(([id, label]) => <label key={id} className="flex items-center gap-2"><input type="checkbox" checked={(selection[account.id] ?? account.courses).includes(id)} onChange={event => {
              const current = selection[account.id] ?? account.courses;
              setSelection(values => ({ ...values, [account.id]: event.target.checked ? [...current, id] : current.filter(c => c !== id) }));
            }} />{label}</label>)}
          </fieldset>
          <div className="mt-4 flex flex-wrap gap-2">
            <button disabled={busy !== null} onClick={() => void deleteAccount(account)} className="rounded-lg border border-rose-400/30 px-4 py-2 text-xs text-rose-300 disabled:opacity-50">Delete account</button>
            <button disabled={busy !== null} onClick={() => void update(account, "approved")} className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white disabled:opacity-50">{busy === account.id ? "Saving…" : account.status === "suspended" ? "Restore & save courses" : "Save course access"}</button>
            {account.status !== "suspended" && <button disabled={busy !== null} onClick={() => void update(account, "suspended")} className="rounded-lg border border-rose-400/30 px-4 py-2 text-xs text-rose-300 disabled:opacity-50">{"Suspend account"}</button>}
          </div>
        </article>
      ))}
    </section>
  );
}
