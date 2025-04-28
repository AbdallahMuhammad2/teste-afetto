import { useEffect } from 'react';
import '../styles/globals.css';
import ProcessPolyfill from '../components/ProcessPolyfill';

// Polyfill para o process no cliente
if (typeof window !== 'undefined') {
  window.process = window.process || {
    env: {
      NODE_ENV: 'production',
      __NEXT_IMAGE_OPTS: {
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        path: '/_next/image',
        loader: 'default',
        domains: [],
      },
    },
  };
}

function MyApp({ Component, pageProps }) {
  return (
    <>
      <ProcessPolyfill />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;