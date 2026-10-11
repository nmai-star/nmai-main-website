"use client";

import { useCallback, useEffect, useState } from "react";
import type { CourseItem } from "../data/coursesData";

const blank: CourseItem = { id: "", title: "", category: "Network Marketing", description: "", lessons: 0, duration: "", progress: 0, available: false, href: "#", visual: "network" };
export default function CourseManager() {
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [editing, setEditing] = useState<CourseItem | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const refresh = useCallback(() => fetch("/api/auth/courses", { cache: "no-store" }).then(async response => {
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    setCourses(data.courses); setLoaded(true);
    localStorage.setItem("nmai-courses-data", JSON.stringify(data.courses));
    window.dispatchEvent(new Event("nmai-courses-updated"));
  }).catch(error => setMessage(error.message || "Unable to load courses.")), []);
  useEffect(() => { void refresh(); }, [refresh]);
  async function save(course: CourseItem) {
    setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/auth/admin/courses", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ operation: "save", course }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      setEditing(null); await refresh(); setMessage("Course saved. Students will see the updated catalog.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Unable to save course."); }
    finally { setBusy(false); }
  }
  async function remove(course: CourseItem) {
    if (!window.confirm(`Delete "${course.title}" from the catalog and remove its student assignments?`)) return;
    setBusy(true);
    try {
      const response = await fetch("/api/auth/admin/courses", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ operation: "delete", id: course.id }) });
      const data = await response.json(); if (!response.ok) throw new Error(data.message);
      await refresh(); setMessage(data.message);
    } catch (error) { setMessage(error instanceof Error ? error.message : "Unable to delete course."); }
    finally { setBusy(false); }
  }
  return <section className="space-y-4">
    <div className="flex items-center justify-between gap-4"><div><h2 className="text-xl font-bold text-white">Course Management</h2><p className="mt-1 text-sm text-slate-400">Manage the catalog, then assign access to students below. Signup never unlocks courses.</p></div><button disabled={busy} onClick={() => setEditing({ ...blank })} className="shrink-0 rounded-xl bg-cyan-600 px-4 py-2 text-sm font-semibold text-white">Add course</button></div>
    {message && <p role="status" className="rounded-xl bg-white/5 p-3 text-sm text-cyan-200">{message}</p>}
    {editing && <form onSubmit={event => { event.preventDefault(); void save(editing); }} className="space-y-4 rounded-2xl border border-cyan-400/20 bg-[#091122] p-5">
      <h3 className="font-semibold text-white">{editing.id ? "Edit course" : "New course"}</h3>
      <fieldset disabled={busy} className="grid gap-4 md:grid-cols-2">
        {([['title', 'Course title'], ['category', 'Category'], ['duration', 'Duration (e.g. 3h 20m)'], ['href', 'Course page path (# if not ready)']] as const).map(([key, label]) => <label key={key} className="text-xs text-slate-300">{label}<input required={key === 'title' || key === 'category' || key === 'href'} value={editing[key]} onChange={event => setEditing({ ...editing, [key]: event.target.value })} className="mt-2 w-full rounded-lg border border-white/15 bg-[#080E1C] p-3 text-sm text-white" /></label>)}
        <label className="text-xs text-slate-300">Number of lessons<input type="number" min="0" max="10000" required value={editing.lessons} onChange={event => setEditing({ ...editing, lessons: Number(event.target.value) })} className="mt-2 w-full rounded-lg border border-white/15 bg-[#080E1C] p-3 text-sm text-white" /></label>
        <label className="text-xs text-slate-300">Card style<select value={editing.visual} onChange={event => setEditing({ ...editing, visual: event.target.value })} className="mt-2 w-full rounded-lg border border-white/15 bg-[#080E1C] p-3 text-sm text-white">{['network', 'ai', 'design', 'video', 'social', 'business'].map(style => <option key={style}>{style}</option>)}</select></label>
        <label className="text-xs text-slate-300 md:col-span-2">Description<textarea value={editing.description} onChange={event => setEditing({ ...editing, description: event.target.value })} className="mt-2 w-full rounded-lg border border-white/15 bg-[#080E1C] p-3 text-sm text-white" /></label>
        <label className="flex items-center gap-2 text-sm text-slate-300"><input type="checkbox" checked={editing.available} onChange={event => setEditing({ ...editing, available: event.target.checked })} />Available to assigned students</label>
      </fieldset>
      <p className="text-xs text-slate-500">This manages catalog details and access. The course page and lesson content must exist before making a course available.</p>
      <div className="flex gap-3"><button disabled={busy} className="rounded-lg bg-cyan-600 px-4 py-2 text-sm text-white">{busy ? "Saving…" : "Save course"}</button><button disabled={busy} type="button" onClick={() => setEditing(null)} className="px-4 py-2 text-sm text-slate-300">Cancel</button></div>
    </form>}
    {!loaded && <p className="text-slate-400">Loading courses…</p>}
    {loaded && courses.length === 0 && <p className="text-slate-400">No courses yet. Add your first course.</p>}
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{courses.map(course => <article key={course.id} className="rounded-2xl border border-white/10 bg-[#080E1C] p-5"><p className="text-xs text-cyan-300">{course.category}</p><h3 className="mt-2 font-semibold text-white">{course.title}</h3><p className="mt-2 text-sm text-slate-400">{course.description}</p><p className="mt-3 text-xs text-slate-500">{course.lessons} lessons · {course.duration || 'Duration not set'}</p><div className="mt-4 flex flex-wrap gap-3 text-xs"><button disabled={busy} onClick={() => void save({ ...course, available: !course.available })} className={course.available ? "text-emerald-300" : "text-amber-300"}>{course.available ? "Available — unpublish" : "Coming soon — publish"}</button><button disabled={busy} onClick={() => setEditing({ ...course })} className="text-cyan-300">Edit</button><button disabled={busy} onClick={() => void remove(course)} className="text-rose-300">Delete</button></div></article>)}</div>
  </section>;
}
