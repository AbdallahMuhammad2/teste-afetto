// Polyfill para resolver o erro "process is not defined"
if (typeof window !== 'undefined') {
  // Verificar se process já existe antes de defini-lo
  if (typeof (window as any).process === 'undefined') {
    (window as any).process = {
      env: {
        NODE_ENV: 'production',
        __NEXT_IMAGE_OPTS: {
          deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
          imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
          path: '/_next/image',
          loader: 'default',
          domains: [],
          disableStaticImages: false,
          minimumCacheTTL: 60,
          formats: ['image/webp']
        }
      }
    };
  }
}

export {};