#!/usr/bin/env node
/**
 * Warns when n8n's verified catalog still pins an older npm version than local package.json.
 * Verified installs use the Strapi npmVersion (not npm latest), which causes "Class could not be found"
 * until Creator Portal is updated after a fix release.
 */
const https = require('https');
const pkg = require('../package.json');

const url =
	'https://api.n8n.io/api/community-nodes?filters[packageName][$eq]=n8n-nodes-emailbison-official&fields[0]=npmVersion&pagination[pageSize]=1';

https
	.get(url, (res) => {
		let body = '';
		res.on('data', (chunk) => {
			body += chunk;
		});
		res.on('end', () => {
			try {
				const json = JSON.parse(body);
				const catalogVersion = json.data?.[0]?.attributes?.npmVersion;
				if (!catalogVersion) {
					console.log('n8n verified catalog: package not listed (unverified install uses npm latest).');
					return;
				}
				if (catalogVersion !== pkg.version) {
					console.warn(
						`WARNING: n8n verified catalog npmVersion is ${catalogVersion} but local package is ${pkg.version}.`,
					);
					console.warn(
						'Verified installs will keep serving the catalog version until Creator Portal is updated.',
					);
					return;
				}
				console.log(`n8n verified catalog npmVersion matches local release (${catalogVersion}).`);
			} catch (error) {
				console.warn('Could not read n8n verified catalog version:', error.message);
			}
		});
	})
	.on('error', (error) => {
		console.warn('Could not reach n8n verified catalog:', error.message);
	});
