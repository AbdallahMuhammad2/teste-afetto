import React, { useContext, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import LanguageContext from '../context/LanguageContext';
import { translations } from '../data/translations';
import { Medal, Paintbrush, Leaf, PenTool as Tool, ArrowRight, MapPin, Calendar, Users, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const About: React.FC = () => {
  const { language } = useContext(LanguageContext);
  const t = translations[language];

  // Refs for scroll animations
  const heroRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);
  const teamRef = useRef<HTMLDivElement>(null);
  const atelierRef = useRef<HTMLDivElement>(null);

  // Scroll based animations
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const heroScale = useTransform(heroScrollProgress, [0, 1], [1, 1.1]);
  const heroOpacity = useTransform(heroScrollProgress, [0, 0.8], [1, 0]);
  const heroTextY = useTransform(heroScrollProgress, [0, 1], [0, 100]);

  // Timeline data
  const timeline = [
    {
      year: '2008',
      title: language === 'pt' ? 'Os primeiros passos' : 'Los primeros pasos',
      description: language === 'pt'
        ? 'Fundação da empresa com foco em peças personalizadas para residências de alto padrão.'
        : 'Fundación de la empresa con enfoque en piezas personalizadas para residencias de alto estándar.'
    },
    {
      year: '2012',
      title: language === 'pt' ? 'Expansão do ateliê' : 'Expansión del taller',
      description: language === 'pt'
        ? 'Mudança para um espaço maior e contratação de novos artesãos especialistas.'
        : 'Cambio a un espacio más grande y contratación de nuevos artesanos especialistas.'
    },
    {
      year: '2015',
      title: language === 'pt' ? 'Reconhecimento internacional' : 'Reconocimiento internacional',
      description: language === 'pt'
        ? 'Primeira exposição internacional e início de parcerias com designers renomados.'
        : 'Primera exposición internacional e inicio de colaboraciones con diseñadores de renombre.'
    },
    {
      year: '2019',
      title: language === 'pt' ? 'Certificação sustentável' : 'Certificación sostenible',
      description: language === 'pt'
        ? 'Obtenção de certificações de sustentabilidade e práticas eco-friendly.'
        : 'Obtención de certificaciones de sostenibilidad y prácticas eco-amigables.'
    },
    {
      year: '2022',
      title: language === 'pt' ? 'Nova era digital' : 'Nueva era digital',
      description: language === 'pt'
        ? 'Lançamento da plataforma online e expansão para novos mercados.'
        : 'Lanzamiento de la plataforma online y expansión a nuevos mercados.'
    }
  ];

  // Values with enhanced data
  const values = [
    {
      id: 1,
      title: t.about.quality,
      icon: <Medal size={28} />,
      description: language === 'pt'
        ? 'Utilizamos apenas os melhores materiais e técnicas refinadas para criar móveis que duram gerações.'
        : 'Utilizamos solo los mejores materiales y técnicas refinadas para crear muebles que duran generaciones.'
    },
    {
      id: 2,
      title: t.about.design,
      icon: <Paintbrush size={28} />,
      description: language === 'pt'
        ? 'Cada peça é desenhada com atenção meticulosa aos detalhes e tendências contemporâneas.'
        : 'Cada pieza es diseñada con atención meticulosa a los detalles y tendencias contemporáneas.'
    },
    {
      id: 3,
      title: t.about.sustainability,
      icon: <Leaf size={28} />,
      description: language === 'pt'
        ? 'Comprometidos com práticas sustentáveis e uso responsável de recursos naturais.'
        : 'Comprometidos con prácticas sostenibles y uso responsable de recursos naturales.'
    },
    {
      id: 4,
      title: t.about.craftsmanship,
      icon: <Tool size={28} />,
      description: language === 'pt'
        ? 'Nossos artesãos combinam técnicas tradicionais com tecnologia moderna para criar peças únicas.'
        : 'Nuestros artesanos combinan técnicas tradicionales con tecnología moderna para crear piezas únicas.'
    }
  ];

  // Enhanced team data
  const team = [
    {
      id: 1,
      name: 'Carlos Mendes',
      role: language === 'pt' ? 'Fundador & Designer Principal' : 'Fundador & Diseñador Principal',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      bio: language === 'pt'
        ? 'Com mais de 20 anos de experiência em design de móveis, Carlos combina criatividade com funcionalidade em cada projeto.'
        : 'Con más de 20 años de experiencia en diseño de muebles, Carlos combina creatividad con funcionalidad en cada proyecto.',
      social: {
        linkedin: 'https://linkedin.com',
        instagram: 'https://instagram.com'
      }
    },
    {
      id: 2,
      name: 'Ana Soares',
      role: language === 'pt' ? 'Diretora Criativa' : 'Directora Creativa',
      image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      bio: language === 'pt'
        ? 'Premiada internacionalmente, Ana traz uma visão contemporânea e inovadora para cada criação da Afetto.'
        : 'Premiada internacionalmente, Ana trae una visión contemporánea e innovadora a cada creación de Afetto.',
      social: {
        linkedin: 'https://linkedin.com',
        instagram: 'https://instagram.com'
      }
    },
    {
      id: 3,
      name: 'Roberto Ferreira',
      role: language === 'pt' ? 'Mestre Marceneiro' : 'Maestro Carpintero',
      image: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      bio: language === 'pt'
        ? 'Com técnicas transmitidas por gerações, Roberto é responsável pela execução impecável e acabamentos de excelência.'
        : 'Con técnicas transmitidas por generaciones, Roberto es responsable por la ejecución impecable y acabados de excelencia.',
      social: {
        linkedin: 'https://linkedin.com',
        instagram: 'https://instagram.com'
      }
    }
  ];

  // Workshop gallery with enhanced data
  const workshopGallery = [
    {
      id: 1,
      image: "https://images.pexels.com/photos/6195085/pexels-photo-6195085.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      alt: "Workshop woodworking area",
      size: "large"
    },
    {
      id: 2,
      image: "https://images.pexels.com/photos/6231830/pexels-photo-6231830.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      alt: "Design studio",
      size: "small"
    },
    {
      id: 3,
      image: "https://images.pexels.com/photos/6195035/pexels-photo-6195035.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      alt: "Material selection",
      size: "small"
    },
    {
      id: 4,
      image: "https://images.pexels.com/photos/6195066/pexels-photo-6195066.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      alt: "Finishing techniques",
      size: "medium"
    },
    {
      id: 5,
      image: "https://images.pexels.com/photos/6195087/pexels-photo-6195087.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      alt: "Furniture prototyping",
      size: "medium"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="bg-gradient-to-b from-[#181617] via-[#23201C] to-[#1a1713]"
    >
      {/* Immersive Hero Section with Parallax */}
      <motion.div
        ref={heroRef}
        className="relative h-[90vh] flex items-center justify-center overflow-hidden"
      >
        {/* Parallax background */}
        <motion.div
          className="absolute inset-0 z-0"
          style={{
            scale: heroScale,
            opacity: heroOpacity
          }}
        >
          <div className="absolute inset-0 bg-black/60 z-10"></div>
          <img
            src="/images/about/hero-about.jpg"
            alt="About Us"
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Decorative elements */}
        <motion.div
          className="absolute top-20 right-[10%] w-96 h-96 rounded-full border border-accent/5 opacity-20 hidden lg:block"
          initial={{ scale: 0.8, rotate: 45, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 0.2 }}
          transition={{ duration: 3, ease: [0.32, 0.75, 0.36, 1] }}
        />

        <motion.div
          className="absolute bottom-40 left-[5%] w-64 h-64 rounded-full border border-accent/10 opacity-10 hidden lg:block"
          initial={{ scale: 0.8, rotate: -45, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 0.1 }}
          transition={{ duration: 3, delay: 0.5, ease: [0.32, 0.75, 0.36, 1] }}
        />

        {/* Content */}
        <div className="container mx-auto px-6 md:px-20 relative z-10 text-white">
          <motion.div
            className="max-w-3xl text-center mx-auto"
            style={{ y: heroTextY }}
          >
            <motion.div
              className="overflow-hidden mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.div
                className="text-accent font-light uppercase tracking-[0.35em] text-sm mb-4"
                initial={{ y: 80 }}
                animate={{ y: 0 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              >
                {language === 'pt' ? 'Nossa História' : 'Nuestra Historia'}
              </motion.div>
            </motion.div>

            <motion.div className="overflow-hidden mb-8">
              <motion.h1
                className="text-5xl md:text-7xl font-serif font-light leading-tight"
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{ duration: 1.4, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                {language === 'pt' ? 'Artesanato & Paixão' : 'Artesanía & Pasión'}
              </motion.h1>
            </motion.div>

            <motion.div className="overflow-hidden mb-12">
              <motion.p
                className="text-xl font-light text-white/90 max-w-2xl mx-auto"
                initial={{ y: 80 }}
                animate={{ y: 0 }}
                transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                {language === 'pt'
                  ? 'Conheça a história por trás de cada peça e o processo meticuloso que torna nossos móveis verdadeiras obras de arte.'
                  : 'Conozca la historia detrás de cada pieza y el proceso meticuloso que hace de nuestros muebles verdaderas obras de arte.'}
              </motion.p>
            </motion.div>

            <motion.div
              className="h-[2px] w-24 bg-accent mx-auto"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.5, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: 'center' }}
            />
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="w-[1px] h-12 bg-white/20 mb-4"
            animate={{
              scaleY: [0.3, 1, 0.3],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: 'top' }}
          />
          <span className="text-white/50 uppercase text-xs tracking-widest">
            {language === 'pt' ? 'Role para descobrir' : 'Desplazarse para descubrir'}
          </span>
        </motion.div>
      </motion.div>

      {/* Elegant Story Section */}
      <section ref={storyRef} className="py-32 md:py-40 relative overflow-hidden">
        {/* Background elements */}
        <motion.div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: 'url(/images/grid-pattern.svg)',
            backgroundSize: '50px',
          }}
        />

        <motion.div
          className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-transparent via-accent/20 to-transparent opacity-30"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.8, delay: 0.3, ease: [0.32, 0.75, 0.36, 1] }}
          style={{ transformOrigin: 'top' }}
        />

        <motion.div
          className="absolute bottom-0 left-0 w-1 h-full bg-gradient-to-t from-transparent via-accent/20 to-transparent opacity-30"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.8, delay: 0.5, ease: [0.32, 0.75, 0.36, 1] }}
          style={{ transformOrigin: 'bottom' }}
        />

        <div className="container mx-auto px-6 md:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <motion.div
              className="lg:col-span-5"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="relative">
                {/* Image frame */}
                <motion.div
                  className="absolute -top-6 -left-6 w-full h-full border border-accent/20 z-0"
                  initial={{ opacity: 0, x: -20, y: -20 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                />

                {/* Main image */}
                <div className="relative z-10 overflow-hidden">
                  <motion.div
                    initial={{ scale: 1.2 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <img
                      src="/images/about/workshop-craftsmanship.jpg"
                      alt="Our craftsmanship"
                      className="w-full h-auto rounded-sm shadow-lg"
                    />
                  </motion.div>
                </div>

                {/* Decorative element */}
                <motion.div
                  className="absolute -bottom-12 -right-12 w-24 h-24 border border-accent/30 rounded-full z-0 hidden md:block"
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <motion.div
                    className="absolute inset-3 rounded-full border border-accent/40"
                    animate={{
                      rotate: [0, 360],
                      transition: { duration: 20, repeat: Infinity, ease: "linear" }
                    }}
                  />
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              className="lg:col-span-7"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="text-white">
                <div className="text-accent uppercase tracking-[0.35em] text-xs font-light mb-6">
                  {language === 'pt' ? 'Sobre Nós' : 'Sobre Nosotros'}
                </div>
                <h2 className="text-4xl md:text-5xl font-serif font-light leading-tight mb-8">
                  {language === 'pt'
                    ? 'Uma jornada de dedicação e excelência'
                    : 'Un viaje de dedicación y excelencia'}
                </h2>

                <motion.div
                  className="h-[2px] w-32 bg-accent mb-10"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  style={{ transformOrigin: 'left' }}
                />

                <div className="text-white/80 space-y-6">
                  <p className="text-lg leading-relaxed">
                    {t.about.story}
                  </p>
                  <p className="leading-relaxed">
                    {language === 'pt'
                      ? 'Com uma equipe de designers talentosos e artesãos experientes, criamos móveis que não apenas são bonitos, mas também funcionais e duradouros. Cada peça conta uma história e reflete nossa paixão pelo design e pela qualidade.'
                      : 'Con un equipo de diseñadores talentosos y artesanos experimentados, creamos muebles que no solo son hermosos, sino también funcionales y duraderos. Cada pieza cuenta una historia y refleja nuestra pasión por el diseño y la calidad.'}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                    {[
                      { number: '15+', label: language === 'pt' ? 'Anos de experiência' : 'Años de experiencia' },
                      { number: '500+', label: language === 'pt' ? 'Projetos entregues' : 'Proyectos entregados' },
                      { number: '12', label: language === 'pt' ? 'Prêmios de design' : 'Premios de diseño' },
                      { number: '98%', label: language === 'pt' ? 'Clientes satisfeitos' : 'Clientes satisfechos' }
                    ].map((stat, index) => (
                      <motion.div
                        key={index}
                        className="flex flex-col"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 + (index * 0.1), ease: [0.22, 1, 0.36, 1] }}
                      >
                        <span className="text-3xl font-serif text-accent mb-2">{stat.number}</span>
                        <span className="text-white/70 text-sm">{stat.label}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Interactive Timeline */}
      <section
        ref={timelineRef}
        className="py-32 md:py-40 bg-[#181617] relative overflow-hidden"
      >
        {/* Background elements */}
        <div className="absolute inset-0 bg-[url('/images/subtle-pattern.png')] opacity-5"></div>

        <div className="container mx-auto px-6 md:px-20">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="text-accent uppercase tracking-[0.35em] text-xs font-light mb-6">
              {language === 'pt' ? 'Nossa Trajetória' : 'Nuestra Trayectoria'}
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-light text-white leading-tight mb-8">
              {language === 'pt'
                ? 'Uma História de Evolução'
                : 'Una Historia de Evolución'}
            </h2>

            <motion.div
              className="h-[2px] w-32 bg-accent mx-auto mb-12"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: 'center' }}
            />
          </motion.div>

          {/* Elegant timeline */}
          <div className="relative">
            {/* Central line */}
            <motion.div
              className="absolute left-[20px] md:left-1/2 md:transform md:-translate-x-px top-0 w-[1px] h-full bg-white/10"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: 'top' }}
            />

            {/* Timeline items */}
            <div className="relative z-10">
              {timeline.map((item, index) => {
                const isEven = index % 2 === 0;
                return (
                  <div
                    key={item.year}
                    className={`relative flex mb-16 md:mb-24 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center md:items-start`}
                  >
                    {/* Year marker */}
                    <motion.div
                      className="absolute md:relative top-0 left-0 md:left-auto flex flex-col items-center"
                      style={{
                        zIndex: 20,
                        left: '20px',
                        [isEven ? 'md:mr' : 'md:ml']: '-2.5rem',
                      }}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-black text-sm font-medium mb-2">
                        {item.year.slice(2)}
                      </div>
                      <div className="font-mono text-accent font-light hidden md:block">
                        {item.year}
                      </div>
                    </motion.div>

                    {/* Content */}
                    <motion.div
                      className={`ml-16 md:ml-0 bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-lg w-full md:w-[calc(50%-40px)] p-8 shadow-xl ${isEven ? 'md:mr-auto' : 'md:ml-auto'}`}
                      initial={{ opacity: 0, y: 30, x: isEven ? 20 : -20 }}
                      whileInView={{ opacity: 1, y: 0, x: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className="font-mono text-accent text-sm mb-2 block md:hidden">{item.year}</div>
                      <h3 className="text-xl md:text-2xl font-serif text-white mb-4">{item.title}</h3>
                      <p className="text-white/70">{item.description}</p>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Core Values with Interactive Cards */}
      <section
        ref={valuesRef}
        className="py-32 md:py-40 bg-[#1D1A18] relative overflow-hidden"
      >
        {/* Background elements */}
        <motion.div
          className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-accent/5 blur-[120px] z-0"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.05, 0.12, 0.05]
          }}
          transition={{ duration: 15, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-20 -left-20 w-[500px] h-[500px] rounded-full bg-accent/5 blur-[100px] z-0"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.08, 0.15, 0.08]
          }}
          transition={{ duration: 12, repeat: Infinity }}
        />

        <div className="container mx-auto px-6 md:px-20 relative z-10">
          <motion.div
            className="max-w-3xl mx-auto text-center mb-24"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="text-accent uppercase tracking-[0.35em] text-xs font-light mb-6">
              {language === 'pt' ? 'Nossos Valores' : 'Nuestros Valores'}
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-light text-white leading-tight mb-8">
              {language === 'pt'
                ? 'O que nos define'
                : 'Lo que nos define'}
            </h2>

            <motion.div
              className="h-[2px] w-32 bg-accent mx-auto mb-10"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: 'center' }}
            />

            <p className="text-white/80 text-lg">
              {language === 'pt'
                ? 'Princípios que guiam cada decisão e cada detalhe do nosso trabalho.'
                : 'Principios que guían cada decisión y cada detalle de nuestro trabajo.'}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {values.map((value, index) => (
              <motion.div
                key={value.id}
                className="backdrop-blur-sm p-8 rounded-lg border border-white/10 relative overflow-hidden group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 * index, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -8 }}
              >
                {/* Background animation */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  initial={false}
                />

                {/* Icon with circle */}
                <motion.div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-6 relative"
                  whileHover={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="absolute inset-0 rounded-full bg-accent/10"></div>
                  <div className="text-accent">{value.icon}</div>
                </motion.div>

                {/* Title with elegant animation */}
                <div className="overflow-hidden mb-3">
                  <motion.h3
                    className="text-2xl font-serif text-white"
                    initial={{ y: 30 }}
                    whileInView={{ y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 + (0.1 * index) }}
                  >
                    {value.title}
                  </motion.h3>
                </div>

                {/* Description with elegant fade */}
                <motion.p
                  className="text-white/70 leading-relaxed"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.3 + (0.1 * index) }}
                >
                  {value.description}
                </motion.p>

                {/* Decorative accent line */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent/60"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.4 }}
                  style={{ transformOrigin: 'left' }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section with Interactive Cards */}
      <section
        ref={teamRef}
        className="py-32 md:py-40 bg-[#1a1713] relative overflow-hidden"
      >
        {/* Background elements */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="h-full w-full grid grid-cols-6 md:grid-cols-12">
            {Array(12).fill(0).map((_, i) => (
              <div key={`grid-col-${i}`} className="h-full border-l border-white/10 last:border-r"></div>
            ))}
          </div>
        </div>

        <div className="container mx-auto px-6 md:px-20 relative z-10">
          <motion.div
            className="max-w-3xl mx-auto text-center mb-24"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="text-accent uppercase tracking-[0.35em] text-xs font-light mb-6">
              {language === 'pt' ? 'Nosso Time' : 'Nuestro Equipo'}
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-light text-white leading-tight mb-8">
              {language === 'pt'
                ? 'Mentes Criativas'
                : 'Mentes Creativas'}
            </h2>

            <motion.div
              className="h-[2px] w-32 bg-accent mx-auto mb-10"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: 'center' }}
            />

            <p className="text-white/80 text-lg">
              {language === 'pt'
                ? 'Conheça os talentos por trás de cada criação da Afetto.'
                : 'Conozca los talentos detrás de cada creación de Afetto.'}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {team.map((member, index) => (
              <motion.div
                key={member.id}
                className="backdrop-blur-sm rounded-lg overflow-hidden group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 * index, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -10 }}
              >
                {/* Image container with hover effect */}
                <div className="relative h-80 overflow-hidden">
                  <motion.div
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.7 }}
                  >
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>

                  {/* Overlay with gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                    <div>
                      <div className="text-white/80 mb-4">{member.bio}</div>
                      <div className="flex space-x-4 items-center">
                        <a href={member.social.instagram} className="text-white/70 hover:text-accent transition-colors">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                          </svg>
                        </a>
                        <a href={member.social.linkedin} className="text-white/70 hover:text-accent transition-colors">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                            <rect x="2" y="9" width="4" height="12" />
                            <circle cx="4" cy="4" r="2" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Member info */}
                <div className="p-8 bg-white/[0.03] border-t border-white/5">
                  <h3 className="text-xl font-serif text-white mb-2">{member.name}</h3>
                  <p className="text-accent">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Workshop Gallery with Masonry Layout */}
      <section
        ref={atelierRef}
        className="py-32 md:py-40 bg-[#23201C] relative overflow-hidden"
      >
        {/* Background elements */}
        <div className="absolute inset-0 bg-[url('/images/texture-pattern.png')] bg-repeat opacity-5"></div>

        <div className="container mx-auto px-6 md:px-20 relative z-10">
          <motion.div
            className="max-w-3xl mx-auto text-center mb-24"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="text-accent uppercase tracking-[0.35em] text-xs font-light mb-6">
              {language === 'pt' ? 'Nosso Ateliê' : 'Nuestro Taller'}
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-light text-white leading-tight mb-8">
              {language === 'pt'
                ? 'Onde a Magia Acontece'
                : 'Donde Ocurre la Magia'}
            </h2>

            <motion.div
              className="h-[2px] w-32 bg-accent mx-auto mb-10"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: 'center' }}
            />

            <p className="text-white/80 text-lg">
              {language === 'pt'
                ? 'Conheça o espaço onde transformamos ideias em realidade.'
                : 'Conozca el espacio donde transformamos ideas en realidad.'}
            </p>
          </motion.div>

          {/* Masonry gallery */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <motion.div
              className="md:col-span-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="relative h-[500px] overflow-hidden rounded-lg group cursor-pointer">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.7 }}
                >
                  <img
                    src="https://images.pexels.com/photos/6195085/pexels-photo-6195085.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                    alt="Workshop woodworking area"
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-500">
                  <span className="text-white font-serif text-2xl">
                    {language === 'pt' ? 'Área de Marcenaria' : 'Área de Carpintería'}
                  </span>
                </div>
              </div>
            </motion.div>

            <div className="md:col-span-4 grid grid-cols-1 gap-6">
              <motion.div
                className="h-[240px]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="relative h-full overflow-hidden rounded-lg group cursor-pointer">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.7 }}
                  >
                    <img
                      src="https://images.pexels.com/photos/6231830/pexels-photo-6231830.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                      alt="Design studio"
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-500">
                    <span className="text-white font-serif text-xl">
                      {language === 'pt' ? 'Estúdio de Design' : 'Estudio de Diseño'}
                    </span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="h-[240px]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="relative h-full overflow-hidden rounded-lg group cursor-pointer">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.7 }}
                  >
                    <img
                      src="https://images.pexels.com/photos/6195035/pexels-photo-6195035.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                      alt="Material selection"
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-500">
                    <span className="text-white font-serif text-xl">
                      {language === 'pt' ? 'Seleção de Materiais' : 'Selección de Materiales'}
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div
              className="md:col-span-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="relative h-[350px] overflow-hidden rounded-lg group cursor-pointer">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.7 }}
                >
                  <img
                    src="https://images.pexels.com/photos/6195066/pexels-photo-6195066.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                    alt="Finishing techniques"
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-500">
                  <span className="text-white font-serif text-2xl">
                    {language === 'pt' ? 'Técnicas de Acabamento' : 'Técnicas de Acabado'}
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="md:col-span-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="relative h-[350px] overflow-hidden rounded-lg group cursor-pointer">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.7 }}
                >
                  <img
                    src="https://images.pexels.com/photos/6195087/pexels-photo-6195087.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                    alt="Furniture prototyping"
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-500">
                  <span className="text-white font-serif text-2xl">
                    {language === 'pt' ? 'Prototipagem de Móveis' : 'Prototipado de Muebles'}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Visit call to action */}
          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Link
              to="/contato"
              className="group inline-flex items-center justify-center overflow-hidden relative"
            >
              <motion.div
                className="relative z-10 border-2 border-accent px-10 py-4 text-white font-sans font-light tracking-wider overflow-hidden"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <span className="relative z-10 group-hover:text-black transition-colors duration-500">
                  {language === 'pt' ? 'Agende uma visita' : 'Programe una visita'}
                </span>

                {/* Fill effect */}
                <motion.div
                  className="absolute inset-0 bg-accent z-0"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  style={{ transformOrigin: 'left' }}
                />
              </motion.div>

              <div className="absolute right-6 opacity-0 group-hover:opacity-100 z-20 transition-opacity duration-300">
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <ArrowRight size={16} className="text-black" />
                </motion.div>
              </div>
            </Link>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};
export default About;