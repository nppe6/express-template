export default {
  '*.{js,cjs,mjs,ts,cts,mts}': ['prettier --write --ignore-unknown', 'eslint --max-warnings=0'],
  '*.{json,jsonc,md,yml,yaml,prisma}': 'prettier --write --ignore-unknown',
}
