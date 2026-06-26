#!/usr/bin/env node
/**
 * Runs build and package checks used before publish.
 */
const { spawnSync } = require('child_process');
const path = require('path');

const root = path.join(__dirname, '..');
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';

function run(label, args) {
	console.log(`\n==> ${label}`);
	const result = spawnSync(npm, args, { cwd: root, stdio: 'inherit', env: process.env });
	if (result.status !== 0) {
		process.exit(result.status ?? 1);
	}
}

run('Build', ['run', 'build']);
run('Package verification', ['run', 'verify']);
run('Lint', ['run', 'lint']);

require('./verify-strapi-version');

console.log('\nAudit verification passed.');
