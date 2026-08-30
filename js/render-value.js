// Ported from Admin-dashboard-main/src/modules/directory/BusinessProfile.jsx
// (renderValue), converted from JSX to a plain HTML-string function since
// this repo has no React/build step. Same idea: infer display from the
// VALUE's shape — a URL-shaped string becomes a link or a thumbnail, a
// boolean becomes Yes/No, an array becomes a joined list — instead of a
// hardcoded per-column format map that breaks the moment a new column shows
// up. Used to render any admin table cell without knowing what the table is.

function renderValue(value) {
  if (value === null || value === undefined || value === '') return '<span class="null">—</span>';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';

  if (Array.isArray(value)) {
    if (!value.length) return '<span class="null">—</span>';
    return value.map(v => (typeof v === 'object' ? JSON.stringify(v) : String(v))).join(', ');
  }

  if (typeof value === 'object') {
    return `<code>${JSON.stringify(value)}</code>`;
  }

  const text = String(value);
  if (/^https?:\/\//i.test(text)) {
    if (/\.(png|jpe?g|webp|gif|avif)(\?|$)/i.test(text)) {
      return `<img class="thumb" src="${text}" alt="" loading="lazy">`;
    }
    const shown = text.length > 48 ? text.slice(0, 45) + '…' : text;
    return `<a class="link" href="${text}" target="_blank" rel="noreferrer">${shown}</a>`;
  }
  return text.length > 160 ? text.slice(0, 157) + '…' : text;
}
