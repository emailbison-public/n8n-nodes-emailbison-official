module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
    extraFileExtensions: ['.json'],
  },
  plugins: ['n8n-nodes-base'],
  extends: ['plugin:n8n-nodes-base/community'],
  rules: {
    'n8n-nodes-base/community-package-json-name-still-default': 'error',
    'n8n-nodes-base/node-class-description-credentials-name-unsuffixed': 'error',
    'n8n-nodes-base/node-class-description-display-name-unsuffixed-trigger-node': 'error',
    'n8n-nodes-base/node-class-description-name-unsuffixed-trigger-node': 'error',
    'n8n-nodes-base/node-dirname-against-convention': 'error',
    'n8n-nodes-base/node-execute-block-double-assertion-for-items': 'error',
    'n8n-nodes-base/node-execute-block-missing-continue-on-fail': 'error',
    'n8n-nodes-base/node-filename-against-convention': 'error',
    'n8n-nodes-base/node-class-description-missing-subtitle': 'error',
  },
};
