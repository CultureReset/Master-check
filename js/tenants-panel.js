// Cross-tenant view. No equivalent in check-user- by construction — the
// tenant dashboard's own token can only ever answer for its own tenant.

async function renderTenantsPanel(container) {
  container.innerHTML = '<div class="panel">Loading tenants…</div>';
  const { tenants } = await adminApi('/api/admin/tenants');

  container.innerHTML = `
    <div class="panel">
      <h2>Tenants</h2>
      <table>
        <thead><tr><th>Slug</th><th>Created</th><th>Apps</th><th>Connectors</th></tr></thead>
        <tbody>
          ${tenants.map(t => `
            <tr>
              <td>${t.slug}</td>
              <td>${renderValue(t.created_at)}</td>
              <td>${t.apps.map(a => `<span class="pill">${a}</span>`).join('') || '<span class="muted">none</span>'}</td>
              <td>${t.connectors.map(c => `<span class="pill">${c.id} (${c.status})</span>`).join('') || '<span class="muted">none</span>'}</td>
            </tr>
          `).join('') || '<tr><td colspan="4" class="muted">No tenants yet.</td></tr>'}
        </tbody>
      </table>
    </div>
  `;
}
