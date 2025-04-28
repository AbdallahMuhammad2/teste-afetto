// Este arquivo não deve ter nenhuma importação

// Exportar função para registrar globalmente
function setupProcess() {
  try {
    // Verificar se estamos no navegador
    if (typeof window !== 'undefined') {
      // Definir diretamente na janela global
      window.process = {
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
      
      console.log('Process polyfill has been set up successfully');
    }
  } catch (err) {
    console.error('Failed to set up process polyfill:', err);
  }
}

// Executar imediatamente
setupProcess();

// Também exportar para uso explícito
export default setupProcess;