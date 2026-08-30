// EXTRACTED FROM: Admin-dashboard-main/src/ui/Modal.jsx (the `useConfirm`
// hook) — converted from a React hook returning [confirm, element] to a
// plain function that builds and tears down its own DOM, since this repo
// has no component framework.
//
// WHAT IT DOES: `await confirmAction('Retire this app?')` resolves true/false
// — used before every destructive action instead of a bare confirm()
// (which blocks the whole page and can't be styled) or, worse, no
// confirmation at all.
//
// STATUS: WIRED IN — used by js/apps-catalog-panel.js and
// js/connectors-catalog-panel.js before retiring a catalog entry.

function confirmAction(message, { title = 'Are you sure?' } = {}) {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;z-index:9999;';
    overlay.innerHTML = `
      <div style="background:#161b22;border:1px solid #30363d;border-radius:10px;padding:24px;max-width:360px;font-family:'Courier New',monospace;color:#c9d1d9;">
        <div style="font-weight:700;margin-bottom:10px;">${title}</div>
        <div style="font-size:13px;color:#8b949e;margin-bottom:20px;">${message}</div>
        <div style="display:flex;gap:8px;justify-content:flex-end;">
          <button data-choice="cancel" style="background:transparent;border:1px solid #30363d;color:#c9d1d9;border-radius:6px;padding:6px 14px;cursor:pointer;font-family:inherit;">Cancel</button>
          <button data-choice="confirm" style="background:#da3633;color:#fff;border:none;border-radius:6px;padding:6px 14px;cursor:pointer;font-family:inherit;">Confirm</button>
        </div>
      </div>
    `;

    const close = (result) => { overlay.remove(); resolve(result); };
    overlay.querySelector('[data-choice="cancel"]').addEventListener('click', () => close(false));
    overlay.querySelector('[data-choice="confirm"]').addEventListener('click', () => close(true));
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(false); });
    document.addEventListener('keydown', function onEsc(e) {
      if (e.key === 'Escape') { document.removeEventListener('keydown', onEsc); close(false); }
    });

    document.body.appendChild(overlay);
  });
}
