module.exports = {
  extends: [
    'next/core-web-vitals',
    'eslint-config-next',
    'plugin:@typescript-eslint/recommended',
  ],
  plugins: ['@typescript-eslint'],
  globals: {
    __PATH_PREFIX__: true,
  },
  rules: {
    // TODO: can i configure this just for js idk
    'no-unused-vars': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
  },
};
