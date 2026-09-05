import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const readJson = (path) => JSON.parse(readFileSync(new URL(path, root), 'utf8'));

test('all Base44 configuration files contain valid JSON', () => {
  const entityDir = new URL('base44/entities/', root);
  for (const file of readdirSync(entityDir).filter((name) => name.endsWith('.jsonc'))) {
    assert.doesNotThrow(() => readJson(`base44/entities/${file}`), file);
  }
  assert.doesNotThrow(() => readJson('base44/config.jsonc'));
});

test('release-critical entities enforce row-level access', () => {
  for (const entity of ['Order', 'Esim', 'Activation', 'SupportTicket', 'Payment', 'AuditLog', 'User']) {
    const schema = readJson(`base44/entities/${entity}.jsonc`);
    assert.ok(schema.rls, `${entity} must define RLS`);
    assert.notEqual(schema.rls.read, undefined, `${entity} must define read access`);
  }

  const esim = readJson('base44/entities/Esim.jsonc');
  assert.ok(esim.properties.qrCodeUrl.rls?.read, 'QR code must have field-level read protection');
  assert.ok(esim.properties.activationCode.rls?.read, 'activation code must have field-level read protection');
});

test('backend workflow functions have matching declarations and entry points', () => {
  const functionRoot = new URL('base44/functions/', root);
  const expected = ['request-esim', 'manage-esim-request', 'manage-activation'];

  for (const name of expected) {
    const directory = join(functionRoot.pathname, name);
    assert.ok(statSync(directory).isDirectory());
    const definition = readJson(`base44/functions/${name}/function.jsonc`);
    assert.equal(definition.name, name);
    assert.equal(definition.entry, 'index.ts');
    assert.ok(statSync(join(directory, definition.entry)).isFile());
  }
});

test('release does not carry the unused vulnerable rich-text editor', () => {
  const pkg = readJson('package.json');
  assert.equal(pkg.dependencies['react-quill'], undefined);
});

test('role gates protect agent and administrator route groups', () => {
  const app = readFileSync(new URL('src/App.jsx', root), 'utf8');
  assert.match(app, /<RoleRoute minRole="agent"/);
  assert.match(app, /<RoleRoute minRole="admin"/);
  assert.match(app, /<RoleRoute allowedRoles=\{\['super_admin'\]\}/);
});
