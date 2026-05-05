/** Server-side Supabase REST helpers (service_role) */

const URL_ = () => {
  const u = process.env.SUPABASE_URL;
  if (!u) throw new Error("SUPABASE_URL missing");
  return u;
};
const KEY = () => {
  const k = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!k) throw new Error("SUPABASE_SERVICE_ROLE_KEY missing");
  return k;
};

const headers = () => ({
  apikey: KEY(),
  Authorization: `Bearer ${KEY()}`,
  "Content-Type": "application/json",
});

export async function sbInsert<T>(
  table: string,
  rows: Record<string, unknown> | Record<string, unknown>[],
  options?: { onConflict?: string; returning?: boolean },
): Promise<T[]> {
  const prefer: string[] = [];
  if (options?.onConflict) prefer.push("resolution=merge-duplicates");
  if (options?.returning !== false) prefer.push("return=representation");

  const url = options?.onConflict
    ? `${URL_()}/rest/v1/${table}?on_conflict=${options.onConflict}`
    : `${URL_()}/rest/v1/${table}`;

  const r = await fetch(url, {
    method: "POST",
    headers: { ...headers(), Prefer: prefer.join(",") },
    body: JSON.stringify(rows),
  });
  if (!r.ok) {
    const t = await r.text();
    throw new Error(`Supabase insert failed (${r.status}): ${t}`);
  }
  if (!options?.returning) return [];
  return r.json();
}

export async function sbSelect<T>(
  table: string,
  filters: Record<string, string> = {},
  options?: { single?: boolean; columns?: string },
): Promise<T[]> {
  const params = new URLSearchParams();
  if (options?.columns) params.set("select", options.columns);
  for (const [k, v] of Object.entries(filters)) params.set(k, v);
  const url = `${URL_()}/rest/v1/${table}?${params}`;
  const r = await fetch(url, { headers: headers() });
  if (!r.ok) {
    const t = await r.text();
    throw new Error(`Supabase select failed (${r.status}): ${t}`);
  }
  return r.json();
}

export async function sbUpdate<T>(
  table: string,
  filters: Record<string, string>,
  patch: Record<string, unknown>,
): Promise<T[]> {
  const params = new URLSearchParams(filters);
  const r = await fetch(`${URL_()}/rest/v1/${table}?${params}`, {
    method: "PATCH",
    headers: { ...headers(), Prefer: "return=representation" },
    body: JSON.stringify(patch),
  });
  if (!r.ok) {
    const t = await r.text();
    throw new Error(`Supabase update failed (${r.status}): ${t}`);
  }
  return r.json();
}
