# Extracted patterns (frontend)

Same rule as `Check-user-`'s own `js/extracted/` and the backend's
`lib/extracted/` — one file per pattern, sourced and dated, honest about
whether it's wired in. Not shared with `Check-user-` — see the root
README for why the two dashboards never share a file, even for a pattern
this similar.

| File | Pulled from | What it is | Status |
|---|---|---|---|
| `toast.js` | `Admin-dashboard-main/src/ui/Toast.jsx` | Toast queue, `ApiError`-aware messaging | **Wired in** — replaces both `alert()` calls |
| `confirm-modal.js` | `Admin-dashboard-main/src/ui/Modal.jsx` (`useConfirm`) | Promise-based confirm dialog | **Wired in** — used before retiring a catalog entry |
