// Card-grid layout adapted from gcr-unified/src/components/GCRCard.jsx —
// image with a CSS-only fallback (no second network request if the photo's
// dead), a category badge over the image, name/description below. The
// GCR-specific pieces (live availability badges, distance, star ratings,
// hours-based open/closed status) aren't ported — this platform's
// tenant_profiles has no structured hours or ratings data to compute them
// from, and porting the layout without the data they need would just be
// dead UI. This is the Chamber-of-Commerce white-label surface: every
// listing, editable inline, by admin.

async function renderDirectoryPanel(container) {
  container.innerHTML = '<div class="panel">Loading directory…</div>';
  const { listings } = await adminApi('/api/admin/directory');

  container.innerHTML = `
    <div class="panel">
      <h2>Directory</h2>
      <div class="directory-grid">
        ${listings.map(l => `
          <div class="directory-card" data-tenant="${l.tenant_id}">
            <div class="directory-card-img">
              ${l.photo_url
                ? `<img src="${l.photo_url}" alt="" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">`
                : ''}
              <div class="directory-card-placeholder" style="${l.photo_url ? 'display:none;' : ''}">🏢</div>
              ${l.category ? `<div class="directory-card-badge">${l.category}</div>` : ''}
            </div>
            <div class="directory-card-body">
              <div class="directory-card-name">${l.name}</div>
              ${l.address ? `<div class="directory-card-sub">${l.address}</div>` : ''}
              ${l.description ? `<div class="directory-card-desc">${l.description}</div>` : ''}
              <button class="edit-listing" data-tenant="${l.tenant_id}">Edit</button>
            </div>
          </div>
        `).join('') || '<p class="muted">No tenants yet.</p>'}
      </div>
    </div>
    <div class="panel" id="edit-panel" style="display:none;margin-top:16px;"></div>
  `;

  container.querySelectorAll('.edit-listing').forEach(btn => {
    btn.addEventListener('click', () => {
      const listing = listings.find(l => l.tenant_id === btn.getAttribute('data-tenant'));
      renderEditForm(container, listing);
    });
  });
}

function renderEditForm(container, listing) {
  const editPanel = container.querySelector('#edit-panel');
  const fields = ['category', 'description', 'address', 'phone', 'email', 'hours', 'photo_url'];
  editPanel.style.display = '';
  editPanel.innerHTML = `
    <h2>Edit — ${listing.name}</h2>
    ${fields.map(f => `
      <div style="margin-bottom:10px;">
        <label style="display:block;font-size:11px;text-transform:uppercase;color:#8b949e;margin-bottom:4px;">${f}</label>
        <input data-field="${f}" value="${(listing[f] || '').toString().replace(/"/g, '&quot;')}" style="width:100%;">
      </div>
    `).join('')}
    <button id="save-listing">Save</button>
  `;
  editPanel.querySelector('#save-listing').addEventListener('click', async () => {
    const data = {};
    fields.forEach(f => { data[f] = editPanel.querySelector(`[data-field="${f}"]`).value; });
    await adminApi(`/api/admin/directory/${listing.tenant_id}`, { method: 'PATCH', body: JSON.stringify(data) });
    renderDirectoryPanel(container);
  });
  editPanel.scrollIntoView({ behavior: 'smooth' });
}
