// Own client, talks only to /api/admin/* on api-layer-unified. Not shared
// with check-user-'s js/api.js — a change here can't affect the tenant
// dashboard's requests, because there is no file connecting the two.

async function adminApi(path, options = {}) {
  const session = await currentSession();
  if (!session) throw new Error('Not signed in.');

  const res = await fetch(window.PLATFORM_CONFIG.API_BASE + path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + session.access_token,
      ...(options.headers || {}),
    },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || `Request failed: ${res.status}`);
  return body;
}
