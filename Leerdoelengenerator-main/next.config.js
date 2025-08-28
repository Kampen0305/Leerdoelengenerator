/** @type {import('next').NextConfig} */
const nextConfig = {
  // Laat deze op false tenzij je SPA-export gebruikt
  output: undefined,
  trailingSlash: false,
  // GEEN rewrite/redirect die /begrippen overschrijft
};

module.exports = nextConfig;
