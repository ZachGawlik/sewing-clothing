/* eslint-disable @typescript-eslint/no-var-requires */
const withPlugins = require('next-compose-plugins');
const optimizedImages = require('next-optimized-images');

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
  images: {
    disableStaticImages: true,
  },
};

/** @type {import('next').NextConfig} */
module.exports = withPlugins([optimizedImages], withMDX(nextConfig));
