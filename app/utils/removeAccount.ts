/** Delete the server account first; clear browser copies only after success. */
export async function removeAccount(id: string, email: string): Promise<void> {
  const response = await fetch("/api/auth/admin/accounts", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ operation: "delete", id, email }),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Unable to delete account.");
  const matches = (record: { id?: string; email?: string }) => record.id === id || record.email?.toLowerCase() === email.toLowerCase();
  for (const key of ["nmai-students-master", "nmai-enrolled-students"]) {
    try {
      const records = JSON.parse(localStorage.getItem(key) || "[]");
      if (Array.isArray(records)) localStorage.setItem(key, JSON.stringify(records.filter(record => !matches(record))));
    } catch { /* Server deletion succeeded even when the browser cache is unavailable. */ }
  }
  for (const key of ["nmai-student-session", "nmai-student-user"]) {
    try {
      const record = JSON.parse(localStorage.getItem(key) || "null");
      if (record && matches(record)) localStorage.removeItem(key);
    } catch { /* Invalid cached sessions cannot restore a server account. */ }
  }
  window.dispatchEvent(new Event("nmai-accounts-updated"));
}
