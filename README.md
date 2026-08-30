# master-check

The platform admin dashboard. Standalone — no shared code with
`check-user-` (the tenant dashboard) or any other CultureReset repo. Talks
only to `api-layer-unified`'s `/api/admin/*` routes.

No build step — plain HTML/JS. Open `index.html` in a browser or serve with
any static file server.

## Why this can never be mistaken for the user dashboard

- Different visual identity entirely (dark, monospace) — not a theme toggle
  on shared components.
- Its own `js/auth.js`, `js/api.js`, `js/config.js` — zero files imported
  from or shared with `check-user-`.
- No signup form. A platform admin account is granted by adding a row to
  `platform_admins` — it does not self-serve the way a tenant account does
  in `check-user-`.
- Server-side, `api-layer-unified`'s `middleware/adminAuth.js` checks
  `platform_admins`, a completely different table from the `tenant_members`
  check `middleware/tenantAuth.js` runs. A tenant's session token gets a 403
  here, not partial access.

## The Directory tab

Card-grid layout adapted from `gcr-unified`'s `GCRCard.jsx` (image with a
CSS-only fallback, category badge, name/description below) — but reading
`api-layer-unified`'s `tenant_profiles` table instead of GCR's `entity`
table, and without the GCR-specific pieces (live availability, star
ratings, computed open/closed status) that this platform's simpler profile
model has no data to support. This is the Chamber-of-Commerce white-label
surface: every tenant's listing, editable inline by admin, regardless of
what that tenant has set for themselves in `check-user-`'s Profile tab.

## Why the two catalog managers are separate files

`js/apps-catalog-panel.js` and `js/connectors-catalog-panel.js` are not a
single generic "manage a catalog" component, for the same reason
`api-layer-unified`'s `routes/admin-apps-catalog.js` and
`routes/admin-connectors-catalog.js` aren't merged: Apps and Connectors are
different systems that happen to both need a CRUD screen, not the same
system twice.

## Setup

1. Fill in `js/config.js` — same Supabase project as the other two repos.
2. Serve the folder.
3. Sign up a user through Supabase Auth directly (dashboard or SQL editor —
   not through this app), then add their user id to `platform_admins` in
   the database once. After that, they can sign in here.
4. Use the Tenants tab to see every tenant and what's installed; use the two
   Catalog tabs to define what apps and connectors exist platform-wide.
