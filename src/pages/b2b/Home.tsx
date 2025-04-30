import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight, Download, FileText } from 'lucide-react';
import LanguageContext from '../../context/LanguageContext';

type B2BHomeProps = {
  resetUserType: () => void;
};

const B2BHome: React.FC<B2BHomeProps> = ({ resetUserType }) => {
  const { language } = useContext(LanguageContext);
  
  const translations = {
    hero: {
      title: {
        pt: 'Soluções de Mobiliário para Profissionais',
        es: 'Soluciones de Mobiliario para Profesionales'
      },
      subtitle: {
        pt: 'Especificações técnicas detalhadas, opções de personalização e preços exclusivos para parceiros.',
        es: 'Especificaciones técnicas detalladas, opciones de personalización y precios exclusivos para socios.'
      },
      cta: {
        pt: 'Explorar Catálogo Técnico',
        es: 'Explorar Catálogo Técnico'
      }
    },
    features: {
      title: {
        pt: 'Recursos para Parceiros',
        es: 'Recursos para Socios'
      },
      items: [
        {
          title: { pt: 'Especificações Técnicas', es: 'Especificaciones Técnicas' },
          description: { 
            pt: 'Acesse detalhes precisos sobre materiais, dimensões, resistência e durabilidade de cada peça.',
            es: 'Acceda a detalles precisos sobre materiales, dimensiones, resistencia y durabilidad de cada pieza.'
          },
          icon: FileText
        },
        {
          title: { pt: 'Catálogos para Download', es: 'Catálogos para Descargar' },
          description: { 
            pt: 'Baixe nossos catálogos técnicos em alta resolução para consulta offline.',
            es: 'Descargue nuestros catálogos técnicos en alta resolución para consulta offline.'
          },
          icon: Download
        },
        {
          title: { pt: 'Personalização em Escala', es: 'Personalización a Escala' },
          description: { 
            pt: 'Opções para personalizar produtos em larga escala para projetos corporativos.',
            es: 'Opciones para personalizar productos a gran escala para proyectos corporativos.'
          },
          icon: FileText
        }
      ]
    },
    catalog: {
      title: {
        pt: 'Catálogo Técnico',
        es: 'Catálogo Técnico'
      },
      subtitle: {
        pt: 'Explore nossa linha de produtos com todos os detalhes técnicos',
        es: 'Explore nuestra línea de productos con todos los detalles técnicos'
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="min-h-screen bg-gradient-to-br from-[#181617] via-[#23201C] to-[#1a1713]"
    >
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-[90px] z-50 flex items-center px-8 bg-[#181617]/90 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-white flex items-center">
            <svg width="50" height="24" viewBox="0 0 120 24" className="text-white">
              <path
                d="M10 4L18 12L10 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M30 6H50"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <span className="ml-3 font-serif tracking-wider text-xl">afetto</span>
            <span className="ml-2 text-accent text-sm border-l border-accent/30 pl-2">B2B</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/especificacoes-tecnicas" className="text-white/70 hover:text-accent transition-colors duration-300">
              {language === 'pt' ? 'Especificações' : 'Especificaciones'}
            </Link>
            <Link to="/catalogo-tecnico" className="text-white/70 hover:text-accent transition-colors duration-300">
              {language === 'pt' ? 'Catálogo' : 'Catálogo'}
            </Link>
            <Link to="/pedidos-atacado" className="text-white/70 hover:text-accent transition-colors duration-300">
              {language === 'pt' ? 'Atacado' : 'Mayoreo'}
            </Link>
            <Link to="/contato" className="text-white/70 hover:text-accent transition-colors duration-300">
              {language === 'pt' ? 'Contato' : 'Contacto'}
            </Link>
          </nav>

          <Link
            to="/area-parceiro"
            className="hidden md:flex items-center text-white border border-white/20 px-5 py-2.5 hover:bg-accent/10 transition-all duration-500"
          >
            <span className="font-light tracking-wider">
              {language === 'pt' ? 'Área do Parceiro' : 'Área del Socio'}
            </span>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-24 relative">
        <motion.div
          className="absolute inset-0 z-0 opacity-20"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2 }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black/30"></div>
          <img
            src="/images/b2b-hero-background.jpg"
            alt="Technical workspace"
            className="w-full h-full object-cover"
          />
        </motion.div>

        <div className="container mx-auto px-6 md:px-20 relative z-10">
          <div className="max-w-3xl">
            <motion.h1
              className="text-5xl md:text-6xl font-serif text-white mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {translations.hero.title[language]}
            </motion.h1>

            <motion.p
              className="text-white/70 text-xl mb-10 leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {translations.hero.subtitle[language]}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Link
                to="/catalogo-tecnico"
                className="inline-flex items-center bg-accent px-8 py-4 text-black font-medium tracking-wide hover:bg-accent/90 transition-colors duration-300"
              >
                <span>{translations.hero.cta[language]}</span>
                <ArrowRight size={16} className="ml-3" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white/[0.03]">
        <div className="container mx-auto px-6 md:px-20">
          <motion.h2
            className="text-4xl font-serif text-white mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {translations.features.title[language]}
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {translations.features.items.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white/[0.06] backdrop-filter backdrop-blur-[8px] p-8 border border-white/10 rounded-lg"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <div className="h-14 w-14 rounded-lg bg-accent/10 flex items-center justify-center mb-6">
                  <feature.icon size={24} className="text-accent" />
                </div>
                <h3 className="text-xl font-medium text-white mb-4">
                  {feature.title[language]}
                </h3>
                <p className="text-white/70 leading-relaxed mb-6">
                  {feature.description[language]}
                </p>
                <Link
                  to="#"
                  className="inline-flex items-center text-accent hover:text-white transition-colors duration-300"
                >
                  <span className="mr-2">
                    {language === 'pt' ? 'Saiba mais' : 'Saber más'}
                  </span>
                  <ChevronRight size={16} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Catalog Preview */}
      <section className="py-24">
        <div className="container mx-auto px-6 md:px-20">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <motion.h2
              className="text-4xl font-serif text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              {translations.catalog.title[language]}
            </motion.h2>
            <motion.p
              className="text-white/70 text-xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {translations.catalog.subtitle[language]}
            </motion.p>
          </div>

          {/* Sample catalog items - would be populated from data */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <motion.div
                key={item}
                className="bg-white/[0.06] backdrop-filter backdrop-blur-[8px] rounded-lg overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: item * 0.1 }}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
              >
                <div className="h-64 overflow-hidden">
                  <img
                    src={`/images/b2b-product-${item}.jpg`}
                    alt={`Technical product ${item}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-white text-xl mb-2">
                    {language === 'pt' ? `Linha Técnica ${item}` : `Línea Técnica ${item}`}
                  </h3>
                  <p className="text-white/60 mb-4">
                    {language === 'pt' 
                      ? 'Especificações completas, materiais e opções de personalização.' 
                      : 'Especificaciones completas, materiales y opciones de personalización.'}
                  </p>
                  <Link
                    to={`/produto-tecnico/${item}`}
                    className="flex items-center text-accent"
                  >
                    <span className="mr-2">
                      {language === 'pt' ? 'Ver detalhes técnicos' : 'Ver detalles técnicos'}
                    </span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link
              to="/catalogo-tecnico"
              className="inline-flex items-center border border-accent/50 px-8 py-4 text-white hover:bg-accent/10 transition-all duration-300"
            >
              <span>
                {language === 'pt' ? 'Ver catálogo completo' : 'Ver catálogo completo'}
              </span>
              <ArrowRight size={16} className="ml-3 text-accent" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 py-12 border-t border-white/10">
        <div className="container mx-auto px-6 md:px-20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div>
              <Link to="/" className="inline-flex items-center mb-6">
                <svg width="40" height="20" viewBox="0 0 120 24" className="text-white">
                  <path
                    d="M10 4L18 12L10 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M30 6H50"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="ml-2 font-serif tracking-wider text-white">afetto</span>
                <span className="ml-1 text-accent text-xs">B2B</span>
              </Link>
              <p className="text-white/60 text-sm">
                {language === 'pt'
                  ? 'Soluções de mobiliário de alta qualidade para profissionais e empresas.'
                  : 'Soluciones de mobiliario de alta calidad para profesionales y empresas.'}
              </p>
            </div>

            <div>
              <h3 className="text-white text-sm font-medium uppercase tracking-wider mb-4">
                {language === 'pt' ? 'Recursos' : 'Recursos'}
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link to="#" className="text-white/60 hover:text-accent transition-colors duration-300">
                    {language === 'pt' ? 'Especificações Técnicas' : 'Especificaciones Técnicas'}
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-white/60 hover:text-accent transition-colors duration-300">
                    {language === 'pt' ? 'Downloads' : 'Descargas'}
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-white/60 hover:text-accent transition-colors duration-300">
                    {language === 'pt' ? 'Preços para Parceiros' : 'Precios para Socios'}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white text-sm font-medium uppercase tracking-wider mb-4">
                {language === 'pt' ? 'Suporte' : 'Soporte'}
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link to="#" className="text-white/60 hover:text-accent transition-colors duration-300">
                    {language === 'pt' ? 'Tornar-se Parceiro' : 'Convertirse en Socio'}
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-white/60 hover:text-accent transition-colors duration-300">
                    {language === 'pt' ? 'Suporte Técnico' : 'Soporte Técnico'}
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-white/60 hover:text-accent transition-colors duration-300">
                    {language === 'pt' ? 'Perguntas Frequentes' : 'Preguntas Frecuentes'}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white text-sm font-medium uppercase tracking-wider mb-4">
                {language === 'pt' ? 'Contato' : 'Contacto'}
              </h3>
              <ul className="space-y-2">
                <li className="text-white/60">
                  {language === 'pt' ? 'parceiros@afettodesign.com' : 'socios@afettodesign.com'}
                </li>
                <li className="text-white/60">
                  +55 (11) 3456-7890
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
            <div className="text-white/40 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} Afetto Design.
            </div>
            <div className="text-white/40 text-sm">
              <Link to="/privacidade" className="hover:text-accent transition-colors duration-300 mr-6">
                {language === 'pt' ? 'Política de Privacidade' : 'Política de Privacidad'}
              </Link>
              <Link to="/termos" className="hover:text-accent transition-colors duration-300 mr-6">
                {language === 'pt' ? 'Termos de Uso' : 'Términos de Uso'}
              </Link>
              <button 
                onClick={resetUserType}
                className="hover:text-accent transition-colors duration-300 text-white/40"
              >
                {language === 'pt' ? 'Alternar para Versão Cliente' : 'Cambiar a Versión Cliente'}
              </button>
            </div>
          </div>
        </div>
      </footer>
    </motion.div>
  );
};

export default B2BHome;