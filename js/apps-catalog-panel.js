// Manages apps_catalog only, via /api/admin/apps-catalog. Not merged with
// connectors-catalog-panel.js even though the CRUD shape is similar — same
// reasoning as api-layer-unified's routes/apps.js vs routes/connectors.js.

async function renderAppsCatalogPanel(container) {
  container.innerHTML = '<div class="panel">Loading app catalog…</div>';
  const { apps } = await adminApi('/api/admin/apps-catalog');

  container.innerHTML = `
    <div class="panel">
      <h2>App Catalog</h2>
      <table>
        <thead><tr><th>ID</th><th>Name</th><th>Description</th><th></th></tr></thead>
        <tbody>
          ${apps.map(a => `
            <tr>
              <td>${a.id}</td><td>${a.name}</td><td>${a.description}</td>
              <td><button class="danger" data-remove="${a.id}">Retire</button></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <div class="form-row">
        <input id="app-id" placeholder="id (e.g. booking)">
        <input id="app-name" placeholder="name">
        <input id="app-desc" placeholder="description">
        <button id="add-app">Add app</button>
      </div>
    </div>
  `;

  container.querySelectorAll('button[data-remove]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-remove');
      const ok = await confirmAction(`Retire "${id}" from the catalog? Every tenant with it installed keeps their existing install, but no new tenant can add it.`);
      if (!ok) return;
      try {
        await adminApi(`/api/admin/apps-catalog/${id}`, { method: 'DELETE' });
        showToast(`Retired "${id}".`, { tone: 'success' });
        renderAppsCatalogPanel(container);
      } catch (e) { showErrorToast(e); }
    });
  });

  container.querySelector('#add-app').addEventListener('click', async () => {
    const id = document.getElementById('app-id').value.trim();
    const name = document.getElementById('app-name').value.trim();
    const description = document.getElementById('app-desc').value.trim();
    try {
      await adminApi('/api/admin/apps-catalog', { method: 'POST', body: JSON.stringify({ id, name, description }) });
      showToast(`Added "${id}" to the catalog.`, { tone: 'success' });
      renderAppsCatalogPanel(container);
    } catch (e) { showErrorToast(e); }
  });
}
