export async function serviceStatus(id) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error('Service configuration is missing.');
  const response = await fetch(`${url}/rest/v1/service_status?id=eq.${encodeURIComponent(id)}&select=state,message_en,message_hi`, { headers: { apikey: key }, cache: 'no-store', signal: AbortSignal.timeout(8000) });
  if (!response.ok) throw new Error('Service status could not be checked. Try again.');
  const rows = await response.json();
  if (rows.length !== 1) throw new Error('Service is unavailable.');
  return rows[0];
}
