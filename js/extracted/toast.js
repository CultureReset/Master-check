// EXTRACTED FROM: Admin-dashboard-main/src/ui/Toast.jsx — own copy, not
// shared with Check-user-'s identical-in-spirit js/extracted/toast.js (see
// that file's header — same source, independently adapted, on purpose).
// Styled for this dashboard's dark/monospace identity instead of
// Check-user-'s light theme.
//
// WHAT IT DOES: a small, auto-dismissing notification — replaces the two
// alert() calls this dashboard had in apps-catalog-panel.js and
// connectors-catalog-panel.js.
//
// STATUS: WIRED IN.

function showToast(message, { tone = 'info', durationMs = 3000 } = {}) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = 'position:fixed;bottom:20px;right:20px;display:flex;flex-direction:column;gap:8px;z-index:9999;';
    document.body.appendChild(container);
  }

  const toneColors = { info: '#58a6ff', error: '#ff7b72', success: '#3fb950' };
  const el = document.createElement('div');
  el.textContent = message;
  el.style.cssText = `background:#161b22;border:1px solid ${toneColors[tone] || toneColors.info};color:${toneColors[tone] || toneColors.info};padding:10px 16px;border-radius:8px;font-size:13px;font-family:'Courier New',monospace;box-shadow:0 4px 12px rgba(0,0,0,0.4);`;
  container.appendChild(el);

  setTimeout(() => el.remove(), durationMs);
}

function showErrorToast(error) {
  const message = (error && error.message) || String(error);
  showToast(message, { tone: 'error', durationMs: 5000 });
}
