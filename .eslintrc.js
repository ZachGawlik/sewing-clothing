module.exports = {
  extends: ['next/core-web-vitals', 'eslint-config-next'],
  globals: {
    __PATH_PREFIX__: true,
  },
  rules: {
    'no-unused-vars': 'error',
  },
};
