import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          {/* Script polyfill corrigido (sem o atributo strategy) */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                // Verificação segura para window antes de definir process
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
                        formats: ['image/webp']
                      }
                    }
                  };
                }
              `
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;