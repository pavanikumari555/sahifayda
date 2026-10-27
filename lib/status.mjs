export async function serviceStatus(id) {
  if (!['monthly','compare','guidance','sia'].includes(id)) throw new Error('Unknown service.');
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key || !/^https:\/\/[a-z0-9]+\.supabase\.co\/?$/.test(url)) throw new Error('Service configuration is missing or invalid.');
  const response = await fetch(`${url}/rest/v1/service_status?id=eq.${encodeURIComponent(id)}&select=state,message_en,message_hi`, { headers: { apikey: key }, cache: 'no-store', signal: AbortSignal.timeout(8000) });
  if (!response.ok) throw new Error('Service status could not be checked. Try again.');
  const rows = await response.json();
  if (!Array.isArray(rows) || rows.length !== 1 || !['active','paused','hidden'].includes(rows[0].state) || typeof rows[0].message_en !== 'string' || typeof rows[0].message_hi !== 'string' || rows[0].message_en.length>1000 || rows[0].message_hi.length>1000) throw new Error('Service is unavailable.');
  return rows[0];
}
