// EXTRACTED FROM: Admin-dashboard-main/src/ui/SchemaForm.jsx +
// src/ui/Field.jsx — independently found again in Dashboards-users-
// (schemaDiscovery.js + RowEditor.jsx) and cybercheck-web (RowEditor.jsx),
// three unrelated repos converging on the same design. This is the
// single most-repeated finding across the entire 11-repo sweep.
//
// WHAT IT DOES: a field descriptor ({name, label, type, required, visible,
// validate, transform}) drives everything — type-aware default seeding,
// per-field validation, conditional visibility, and (from RowEditor.jsx's
// version specifically) collecting only the fields that actually CHANGED
// from their starting value on submit, so a save never clobbers a field
// nobody touched. Converted from React state/JSX to plain functions plus a
// DOM-builder registry, since this repo has no component framework — the
// logic ports over exactly, only the rendering mechanism changes.
//
// STATUS: WIRED IN — replaces the hand-wired flat input list in
// js/directory-panel.js's edit form with real per-field types (email,
// url-as-image-preview) and change-tracking.

const CONTROLS = {
  text: (field, value) => `<input type="text" data-field="${field.name}" value="${escapeAttr(value)}" placeholder="${field.label}">`,
  textarea: (field, value) => `<textarea data-field="${field.name}" placeholder="${field.label}">${escapeHtml(value)}</textarea>`,
  email: (field, value) => `<input type="email" data-field="${field.name}" value="${escapeAttr(value)}" placeholder="${field.label}">`,
  url: (field, value) => `<input type="url" data-field="${field.name}" value="${escapeAttr(value)}" placeholder="${field.label}">`,
  boolean: (field, value) => `<select data-field="${field.name}"><option value="true" ${value ? 'selected' : ''}>Yes</option><option value="false" ${!value ? 'selected' : ''}>No</option></select>`,
  select: (field, value) => `<select data-field="${field.name}">${(field.options || []).map(o => `<option value="${o}" ${o === value ? 'selected' : ''}>${o}</option>`).join('')}</select>`,
};

function registerControl(type, builderFn) {
  CONTROLS[type] = builderFn;
}

function escapeHtml(s) { return String(s ?? '').replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c])); }
function escapeAttr(s) { return escapeHtml(s).replace(/"/g, '&quot;'); }

function defaultForType(type) {
  if (type === 'boolean') return false;
  if (type === 'number') return null;
  return '';
}

function buildInitial(fields, initialValues = {}) {
  const out = {};
  for (const field of fields) {
    out[field.name] = initialValues[field.name] ?? (
      typeof field.defaultValue === 'function' ? field.defaultValue() : field.defaultValue ?? defaultForType(field.type)
    );
  }
  return out;
}

function visibleFields(fields, values) {
  return fields.filter((f) => (typeof f.visible === 'function' ? f.visible(values) : true));
}

function validateFields(fields, values) {
  const errors = {};
  for (const field of visibleFields(fields, values)) {
    if (field.required && !values[field.name]) errors[field.name] = `${field.label} is required.`;
    else if (typeof field.validate === 'function') {
      const message = field.validate(values[field.name], values);
      if (message) errors[field.name] = message;
    }
  }
  return errors;
}

// The RowEditor.jsx detail: only fields that actually changed from
// initialValues are included, so a save can never blank out a field
// nobody touched (and, for a PATCH endpoint, never sends unchanged noise).
// Precondition: `values` must be a FULL object covering every field (as
// readFormValues() below always produces) — a partial object will read as
// "every missing field changed," since undefined never equals a default.
function collectChangedValues(fields, values, initialValues = {}) {
  const out = {};
  for (const field of fields) {
    let value = values[field.name];
    if (typeof field.transform === 'function') value = field.transform(value, values);
    if (value !== (initialValues[field.name] ?? defaultForType(field.type))) out[field.name] = value;
  }
  return out;
}

function renderFieldHtml(field, value) {
  const builder = CONTROLS[field.type] || CONTROLS.text;
  return `
    <div class="schema-form-field" style="margin-bottom:10px;">
      <label style="display:block;font-size:11px;text-transform:uppercase;color:#8b949e;margin-bottom:4px;">${field.label}${field.required ? ' *' : ''}</label>
      ${builder(field, value)}
      <div class="schema-form-error" data-error-for="${field.name}" style="color:#ff7b72;font-size:12px;margin-top:2px;"></div>
    </div>
  `;
}

function readFormValues(container, fields) {
  const values = {};
  for (const field of fields) {
    const el = container.querySelector(`[data-field="${field.name}"]`);
    if (!el) continue;
    values[field.name] = field.type === 'boolean' ? el.value === 'true' : el.value;
  }
  return values;
}
