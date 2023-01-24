/* eslint-disable @typescript-eslint/no-var-requires */
const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

const nextConfig = {
  reactStrictMode: true,
  pageExtensions: [
    'page.tsx',
    'page.ts',
    'page.jsx',
    'page.js',
    'page.mdx',
    'page.md',
  ],
  compiler: {
    emotion: {
      labelFormat: '[filename]--[local]',
    },
  },
};

/** @type {import('next').NextConfig} */
module.exports = withMDX(nextConfig);
