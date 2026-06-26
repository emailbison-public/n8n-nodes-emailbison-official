#!/usr/bin/env node
/**
 * Loads the built package the same way n8n does (loadClassInIsolation + derived class names).
 */
const { createContext, Script } = require('vm');
const path = require('path');
const fs = require('fs');

const pkgRoot = path.resolve(__dirname, '..');
const pkg = require(path.join(pkgRoot, 'package.json'));

function assert(condition, message) {
	if (!condition) {
		throw new Error(message);
	}
}

function deriveClassName(sourcePath) {
	return path.parse(sourcePath).name.split('.')[0];
}

function loadClassInIsolation(sourcePath, className) {
	const filePath = path.resolve(pkgRoot, sourcePath).replace(/\\/g, '/');
	assert(fs.existsSync(filePath), `Missing file: ${sourcePath}`);

	const context = createContext({ require });
	try {
		const script = new Script(`new (require('${filePath}').${className})()`);
		return script.runInContext(context);
	} catch (error) {
		if (error instanceof TypeError) {
			throw new Error(
				`Class could not be found for ${sourcePath} (expected export "${className}"). ${error.message}`,
			);
		}
		throw error;
	}
}

for (const nodePath of pkg.n8n.nodes) {
	const className = deriveClassName(nodePath);
	const instance = loadClassInIsolation(nodePath, className);
	assert(instance.description?.name, `Node ${nodePath} must define description.name`);
	console.log(`- node ${nodePath} → ${className} (${instance.description.displayName})`);
}

for (const credentialPath of pkg.n8n.credentials) {
	const className = deriveClassName(credentialPath);
	const instance = loadClassInIsolation(credentialPath, className);
	assert(instance.name, `Credential ${credentialPath} must define name`);
	console.log(`- credential ${credentialPath} → ${className} (${instance.displayName})`);
}

console.log('n8n community node load simulation passed.');

const pkgEntry = require(path.join(pkgRoot, 'index.js'));
assert(typeof pkgEntry.EmailBison === 'function', 'index.js must export EmailBison');
assert(typeof pkgEntry.EmailBisonApi === 'function', 'index.js must export EmailBisonApi');
new pkgEntry.EmailBison();
new pkgEntry.EmailBisonApi();
console.log('- package entry exports EmailBison and EmailBisonApi');
