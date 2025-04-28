import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import LanguageContext from '../context/LanguageContext';
import Icon from '../components/ui/Icon';
import { translations } from '../data/translations';
import { projects } from '../data/projects';
import FadeInSection from '../components/ui/FadeInSection';

const Home: React.FC = () => {
  const { language } = useContext(LanguageContext);
  const t = translations[language];
  
  // Filter featured projects
  const featuredProjects = projects.filter(project => project.featured);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
    {/* Hero Section - Premium Luxury Edition */}
<section className="relative h-screen overflow-hidden">
  {/* Background layers with enhanced aesthetics */}
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30 z-10"></div>
    <motion.div
      initial={{ scale: 1.05 }}
      animate={{ scale: 1 }}
      transition={{ duration: 8, ease: "easeOut" }}
      className="w-full h-full"
    >
      {/* Premium video background with parallax effect */}
      <video 
        autoPlay 
        muted 
        loop 
        playsInline
        className="w-full h-full object-cover"
      >
        <source src="/videos/luxury-furniture-showcase.mp4" type="video/mp4" />
      </video>
    </motion.div>
    
    {/* Enhanced texture overlays */}
    <div className="absolute inset-0 opacity-30 z-20 mix-blend-overlay" 
      style={{ backgroundImage: 'url(/images/grain-texture.png)' }}>
    </div>
    <div className="absolute inset-0 bg-pattern z-20 opacity-10"></div>
  </div>
  
  {/* Premium decorative elements */}
  <div className="absolute top-0 left-0 w-1/2 h-px bg-gradient-to-r from-transparent via-accent to-transparent z-20"></div>
  <div className="absolute top-0 right-0 w-1/2 h-px bg-gradient-to-l from-transparent via-accent to-transparent z-20"></div>
  <div className="absolute bottom-0 left-0 w-1/4 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent z-20"></div>
  <div className="absolute bottom-0 right-0 w-1/4 h-px bg-gradient-to-l from-transparent via-accent/40 to-transparent z-20"></div>
  
  {/* Animated side accent */}
  <motion.div 
    initial={{ height: 0 }}
    animate={{ height: '40%' }}
    transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
    className="absolute left-0 bottom-0 w-px bg-gradient-to-t from-transparent via-accent/70 to-transparent z-20"
  />
  <motion.div 
    initial={{ height: 0 }}
    animate={{ height: '40%' }}
    transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
    className="absolute right-0 bottom-0 w-px bg-gradient-to-t from-transparent via-accent/70 to-transparent z-20"
  />
  
  {/* Hero content with enhanced typography and layout */}
  <div className="absolute inset-0 flex items-center px-12 md:px-20 lg:px-28 z-30">
    <div className="max-w-3xl">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: 120 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="h-px bg-accent mb-10"
      />
      <motion.h1 
        className="font-serif font-extralight tracking-wide leading-tight mb-8 text-white text-5xl md:text-6xl lg:text-7xl"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
      >
        {t.hero.title}
      </motion.h1>
      <motion.p 
        className="text-xl md:text-2xl text-white/85 mb-14 font-light max-w-xl leading-relaxed"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
      >
        {t.hero.subtitle}
      </motion.p>
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
        className="flex items-center gap-8"
      >
        <Link 
          to="/portfolio" 
          className="group inline-flex items-center px-10 py-4 bg-transparent border border-accent backdrop-blur-sm text-white 
                    hover:bg-accent/20 hover:border-accent/80 transition-all duration-500 overflow-hidden relative"
        >
          <span className="relative z-10 mr-2">{t.hero.cta}</span>
          <ChevronRight className="relative z-10 transform group-hover:translate-x-1 transition-transform" size={18} />
          <div className="absolute inset-0 w-full h-full -translate-x-full group-hover:translate-x-0 transition-transform duration-500 bg-gradient-to-r from-accent/40 to-transparent"></div>
        </Link>
        
        <Link 
          to="/contact" 
          className="text-white/80 hover:text-accent transition-colors duration-300 flex items-center group"
        >
          <span className="border-b border-transparent group-hover:border-accent/60 pb-1">
            {language === 'pt' ? 'Contate-nos' : 'Contáctenos'}
          </span>
        </Link>
      </motion.div>
    </div>
  </div>
  
  {/* Elegant scroll indicator with enhanced animation */}
  <motion.div 
    className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-30"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1, delay: 1.4 }}
  >
    <motion.div 
      className="flex flex-col items-center"
      animate={{ y: [0, 10, 0] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className="text-white/60 text-xs uppercase tracking-widest mb-3 font-light">
        {language === 'pt' ? 'Explore' : 'Explorar'}
      </div>
      <div className="flex flex-col items-center">
        <div className="w-px h-10 bg-gradient-to-b from-white/10 via-white/40 to-white/10"></div>
        <motion.div 
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-1.5 h-1.5 rounded-full bg-accent mt-1"
        />
      </div>
    </motion.div>
  </motion.div>
  
  {/* Enhanced floating header with glass effect */}
  <motion.div 
    className="absolute top-0 inset-x-0 px-10 py-8 z-40 flex justify-between items-center"
    initial={{ y: -20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 1 }}
  >
    <Link to="/" className="text-white text-2xl font-serif relative group">
      <span className="relative z-10">Afetto</span>
      <motion.div 
        className="absolute bottom-0 left-0 h-px w-0 bg-accent group-hover:w-full transition-all duration-300"
        initial={{ width: 0 }}
        animate={{ width: [0, '100%', '30%'] }}
        transition={{ duration: 1.5, delay: 1, ease: "easeInOut" }}
      />
    </Link>
    <div className="hidden md:flex items-center gap-10 text-white/80">
      {['portfolio', 'about', 'contact'].map((item, index) => (
        <Link 
          key={item} 
          to={`/${item}`} 
          className="relative group py-2 overflow-hidden"
        >
          <motion.span
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 + (index * 0.1) }}
            className="hover:text-white transition-colors duration-300"
          >
            {language === 'pt' 
              ? item === 'portfolio' ? 'Portfólio' : item === 'about' ? 'Sobre' : 'Contato'
              : item === 'portfolio' ? 'Portafolio' : item === 'about' ? 'Sobre' : 'Contacto'
            }
          </motion.span>
          <div className="absolute bottom-0 left-0 w-full h-px bg-white/20 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
        </Link>
      ))}
    </div>
  </motion.div>
  
  {/* Decorative floating elements */}
  <motion.div
    initial={{ opacity: 0, rotate: 0 }}
    animate={{ opacity: 0.15, rotate: 360 }}
    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
    className="absolute top-1/4 right-1/4 w-96 h-96 border border-accent/30 rounded-full z-10"
  />
  <motion.div
    initial={{ opacity: 0, rotate: 0 }}
    animate={{ opacity: 0.1, rotate: -360 }}
    transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
    className="absolute bottom-1/4 left-1/4 w-64 h-64 border border-accent/20 rounded-full z-10"
  />
</section>
      
      {/* Featured Projects */}
      <section className="section bg-white">
        <div className="container-narrow">
          <FadeInSection>
            <h2 className="text-3xl md:text-4xl font-serif mb-2">{t.portfolio.title}</h2>
            <p className="text-neutral-600 mb-12">{t.portfolio.subtitle}</p>
          </FadeInSection>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project, index) => (
              <FadeInSection key={project.id} delay={index * 150}>
                <div className="group relative overflow-hidden rounded-md shadow-md h-80">
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <h3 className="text-white text-xl font-serif">{project.title}</h3>
                    <p className="text-white/80 mt-2">{project.description[language]}</p>
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link 
              to="/portfolio"
              className="inline-flex items-center px-6 py-3 bg-accent text-white hover:bg-accent-dark transition-colors duration-300"
            >
              {t.hero.cta}
              <ChevronRight className="ml-2" size={18} />
            </Link>
          </div>
        </div>
      </section>
      
      {/* About Section Preview */}
      <section className="py-20 md:py-28 bg-neutral-100 overflow-hidden">
        <div className="container mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="md:pr-10 order-2 md:order-1">
              <FadeInSection>
                <div className="text-accent uppercase tracking-widest text-sm font-medium mb-3">{t.about.subtitle}</div>
                <h2 className="text-4xl md:text-5xl font-serif mb-6">{t.about.title}</h2>
                <div className="h-0.5 w-16 bg-accent mb-8"></div>
                
                <p className="text-neutral-700 leading-relaxed mb-8 text-lg">{t.about.story}</p>
                
                <div className="mt-10 flex flex-wrap gap-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mr-4">
                      <Icon icon="quality" className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-medium">{t.about.quality}</h4>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mr-4">
                      <Icon icon="craftsmanship" className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-medium">{t.about.craftsmanship}</h4>
                    </div>
                  </div>
                </div>
                
                <Link 
                  to="/about"
                  className="group inline-flex items-center mt-10 text-accent hover:text-accent-dark transition-colors border-b border-accent pb-1"
                >
                  {language === 'pt' ? 'Nossa história completa' : 'Nuestra historia completa'}
                  <motion.div
                    className="ml-2"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                  >
                    <ChevronRight size={16} />
                  </motion.div>
                </Link>
              </FadeInSection>
            </div>
            
            <div className="relative order-1 md:order-2">
              <FadeInSection delay={200}>
                <div className="relative z-10">
                  <img 
                    src="https://images.pexels.com/photos/4207707/pexels-photo-4207707.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                    alt="Workshop" 
                    className="rounded-sm shadow-xl w-full h-auto"
                  />
                </div>
                <div className="absolute -bottom-10 -left-10 z-0 w-full h-full border-2 border-accent rounded-sm"></div>
              </FadeInSection>
            </div>
          </div>
        </div>
      </section>
      
      {/* Customization Preview */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container max-w-7xl mx-auto px-6 md:px-8">
          <FadeInSection>
            <div className="mb-16 max-w-2xl mx-auto text-center">
              <div className="text-accent uppercase tracking-widest text-sm font-medium mb-3">{'Process Title'}</div>
              <h2 className="text-4xl md:text-5xl font-serif mb-5">{t.customization.title}</h2>
              <div className="h-0.5 w-16 bg-accent mx-auto mb-5"></div>
              <p className="text-neutral-600 text-lg">{t.customization.subtitle}</p>
            </div>
          </FadeInSection>
          
          <div className="relative">
            {/* Process connector line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-accent/20 hidden md:block"></div>
            
            <div className="space-y-16 md:space-y-24 relative">
              <FadeInSection delay={100}>
                <div className="flex flex-col md:flex-row items-center">
                  <div className="md:w-5/12 relative">
                    <div className="bg-neutral-50 p-8 md:p-10 rounded-sm shadow-sm">
                      <div className="absolute -top-4 -left-4 w-12 h-12 bg-accent text-white rounded-full flex items-center justify-center text-xl font-medium z-10">
                        1
                      </div>
                      <h3 className="text-2xl font-serif mb-4">{t.customization.step1}</h3>
                      <p className="text-neutral-600">{t.customization.step1Desc}</p>
                    </div>
                  </div>
                  
                  <div className="md:w-2/12 flex justify-center py-6 md:py-0">
                    <div className="w-10 h-10 rounded-full border-2 border-accent bg-white z-10 flex items-center justify-center">
                      <div className="w-3 h-3 bg-accent rounded-full"></div>
                    </div>
                  </div>
                  
                  <div className="md:w-5/12">
                    <img 
                      src="/images/consultation.jpg" 
                      alt="Consultation" 
                      className="rounded-sm shadow-md"
                    />
                  </div>
                </div>
              </FadeInSection>
              
              <FadeInSection delay={200}>
                <div className="flex flex-col md:flex-row items-center">
                  <div className="md:w-5/12 md:order-3 relative">
                    <div className="bg-neutral-50 p-8 md:p-10 rounded-sm shadow-sm">
                      <div className="absolute -top-4 -left-4 w-12 h-12 bg-accent text-white rounded-full flex items-center justify-center text-xl font-medium z-10">
                        2
                      </div>
                      <h3 className="text-2xl font-serif mb-4">{t.customization.step2}</h3>
                      <p className="text-neutral-600">{t.customization.step2Desc}</p>
                    </div>
                  </div>
                  
                  <div className="md:w-2/12 flex justify-center py-6 md:py-0 md:order-2">
                    <div className="w-10 h-10 rounded-full border-2 border-accent bg-white z-10 flex items-center justify-center">
                      <div className="w-3 h-3 bg-accent rounded-full"></div>
                    </div>
                  </div>
                  
                  <div className="md:w-5/12 md:order-1">
                    <img 
                      src="/images/design.jpg" 
                      alt="Design Process" 
                      className="rounded-sm shadow-md"
                    />
                  </div>
                </div>
              </FadeInSection>
            </div>
          </div>
          
          <div className="text-center mt-16">
            <Link 
              to="/customization"
              className="group inline-flex items-center px-8 py-4 bg-accent text-white hover:bg-accent-dark transition-all duration-300"
            >
              <span>{language === 'pt' ? 'Explore nosso processo' : 'Explore nuestro proceso'}</span>
              <motion.div
                className="ml-2"
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              >
                <ChevronRight size={18} />
              </motion.div>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Contact CTA */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
            alt="Interior design" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-black/40"></div>
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent/20 to-transparent"
        ></motion.div>
        
        <div className="relative container mx-auto px-6 md:px-8 text-center">
          <FadeInSection>
            <div className="max-w-2xl mx-auto">
              <div className="inline-block mb-6">
                <div className="w-16 h-16 rounded-full border-2 border-accent/50 flex items-center justify-center mx-auto">
                  <div className="w-12 h-12 rounded-full border-2 border-accent/80 flex items-center justify-center">
                    <div className="w-6 h-6 bg-accent rounded-full"></div>
                  </div>
                </div>
              </div>
              
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-6 text-white leading-tight">
                {language === 'pt' ? 'Transforme sua casa em um espaço único' : 'Transforme su hogar en un espaço único'}
              </h2>
              
              <p className="text-xl text-white/80 mb-10">
                {language === 'pt' 
                  ? 'Entre em contato conosco para iniciar seu projeto personalizado hoje mesmo.' 
                  : 'Contáctenos para iniciar su proyecto personalizado hoy mismo.'}
              </p>
              
              <Link 
                to="/contact"
                className="group inline-flex items-center px-10 py-5 bg-white text-black hover:bg-accent hover:text-white transition-all duration-500"
              >
                <span className="text-lg">{language === 'pt' ? 'Solicitar Orçamento' : 'Solicitar Presupuesto'}</span>
                <ChevronRight className="ml-2 transform group-hover:translate-x-1 transition-transform" size={20} />
              </Link>
            </div>
          </FadeInSection>
        </div>
      </section>
    </motion.div>
  );
};

export default Home;