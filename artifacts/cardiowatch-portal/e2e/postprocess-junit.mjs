import { readFileSync, writeFileSync } from 'fs';

const file = new URL('../test-results/e2e/junit.xml', import.meta.url).pathname;

let content = readFileSync(file, 'utf8');

if (!content.startsWith('<?xml')) {
  content = '<?xml version="1.0" encoding="UTF-8" ?>\n' + content;
}

content = content.replace(
  /(<testsuites\b[^>]*\bname=")"/,
  '$1playwright e2e tests"'
);

writeFileSync(file, content);
