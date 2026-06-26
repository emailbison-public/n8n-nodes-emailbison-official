const { src, dest, parallel } = require('gulp');

function buildNodeIcons() {
	src('nodes/EmailBison/*.node.json').pipe(dest('dist/nodes/EmailBison'));
	return src('nodes/EmailBison/*.{svg,png}').pipe(dest('dist/nodes/EmailBison'));
}

function buildCredentialIcons() {
	return src('credentials/*.{svg,png}').pipe(dest('dist/credentials'));
}

const buildIcons = parallel(buildNodeIcons, buildCredentialIcons);

exports['build:icons'] = buildIcons;
