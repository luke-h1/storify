/** @type {import('next').NextConfig} */
const flowRight = require('lodash/fp/flowRight');
const withTranspileModules = require('next-transpile-modules');

const nextConfig = {
  reactStrictMode: true,
};

module.exports = flowRight(withTranspileModules(['@storify/common']))(
  nextConfig,
);
