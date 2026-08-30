// Same mechanism as check-user-'s auth.js — real Supabase Auth — because
// there is genuinely only one correct way to do this, not because the code
// is shared. This file is not imported by, and does not import, anything
// in check-user-. Whether a signed-in user is actually an admin is decided
// server-side, by api-layer-unified's middleware/adminAuth.js checking
// platform_admins — this file only gets someone a session, not access.

if (!window.PLATFORM_CONFIG.SUPABASE_URL || !window.PLATFORM_CONFIG.SUPABASE_ANON_KEY) {
  document.addEventListener('DOMContentLoaded', () => {
    document.body.innerHTML = '<div style="padding:40px;font-family:monospace;color:#ff7b72;">js/config.js is not filled in.</div>';
  });
  throw new Error('Missing Supabase config');
}

const supabaseClient = window.supabase.createClient(
  window.PLATFORM_CONFIG.SUPABASE_URL,
  window.PLATFORM_CONFIG.SUPABASE_ANON_KEY
);

async function currentSession() {
  const { data } = await supabaseClient.auth.getSession();
  return data.session;
}

async function signIn(email, password) {
  const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.session;
}

async function signOut() {
  await supabaseClient.auth.signOut();
}
