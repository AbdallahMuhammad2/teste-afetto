import Script from 'next/script';

export default function ProcessPolyfill() {
  return (
    <Script
      id="process-polyfill"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          if (typeof window !== 'undefined') {
            window.process = window.process || {
              env: {
                NODE_ENV: 'production',
                __NEXT_IMAGE_OPTS: {
                  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
                  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
                  path: '/_next/image',
                  loader: 'default',
                  domains: []
                }
              }
            };
          }
        `
      }}
    />
  );
}