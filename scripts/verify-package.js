const fs = require('fs');
const path = require('path');

const pkg = require('../package.json');
const root = path.join(__dirname, '..');

function assert(condition, message) {
	if (!condition) {
		throw new Error(message);
	}
}

function loadClass(relativePath, exportName) {
	const modulePath = path.join(root, relativePath);
	assert(fs.existsSync(modulePath), `Missing file: ${relativePath}`);
	const loaded = require(modulePath);
	assert(loaded[exportName], `Class ${exportName} not exported from ${relativePath}`);
	return loaded[exportName];
}

const EmailBison = loadClass('dist/nodes/EmailBison/EmailBison.node.js', 'EmailBison');
const EmailBisonApi = loadClass('dist/credentials/EmailBisonApi.credentials.js', 'EmailBisonApi');

assert(typeof EmailBison === 'function', 'EmailBison export must be a class/function');
assert(typeof EmailBisonApi === 'function', 'EmailBisonApi export must be a class/function');

const node = new EmailBison();
assert(node.description?.name === 'emailBison', 'EmailBison node name must be "emailBison"');
assert(Array.isArray(node.description?.properties), 'EmailBison node must define properties');

const credentials = new EmailBisonApi();
assert(credentials.name === 'emailBisonApi', 'Credential name must be emailBisonApi');

for (const nodePath of pkg.n8n.nodes) {
	assert(fs.existsSync(path.join(root, nodePath)), `Configured node missing: ${nodePath}`);
}

for (const credentialPath of pkg.n8n.credentials) {
	assert(fs.existsSync(path.join(root, credentialPath)), `Configured credential missing: ${credentialPath}`);
}

for (const entry of [...pkg.n8n.nodes, ...pkg.n8n.credentials]) {
	const sourcePath = entry.replace(/^dist\//, '').replace(/\.js$/, '.ts');
	assert(
		fs.existsSync(path.join(root, sourcePath)),
		`Creator Portal source file missing in repo: ${sourcePath} (from ${entry})`,
	);
}

assert(fs.existsSync(path.join(root, 'index.js')), 'Root index.js missing from package');
assert(fs.existsSync(path.join(root, 'dist/nodes/EmailBison/emailbison.svg')), 'Node icon missing from dist output');
assert(fs.existsSync(path.join(root, 'dist/credentials/emailbison.svg')), 'Credential icon missing from dist/credentials');

console.log('Package verification passed.');
console.log(`- Node: ${node.description.displayName}`);
console.log(`- Version: ${pkg.version}`);
console.log(`- npm name: ${pkg.name}`);
