import type { NextConfig } from 'next'

// NOTE (adapted from Prompt 01, STEP 03):
// The original prompt targeted Next.js 14 with a custom `webpack`
// function. This project runs Next.js 16, where Turbopack is the
// default bundler for `dev` and `build`, and a `webpack` block would
// be ignored. The original webpack tweaks are no longer required:
//   • simplex-noise@4 is pure ESM and resolves natively.
//   • `sharp` is handled by Next automatically.
//   • Tone.js ("self is not defined" on the server) is kept out of
//     the server bundle via the stable `serverExternalPackages`.
// The three.js stack is still listed in `transpilePackages` so its
// ESM internals transpile cleanly across the app.
const nextConfig: NextConfig = {
  // React StrictMode double-invokes mount/unmount in dev. For a
  // Three.js / React-Three-Fiber app that manually manages WebGL
  // contexts, geometries and materials, this causes disposal races
  // and intermittent blank/incorrect renders. Disable it so dev
  // matches production behavior (prod never double-mounts).
  reactStrictMode: false,

  transpilePackages: [
    'three',
    '@react-three/fiber',
    '@react-three/drei',
    '@react-spring/three',
  ],

  // Tone.js must not be bundled for the server (uses `self`):
  serverExternalPackages: ['tone'],
}

export default nextConfig
