// Manages connectors_catalog only, via /api/admin/connectors-catalog. Not
// merged with apps-catalog-panel.js — see that file's comment.

async function renderConnectorsCatalogPanel(container) {
  container.innerHTML = '<div class="panel">Loading connector catalog…</div>';
  const { connectors } = await adminApi('/api/admin/connectors-catalog');

  container.innerHTML = `
    <div class="panel">
      <h2>Connector Catalog</h2>
      <table>
        <thead><tr><th>ID</th><th>Name</th><th>Provider</th><th></th></tr></thead>
        <tbody>
          ${connectors.map(c => `
            <tr>
              <td>${c.id}</td><td>${c.name}</td><td>${c.provider}</td>
              <td><button class="danger" data-remove="${c.id}">Retire</button></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <div class="form-row">
        <input id="conn-id" placeholder="id (e.g. google_calendar)">
        <input id="conn-name" placeholder="name">
        <input id="conn-desc" placeholder="description">
        <input id="conn-composio-app" placeholder="composio app key (optional)">
        <button id="add-connector">Add connector</button>
      </div>
    </div>
  `;

  container.querySelectorAll('button[data-remove]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-remove');
      const ok = await confirmAction(`Retire "${id}" from the catalog? Every tenant currently connected keeps their connection, but no new tenant can add it.`);
      if (!ok) return;
      try {
        await adminApi(`/api/admin/connectors-catalog/${id}`, { method: 'DELETE' });
        showToast(`Retired "${id}".`, { tone: 'success' });
        renderConnectorsCatalogPanel(container);
      } catch (e) { showErrorToast(e); }
    });
  });

  container.querySelector('#add-connector').addEventListener('click', async () => {
    const id = document.getElementById('conn-id').value.trim();
    const name = document.getElementById('conn-name').value.trim();
    const description = document.getElementById('conn-desc').value.trim();
    const composio_app = document.getElementById('conn-composio-app').value.trim();
    try {
      await adminApi('/api/admin/connectors-catalog', {
        method: 'POST',
        body: JSON.stringify({ id, name, description, composio_app: composio_app || undefined }),
      });
      showToast(`Added "${id}" to the catalog.`, { tone: 'success' });
      renderConnectorsCatalogPanel(container);
    } catch (e) { showErrorToast(e); }
  });
}
