// The admin shell. No signup here on purpose — a platform admin account is
// granted (a row in platform_admins) by an existing admin, not self-served.
// Same per-panel error isolation pattern as check-user-'s dashboard.js, in
// its own copy — not a shared file.

const PANELS = {
  tenants: renderTenantsPanel,
  directory: renderDirectoryPanel,
  'apps-catalog': renderAppsCatalogPanel,
  'connectors-catalog': renderConnectorsCatalogPanel,
};
let currentTab = 'tenants';

async function boot() {
  const session = await currentSession();
  if (session) return renderApp();
  renderLogin();
}

function renderLogin() {
  const root = document.getElementById('root');
  root.innerHTML = `
    <div class="login-box">
      <h1>Admin sign in</h1>
      <input id="email" type="email" placeholder="Email">
      <input id="password" type="password" placeholder="Password">
      <button id="signin">Sign in</button>
      <div id="login-error" class="error"></div>
    </div>
  `;
  document.getElementById('signin').addEventListener('click', async () => {
    try {
      await signIn(document.getElementById('email').value.trim(), document.getElementById('password').value);
      renderApp();
    } catch (e) {
      document.getElementById('login-error').textContent = e.message;
    }
  });
}

async function renderApp() {
  const root = document.getElementById('root');
  root.innerHTML = `
    <header>
      <strong>⚙ Platform Admin</strong>
      <button id="signout" class="outline">Sign out</button>
    </header>
    <nav id="nav"></nav>
    <main id="main"></main>
  `;
  document.getElementById('signout').addEventListener('click', async () => { await signOut(); boot(); });
  renderNav();
}

function renderNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  nav.innerHTML = Object.keys(PANELS).map(id =>
    `<a data-tab="${id}" class="${id === currentTab ? 'active' : ''}">${id.replace('-', ' ')}</a>`
  ).join('');
  nav.querySelectorAll('a[data-tab]').forEach(a => {
    a.addEventListener('click', () => { currentTab = a.getAttribute('data-tab'); renderNav(); renderCurrentPanel(); });
  });
  renderCurrentPanel();
}

async function renderCurrentPanel() {
  const main = document.getElementById('main');
  if (!main) return;
  try {
    await PANELS[currentTab](main);
  } catch (e) {
    main.innerHTML = `<div class="panel error-panel"><strong>"${currentTab}" failed to load.</strong><br>${e.message}</div>`;
  }
}

boot();
