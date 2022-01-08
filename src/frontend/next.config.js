/** @type {import('next').NextConfig} */

const flowRight = require('lodash/fp/flowRight');
const withTranspileModules = require('next-transpile-modules');

const nextConfig = {
  reactStrictMode: true,
  domains: ['localhost', 'res.cloudinary.com'],
  formats: ['image/avif', 'image/webp'],
};

module.exports = flowRight(withTranspileModules(['@storify/common']))(
  nextConfig,
);
