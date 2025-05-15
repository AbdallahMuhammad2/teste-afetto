import React, { useContext, useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useInView, useSpring, useMotionTemplate, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, MeshDistortMaterial, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import LanguageContext from '../context/LanguageContext';
import { translations } from '../data/translations';
import { Medal, Paintbrush, Leaf, PenTool as Tool, ArrowRight, MapPin, Calendar, Users, Mail, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLenis } from '@studio-freight/react-lenis';

// 3D floating sphere component for hero section
const FloatingSphere = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.2;
    meshRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.3;
    meshRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.2;
  });

  return (
    <Sphere ref={meshRef} args={[1.5, 64, 64]} position={[0, 0, 0]}>
      <MeshDistortMaterial
        color="#D3A17E"
        attach="material"
        distort={0.4}
        speed={4}
        roughness={0.2}
        metalness={0.8}
      />
    </Sphere>
  );
};

// Advanced particle system component
interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
}

const ParticleField = ({ count = 200 }) => {
  const particles = useRef<Particle[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    particles.current = Array.from({ length: count }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.5 + 0.1
    }));

    setMounted(true);

    return () => setMounted(false);
  }, [count]);

  useEffect(() => {
    if (!mounted) return;

    const canvas = document.getElementById('particle-canvas') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let animationFrame: number;

    const animate = () => {
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.current.forEach(particle => {
          // Update position
          particle.x += particle.speedX;
          particle.y += particle.speedY;

          // Wrap around edges
          if (particle.x < 0) particle.x = canvas.width;
          if (particle.x > canvas.width) particle.x = 0;
          if (particle.y < 0) particle.y = canvas.height;
          if (particle.y > canvas.height) particle.y = 0;

          // Draw particle
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(211, 161, 126, ${particle.opacity})`;
          ctx.fill();
        });
      }

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [mounted]);

  return <canvas id="particle-canvas" className="absolute inset-0 z-10 pointer-events-none" />;
};

const About: React.FC = () => {
  const { language } = useContext(LanguageContext);
  const t = translations[language];
  const lenis = useLenis();

  // Dynamic states
  const [activeSection, setActiveSection] = useState(0);
  const [hoveredTeamMember, setHoveredTeamMember] = useState(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  // Enhanced refs for scroll animations
  const mainRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);
  const teamRef = useRef<HTMLDivElement>(null);
  const atelierRef = useRef<HTMLDivElement>(null);

  // Side dots navigation in view states
  const storyInView = useInView(storyRef, { margin: "-50% 0px -50% 0px" });
  const timelineInView = useInView(timelineRef, { margin: "-50% 0px -50% 0px" });
  const valuesInView = useInView(valuesRef, { margin: "-50% 0px -50% 0px" });
  const teamInView = useInView(teamRef, { margin: "-50% 0px -50% 0px" });
  const atelierInView = useInView(atelierRef, { margin: "-50% 0px -50% 0px" });

  // Update active section based on which section is in view
  useEffect(() => {
    if (storyInView) setActiveSection(1);
    else if (timelineInView) setActiveSection(2);
    else if (valuesInView) setActiveSection(3);
    else if (teamInView) setActiveSection(4);
    else if (atelierInView) setActiveSection(5);
    else setActiveSection(0);
  }, [storyInView, timelineInView, valuesInView, teamInView, atelierInView]);

  // Track cursor position for custom interactions
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({
        x: e.clientX,
        y: e.clientY
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Advanced scroll-based animations
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const { scrollYProgress: mainScrollProgress } = useScroll({
    target: mainRef,
    offset: ["start start", "end end"]
  });

  // Smoothed spring animations for more natural movement
  const smoothHeroProgress = useSpring(heroScrollProgress, { stiffness: 100, damping: 30 });
  const smoothMainProgress = useSpring(mainScrollProgress, { stiffness: 100, damping: 30 });

  // Hero section animations
  const heroScale = useTransform(smoothHeroProgress, [0, 1], [1, 1.15]);
  const heroOpacity = useTransform(smoothHeroProgress, [0, 0.8], [1, 0]);
  const heroTextY = useTransform(smoothHeroProgress, [0, 1], [0, 200]);
  const heroRotate = useTransform(smoothHeroProgress, [0, 1], [0, 5]);
  const heroTitleBlur = useMotionTemplate`${useTransform(smoothHeroProgress, [0, 0.8], [0, 10])}px`;

  // Advanced 3D perspective effects
  const perspective = useTransform(smoothMainProgress, [0, 1], [1200, 800]);
  const perspectiveOrigin = useMotionTemplate`${useTransform(mainScrollProgress, [0, 1], [50, 70])}% ${useTransform(mainScrollProgress, [0, 1], [50, 30])}%`;

  // Parallax depths for layered elements
  const layer1 = useTransform(smoothMainProgress, [0, 1], [0, -50]);
  const layer2 = useTransform(smoothMainProgress, [0, 1], [0, -150]);
  const layer3 = useTransform(smoothMainProgress, [0, 1], [0, -250]);

  // Timeline data with enhanced details
  const timeline = [
    {
      year: '2008',
      month: language === 'pt' ? 'Março' : 'Marzo',
      title: language === 'pt' ? 'Os primeiros passos' : 'Los primeros pasos',
      description: language === 'pt'
        ? 'Fundação da empresa com foco em peças personalizadas para residências de alto padrão. Nosso primeiro ateliê foi um pequeno espaço no bairro histórico.'
        : 'Fundación de la empresa con enfoque en piezas personalizadas para residencias de alto estándar. Nuestro primer taller fue un pequeño espacio en el barrio histórico.',
      highlight: language === 'pt' ? 'Primeiro cliente internacional' : 'Primer cliente internacional'
    },
    {
      year: '2012',
      month: language === 'pt' ? 'Junho' : 'Junio',
      title: language === 'pt' ? 'Expansão do ateliê' : 'Expansión del taller',
      description: language === 'pt'
        ? 'Mudança para um espaço maior e contratação de novos artesãos especialistas. Desenvolvimento de novas técnicas de acabamento exclusivas.'
        : 'Cambio a un espacio más grande y contratación de nuevos artesanos especialistas. Desarrollo de nuevas técnicas de acabado exclusivas.',
      highlight: language === 'pt' ? 'Primeira linha de produtos assinados' : 'Primera línea de productos firmados'
    },
    {
      year: '2015',
      month: language === 'pt' ? 'Outubro' : 'Octubre',
      title: language === 'pt' ? 'Reconhecimento internacional' : 'Reconocimiento internacional',
      description: language === 'pt'
        ? 'Primeira exposição internacional em Milão e início de parcerias com designers renomados de Londres e Nova York.'
        : 'Primera exposición internacional en Milán e inicio de colaboraciones con diseñadores de renombre de Londres y Nueva York.',
      highlight: language === 'pt' ? 'Prêmio de Design Sustentável' : 'Premio de Diseño Sostenible'
    },
    {
      year: '2019',
      month: language === 'pt' ? 'Agosto' : 'Agosto',
      title: language === 'pt' ? 'Certificação sustentável' : 'Certificación sostenible',
      description: language === 'pt'
        ? 'Obtenção de certificações de sustentabilidade e implementação de práticas eco-friendly em toda cadeia produtiva.'
        : 'Obtención de certificaciones de sostenibilidad e implementación de prácticas eco-amigables en toda la cadena productiva.',
      highlight: language === 'pt' ? 'Redução de 80% no desperdício' : '80% de reducción en desperdicios'
    },
    {
      year: '2022',
      month: language === 'pt' ? 'Fevereiro' : 'Febrero',
      title: language === 'pt' ? 'Nova era digital' : 'Nueva era digital',
      description: language === 'pt'
        ? 'Lançamento da plataforma online com visualização 3D e expansão para novos mercados na Europa e Ásia.'
        : 'Lanzamiento de la plataforma online con visualización 3D y expansión a nuevos mercados en Europa y Asia.',
      highlight: language === 'pt' ? 'Inauguração do showroom virtual' : 'Inauguración del showroom virtual'
    }
  ];

  // Enhanced values with more details
  const values = [
    {
      id: 1,
      title: t.about.quality,
      icon: <Medal size={28} />,
      description: language === 'pt'
        ? 'Utilizamos apenas os melhores materiais e técnicas refinadas para criar móveis que duram gerações. Cada peça passa por um rigoroso controle de qualidade.'
        : 'Utilizamos solo los mejores materiales y técnicas refinadas para crear muebles que duran generaciones. Cada pieza pasa por un riguroso control de calidad.',
      color: '#D3A17E'
    },
    {
      id: 2,
      title: t.about.design,
      icon: <Paintbrush size={28} />,
      description: language === 'pt'
        ? 'Cada peça é desenhada com atenção meticulosa aos detalhes e tendências contemporâneas, criando um equilíbrio perfeito entre forma e função.'
        : 'Cada pieza es diseñada con atención meticulosa a los detalles y tendencias contemporáneas, creando un equilibrio perfecto entre forma y función.',
      color: '#C6B59E'
    },
    {
      id: 3,
      title: t.about.sustainability,
      icon: <Leaf size={28} />,
      description: language === 'pt'
        ? 'Comprometidos com práticas sustentáveis e uso responsável de recursos naturais. Nossas madeiras são 100% provenientes de fontes certificadas.'
        : 'Comprometidos con prácticas sostenibles y uso responsable de recursos naturales. Nuestras maderas provienen 100% de fuentes certificadas.',
      color: '#8CAA80'
    },
    {
      id: 4,
      title: t.about.craftsmanship,
      icon: <Tool size={28} />,
      description: language === 'pt'
        ? 'Nossos artesãos combinam técnicas tradicionais com tecnologia moderna para criar peças únicas que honram a tradição enquanto abraçam a inovação.'
        : 'Nuestros artesanos combinan técnicas tradicionales con tecnología moderna para crear piezas únicas que honran la tradición mientras abrazan la innovación.',
      color: '#B57C57'
    }
  ];

  // Enhanced team data with more details
  const team = [
    
  ];

  // Enhanced workshop gallery with added detail
  const workshopGallery = [
    {
      id: 1,
      image: "https://images.pexels.com/photos/6195085/pexels-photo-6195085.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      alt: "Workshop woodworking area",
      title: language === 'pt' ? 'Área de Marcenaria' : 'Área de Carpintería',
      description: language === 'pt' ? 'Onde o artesanato toma forma através de técnicas tradicionais' : 'Donde la artesanía toma forma a través de técnicas tradicionales',
      size: "large"
    },
    {
      id: 2,
      image: "https://images.pexels.com/photos/6231830/pexels-photo-6231830.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      alt: "Design studio",
      title: language === 'pt' ? 'Estúdio de Design' : 'Estudio de Diseño',
      description: language === 'pt' ? 'Onde as ideias ganham vida antes da produção' : 'Donde las ideas cobran vida antes de la producción',
      size: "small"
    },
    {
      id: 3,
      image: "https://images.pexels.com/photos/6195035/pexels-photo-6195035.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      alt: "Material selection",
      title: language === 'pt' ? 'Seleção de Materiais' : 'Selección de Materiales',
      description: language === 'pt' ? 'Curadoria de materiais nobres e sustentáveis' : 'Curaduría de materiales nobles y sostenibles',
      size: "small"
    },
    {
      id: 4,
      image: "https://images.pexels.com/photos/6195066/pexels-photo-6195066.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      alt: "Finishing techniques",
      title: language === 'pt' ? 'Técnicas de Acabamento' : 'Técnicas de Acabado',
      description: language === 'pt' ? 'Detalhes que transformam uma peça em obra de arte' : 'Detalles que transforman una pieza en obra de arte',
      size: "medium"
    },
    {
      id: 5,
      image: "https://images.pexels.com/photos/6195087/pexels-photo-6195087.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      alt: "Furniture prototyping",
      title: language === 'pt' ? 'Prototipagem' : 'Creación de Prototipos',
      description: language === 'pt' ? 'Testando cada detalhe antes da produção final' : 'Probando cada detalle antes de la producción final',
      size: "medium"
    }
  ];

  // Custom scroll to section function
  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    if (!ref.current || !lenis) return;
    lenis.scrollTo(ref.current, {
      offset: -50,
      duration: 1.5,
      easing: (t) => 1 - Math.pow(1 - t, 5)
    });
  };

  return (
    <motion.div
      ref={mainRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="bg-[#0D0C0B] text-white overflow-hidden"
      style={{
        perspective: perspective,
        perspectiveOrigin: perspectiveOrigin
      }}
    >
      {/* Side Dots Navigation */}
      <div className="fixed left-8 top-1/2 transform -translate-y-1/2 z-50 hidden lg:block">
        <div className="flex flex-col space-y-6">
          {[
            { index: 0, label: language === 'pt' ? 'Início' : 'Inicio', ref: heroRef },
            { index: 1, label: language === 'pt' ? 'História' : 'Historia', ref: storyRef },
            { index: 2, label: language === 'pt' ? 'Trajetória' : 'Trayectoria', ref: timelineRef },
            { index: 3, label: language === 'pt' ? 'Valores' : 'Valores', ref: valuesRef },
            { index: 4, label: language === 'pt' ? 'Equipe' : 'Equipo', ref: teamRef },
            { index: 5, label: language === 'pt' ? 'Ateliê' : 'Taller', ref: atelierRef }
          ].map((item) => (
            <motion.button
              key={item.index}
              className="group flex items-center relative"
              onClick={() => scrollToSection(item.ref)}
              whileHover={{ x: 3 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className={`w-3 h-3 rounded-full border ${activeSection === item.index ? 'bg-accent border-accent' : 'bg-transparent border-white/30'} relative z-10`}
                whileHover={{
                  scale: 1.3,
                  backgroundColor: '#D3A17E',
                  borderColor: '#D3A17E'
                }}
                animate={activeSection === item.index ? {
                  scale: [1, 1.2, 1],
                  transition: {
                    repeat: Infinity,
                    repeatType: "reverse",
                    duration: 2
                  }
                } : {}}
              />
              <div className="overflow-hidden">
                <motion.div
                  className="text-sm font-sans tracking-wider whitespace-nowrap pl-4 text-white/60 group-hover:text-white"
                  initial={{ x: -30, opacity: 0 }}
                  whileHover={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {item.label}
                </motion.div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Immersive Hero Section with 3D elements */}
      <motion.section
        ref={heroRef}
        className="relative h-[100vh] flex items-center justify-center overflow-hidden"
      >
        {/* Particle background */}
        <ParticleField count={150} />

        {/* 3D background sphere */}
        <div className="absolute right-10 top-1/4 w-[500px] h-[500px] opacity-60 hidden lg:block">
          <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <FloatingSphere />
            <Environment preset="sunset" />
          </Canvas>
        </div>

        {/* Parallax background */}
        <motion.div
          className="absolute inset-0 z-0"
          style={{
            scale: heroScale,
            opacity: heroOpacity
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-[#0D0C0B] z-10"></div>
          <motion.img
            src="/images/about/hero-about.jpg"
            alt="About Us"
            className="w-full h-full object-cover"
            style={{
              filter: 'brightness(0.6) contrast(1.2) saturate(0.9)',
            }}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Overlay texture */}
          <div
            className="absolute inset-0 opacity-30 mix-blend-soft-light z-20"
            style={{ backgroundImage: 'url(/images/texture-grain.png)', backgroundSize: '500px' }}
          ></div>
        </motion.div>

        {/* Decorative elements */}
        <motion.div
          className="absolute top-20 right-[10%] w-96 h-96 rounded-full border border-accent/5 opacity-20 hidden lg:block"
          initial={{ scale: 0.8, rotate: 45, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: [0.1, 0.2, 0.1] }}
          transition={{
            duration: 6,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: "easeInOut"
          }}
        />

        <motion.div
          className="absolute bottom-40 left-[5%] w-64 h-64 rounded-full border border-accent/10 opacity-10 hidden lg:block"
          initial={{ scale: 0.8, rotate: -45, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: [0.1, 0.3, 0.1] }}
          transition={{
            duration: 8,
            delay: 1,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: "easeInOut"
          }}
        />

        {/* Vertical accent line */}
        <motion.div
          className="absolute top-0 left-1/3 h-full w-[1px] hidden lg:block"
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 0.2 }}
          transition={{ duration: 2, delay: 0.5 }}
          style={{ background: 'linear-gradient(to bottom, transparent, rgba(211,161,126,0.5), transparent)' }}
        />

        {/* Main content */}
        <div className="container mx-auto px-6 lg:px-32 relative z-10">
          <motion.div
            className="max-w-4xl relative"
            style={{ y: heroTextY }}
          >
            <motion.div
              className="absolute -left-20 -top-20 -z-10 opacity-40 blur-[80px] rounded-full w-96 h-96 hidden lg:block"
              initial={{ backgroundColor: 'rgba(211,161,126,0.1)' }}
              animate={{
                backgroundColor: ['rgba(211,161,126,0.1)', 'rgba(211,161,126,0.3)', 'rgba(211,161,126,0.1)'],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />

            <motion.div
              className="overflow-hidden mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.div
                className="text-accent font-light uppercase tracking-[0.5em] text-sm mb-4"
                initial={{ y: 80 }}
                animate={{ y: 0 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              >
                {language === 'pt' ? 'Nossa História' : 'Nuestra Historia'}
              </motion.div>
            </motion.div>

            <motion.div className="overflow-hidden mb-8">
              <motion.h1
                className="text-6xl md:text-8xl font-serif font-light leading-tight tracking-[-0.02em]"
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{ duration: 1.4, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                style={{ textShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
              >
                <span className="block">
                  {language === 'pt' ? 'Artesanato &' : 'Artesanía &'}
                </span>
                <span className="text-accent">
                  {language === 'pt' ? 'Paixão' : 'Pasión'}
                </span>
              </motion.h1>
            </motion.div>

            <motion.div className="overflow-hidden mb-12 max-w-2xl">
              <motion.p
                className="text-xl md:text-2xl font-light text-white/80 leading-relaxed"
                initial={{ y: 80 }}
                animate={{ y: 0 }}
                transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                {language === 'pt'
                  ? 'Conheça a história por trás de cada peça e o processo meticuloso que torna nossos móveis verdadeiras obras de arte atemporal.'
                  : 'Conozca la historia detrás de cada pieza y el proceso meticuloso que hace de nuestros muebles verdaderas obras de arte atemporal.'}
              </motion.p>
            </motion.div>

            <motion.div
              className="flex items-center space-x-8 mt-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.button
                className="group relative overflow-hidden"
                onClick={() => scrollToSection(storyRef)}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
              >
                <span className="relative z-10 flex items-center space-x-3 border-2 border-accent px-8 py-4 text-white font-light tracking-wide">
                  <span>{language === 'pt' ? 'Descobrir' : 'Descubrir'}</span>
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <ChevronDown size={16} className="text-accent" />
                  </motion.span>
                </span>

                <motion.div
                  className="absolute inset-0 bg-accent/20 z-0"
                  initial={{ y: '100%' }}
                  whileHover={{ y: '0%' }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                />
              </motion.button>

              <motion.div
                className="h-[1px] flex-1 bg-white/20"
                initial={{ scaleX: 0, transformOrigin: 'left' }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.5, delay: 1.5, ease: [0.22, 1, 0.36, 1] }}
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Floating accent elements */}
        <motion.div
          className="absolute right-[15%] bottom-[20%] w-24 h-24 border border-accent/30 rounded-full opacity-40 hidden lg:block"
          animate={{
            y: [0, -15, 0],
            rotate: [0, 45, 0],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Bottom scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="w-[1px] h-16 mb-4 overflow-hidden"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
          >
            <motion.div
              className="w-full h-1/2 bg-accent"
              animate={{ y: ['-100%', '200%'] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>
          <motion.span
            className="text-white/50 uppercase text-xs tracking-[0.3em]"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {language === 'pt' ? 'Role para descobrir' : 'Desplázate para descubrir'}
          </motion.span>
        </motion.div>
      </motion.section>

      {/* Premium Story Section */}
      <section
        ref={storyRef}
        className="py-32 lg:py-48 relative z-10 bg-[#0F0E0D] overflow-hidden"
      >
        {/* Advanced background elements */}
        <motion.div
          className="absolute top-0 right-0 w-full h-full opacity-30 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 70% 30%, rgba(211,161,126,0.15), transparent 70%)',
            filter: 'blur(120px)',
          }}
        />

        <motion.div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: 'url(/images/grid-pattern.svg)',
            backgroundSize: '30px',
          }}
        />

        <div className="container mx-auto px-6 lg:px-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
            <motion.div
              className="lg:col-span-6 xl:col-span-5"
              style={{ y: layer1 }}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="relative perspective-1000">
                {/* Advanced image frame */}
                <motion.div
                  className="absolute -top-8 -left-8 w-full h-full border border-accent/20 z-0"
                  initial={{ opacity: 0, x: -20, y: -20, rotateY: -15 }}
                  whileInView={{ opacity: 1, x: 0, y: 0, rotateY: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                />

                {/* Accent frame corner */}
                <motion.div
                  className="absolute -top-8 -left-8 w-16 h-16 border-t-2 border-l-2 border-accent z-10"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                />

                <motion.div
                  className="absolute -bottom-8 -right-8 w-16 h-16 border-b-2 border-r-2 border-accent z-10"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                />

                {/* Main image with parallax effect */}
                <motion.div
                  className="relative z-0 overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                >
                  <motion.img
                    src="/images/about/workshop-craftsmanship.jpg"
                    alt="Our craftsmanship"
                    className="w-full h-auto rounded-sm shadow-2xl"
                    initial={{ scale: 1.2 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      filter: 'brightness(0.9) contrast(1.1)',
                    }}
                  />

                  {/* Elegant overlay */}
                  <motion.div
                    className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-black/60 to-transparent"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                  >
                    <div className="absolute bottom-8 left-8 text-white">
                      <div className="text-accent text-sm tracking-widest uppercase mb-2">
                        {language === 'pt' ? 'Nosso Ateliê' : 'Nuestro Taller'}
                      </div>
                      <div className="text-xl font-serif">
                        {language === 'pt' ? 'Onde a magia acontece' : 'Donde ocurre la magia'}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Interactive floating elements */}
                <motion.div
                  className="absolute -bottom-16 -right-16 w-32 h-32 border border-accent/30 rounded-full z-0 hidden lg:block"
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <motion.div
                    className="absolute inset-4 rounded-full border border-accent/40"
                    animate={{
                      rotate: [0, 360],
                      transition: { duration: 20, repeat: Infinity, ease: "linear" }
                    }}
                  />
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              className="lg:col-span-6 xl:col-span-7"
              style={{ y: layer1 }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <div>
                <motion.div
                  className="text-accent uppercase tracking-[0.5em] text-xs font-light mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  {language === 'pt' ? 'Sobre Nós' : 'Sobre Nosotros'}
                </motion.div>

                <motion.h2
                  className="text-4xl lg:text-6xl font-serif font-light leading-tight mb-10"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  <span className="text-white block mb-2">
                    {language === 'pt' ? 'Uma jornada de' : 'Un viaje de'}
                  </span>
                  <motion.span
                    className="text-accent block"
                    animate={{
                      textShadow: [
                        '0 0 8px rgba(211,161,126,0.1)',
                        '0 0 16px rgba(211,161,126,0.3)',
                        '0 0 8px rgba(211,161,126,0.1)'
                      ]
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    {language === 'pt' ? 'dedicação e excelência' : 'dedicación y excelencia'}
                  </motion.span>
                </motion.h2>

                <motion.div
                  className="h-[2px] w-40 bg-accent mb-12"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  style={{ transformOrigin: 'left' }}
                />

                <div className="text-white/80 space-y-8">
                  <motion.p
                    className="text-xl leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                  >
                    {t.about.story}
                  </motion.p>

                  <motion.p
                    className="leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                  >
                    {language === 'pt'
                      ? 'Com uma equipe de designers talentosos e artesãos experientes, criamos móveis que não apenas são bonitos, mas também funcionais e duradouros. Cada peça conta uma história e reflete nossa paixão pelo design e pela qualidade.'
                      : 'Con un equipo de diseñadores talentosos y artesanos experimentados, creamos muebles que no solo son hermosos, sino también funcionales y duraderos. Cada pieza cuenta una historia y refleja nuestra pasión por el diseño y la calidad.'}
                  </motion.p>

                  {/* Elegant stats section */}
                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-16 px-6 py-10 border-t border-b border-white/10"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                  >
                    {[
                      { number: '15+', label: language === 'pt' ? 'Anos de experiência' : 'Años de experiencia' },
                      { number: '500+', label: language === 'pt' ? 'Projetos entregues' : 'Proyectos entregados' },
                      { number: '12', label: language === 'pt' ? 'Prêmios de design' : 'Premios de diseño' },
                      { number: '98%', label: language === 'pt' ? 'Clientes satisfeitos' : 'Clientes satisfechos' }
                    ].map((stat, index) => (
                      <motion.div
                        key={index}
                        className="flex flex-col items-center text-center"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.9 + (index * 0.1) }}
                        whileHover={{ y: -5 }}
                      >
                        <motion.span
                          className="text-5xl font-serif text-accent mb-2"
                          animate={{
                            textShadow: ['0 0 0px rgba(211,161,126,0)', '0 0 15px rgba(211,161,126,0.5)', '0 0 0px rgba(211,161,126,0)']
                          }}
                          transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
                        >
                          {stat.number}
                        </motion.span>
                        <span className="text-white/60 text-sm tracking-wider uppercase">{stat.label}</span>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Sophisticated Timeline */}
      <section
        ref={timelineRef}
        className="py-32 lg:py-48 bg-[#0D0C0B] relative overflow-hidden"
      >
        {/* Premium background element */}
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(/images/subtle-pattern.png)',
            backgroundSize: '300px',
            opacity: 0.03
          }}
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%']
          }}
          transition={{
            duration: 50,
            ease: "linear",
            repeat: Infinity,
            repeatType: "mirror"
          }}
        />

        {/* Background ambient light */}
        <motion.div
          className="absolute top-1/3 right-1/4 w-[600px] h-[600px] rounded-full opacity-20 hidden lg:block"
          style={{
            background: 'radial-gradient(circle, rgba(211,161,126,0.15), transparent 70%)',
            filter: 'blur(120px)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut"
          }}
        />

        <div className="container mx-auto px-6 lg:px-32 relative z-10">
          <motion.div
            className="max-w-3xl mx-auto text-center mb-24"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="text-accent uppercase tracking-[0.5em] text-xs font-light mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {language === 'pt' ? 'Nossa Trajetória' : 'Nuestra Trayectoria'}
            </motion.div>

            <motion.h2
              className="text-4xl lg:text-6xl font-serif font-light text-white leading-tight mb-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {language === 'pt'
                ? 'Uma História de Evolução'
                : 'Una Historia de Evolución'}
            </motion.h2>

            <motion.div
              className="h-[2px] w-32 bg-accent mx-auto mb-12"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: 'center' }}
            />

            <motion.p
              className="text-white/70 text-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {language === 'pt'
                ? 'Acompanhe os momentos que moldaram nossa identidade e valores ao longo dos anos.'
                : 'Siga los momentos que moldearon nuestra identidad y valores a lo largo de los años.'}
            </motion.p>
          </motion.div>

          {/* Premium interactive timeline */}
          <div className="relative">
            {/* Central line with animated glow */}
            <motion.div
              className="absolute left-[24px] md:left-1/2 md:transform md:-translate-x-px top-0 w-[2px] h-full"
              style={{
                background: 'linear-gradient(180deg, rgba(211,161,126,0) 0%, rgba(211,161,126,0.5) 50%, rgba(211,161,126,0) 100%)',
              }}
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Animated glow effect */}
              <motion.div
                className="absolute inset-0"
                animate={{
                  boxShadow: [
                    '0 0 0px 0px rgba(211,161,126,0.3)',
                    '0 0 5px 2px rgba(211,161,126,0.6)',
                    '0 0 0px 0px rgba(211,161,126,0.3)'
                  ]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "mirror"
                }}
              />
            </motion.div>

            {/* Timeline items with advanced animations */}
            <div className="relative z-10">
              {timeline.map((item, index) => {
                const isEven = index % 2 === 0;
                return (
                  <motion.div
                    key={item.year}
                    className={`relative flex mb-24 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-start`}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                  >
                    {/* Year marker with premium effects */}
                    <motion.div
                      className="absolute md:relative top-0 left-0 md:left-auto flex flex-col items-center"
                      style={{
                        zIndex: 20,
                        left: '24px',
                        [isEven ? 'md:mr' : 'md:ml']: '-12px',
                      }}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                      whileHover={{
                        scale: 1.05,
                        filter: 'drop-shadow(0 0 8px rgba(211,161,126,0.5))'
                      }}
                    >
                      <motion.div
                        className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-black text-sm font-medium relative z-10"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                      >
                        {item.year}
                      </motion.div>

                      <motion.div
                        className="font-mono text-accent font-light mt-2 hidden md:block"
                        whileHover={{ scale: 1.1 }}
                      >
                        {item.month}
                      </motion.div>
                    </motion.div>

                    {/* Content card with premium hover effects */}
                    <motion.div
                      className={`ml-20 md:ml-0 backdrop-blur-sm bg-white/[0.02] border border-white/10 rounded-lg w-full md:w-[calc(50%-48px)] p-10 shadow-xl group hover:border-accent/30 transition-colors duration-500 cursor-default ${isEven ? 'md:mr-auto' : 'md:ml-auto'}`}
                      initial={{ opacity: 0, y: 30, x: isEven ? 20 : -20 }}
                      whileInView={{ opacity: 1, y: 0, x: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      whileHover={{
                        y: -5,
                        boxShadow: '0 20px 40px -20px rgba(0,0,0,0.3), 0 0 20px -5px rgba(211,161,126,0.2)'
                      }}
                    >
                      <div className="font-mono text-accent text-sm mb-2 block md:hidden">{item.month} {item.year}</div>

                      <h3 className="text-2xl md:text-3xl font-serif text-white mb-6">{item.title}</h3>

                      <p className="text-white/70 mb-8 leading-relaxed">{item.description}</p>

                      {/* Highlight box */}
                      <div className="bg-accent/10 border border-accent/30 rounded px-4 py-3 flex items-center text-white/90">
                        <div className="w-2 h-2 rounded-full bg-accent mr-3"></div>
                        <span className="text-sm">{item.highlight}</span>
                      </div>

                      {/* Border accent animation */}
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent/70"
                        initial={{ scaleX: 0 }}
                        whileHover={{ scaleX: 1 }}
                        transition={{ duration: 0.4 }}
                        style={{ transformOrigin: 'left' }}
                      />
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Premium Core Values with Interactive Cards */}
      <section
        ref={valuesRef}
        className="py-32 lg:py-48 bg-[#100F0E] relative overflow-hidden"
      >
        {/* Advanced background elements */}
        <motion.div
          className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-20 hidden lg:block"
          style={{
            background: 'radial-gradient(circle, rgba(211,161,126,0.15), transparent 70%)',
            filter: 'blur(120px)',
          }}
          animate={{
            x: [50, -50, 50],
            y: [-50, 50, -50],
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut"
          }}
        />

        <motion.div
          className="absolute -bottom-60 -left-60 w-[800px] h-[800px] rounded-full opacity-10 hidden lg:block"
          style={{
            background: 'radial-gradient(circle, rgba(211,161,126,0.1), transparent 70%)',
            filter: 'blur(100px)',
          }}
        />
      </section>

      <div className="container mx-auto px-6 lg:px-32 relative z-10">
        <motion.div
          className="max-w-3xl mx-auto text-center mb-24"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="text-accent uppercase tracking-[0.5em] text-xs font-light mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {language === 'pt' ? 'Nossos Princípios' : 'Nuestros Principios'}
          </motion.div>

          <motion.h2
            className="text-4xl lg:text-6xl font-serif font-light leading-tight mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="block text-white">
              {language === 'pt' ? 'Valores que' : 'Valores que'}
            </span>
            <motion.span
              className="text-accent relative inline-block"
              animate={{
                textShadow: [
                  '0 0 0px rgba(211,161,126,0)',
                  '0 0 15px rgba(211,161,126,0.5)',
                  '0 0 0px rgba(211,161,126,0)'
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "mirror"
              }}
            >
              {language === 'pt' ? 'nos definem' : 'nos definen'}
            </motion.span>
          </motion.h2>

          <motion.div
            className="h-[2px] w-40 bg-gradient-to-r from-transparent via-accent to-transparent mx-auto mb-12"
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.4 }}
          />

          <motion.p
            className="text-lg text-white/70 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            {language === 'pt'
              ? 'Princípios que guiam cada decisão, cada peça e cada interação com nossos clientes e parceiros.'
              : 'Principios que guían cada decisión, cada pieza y cada interacción con nuestros clientes y socios.'}
          </motion.p>
        </motion.div>

        {/* Premium interactive cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {values.map((value, index) => (
            <motion.div
              key={value.id}
              className="relative group perspective-800"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.8,
                delay: 0.3 + (index * 0.1),
                ease: [0.22, 1, 0.36, 1]
              }}
            >
              <motion.div
                className="relative z-10 h-full backdrop-blur-sm bg-white/[0.03] border border-white/10 rounded-lg p-8 md:p-10 overflow-hidden group-hover:border-accent/30 transition-all duration-500 flex flex-col"
                whileHover={{
                  y: -10,
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
                  borderColor: 'rgba(211,161,126,0.3)'
                }}
                transition={{ duration: 0.4 }}
              >
                {/* Dynamic background effect */}
                <motion.div
                  className="absolute -inset-[100%] bg-gradient-to-r from-transparent via-accent/5 to-transparent skew-y-12 z-0 opacity-0 group-hover:opacity-100"
                  animate={{
                    x: ['100%', '-100%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                    repeatDelay: 0.5
                  }}
                />

                {/* Top accent line with animation */}
                <motion.div
                  className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent/70 to-transparent opacity-0 group-hover:opacity-100"
                  initial={{ scaleX: 0, transformOrigin: 'left' }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                />

                {/* Floating icon */}
                <motion.div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-8 relative"
                  whileHover={{
                    rotate: [0, -5, 5, -5, 0],
                    transition: { duration: 0.5 }
                  }}
                >
                  {/* Animated background circle */}
                  <motion.div
                    className="absolute inset-0 rounded-full opacity-20"
                    style={{ backgroundColor: value.color }}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.2, 0.3, 0.2]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatType: "mirror",
                      ease: "easeInOut",
                      delay: index * 0.2
                    }}
                  />

                  <div className="text-accent z-10">
                    {React.cloneElement(value.icon, {
                      size: 32,
                      className: "group-hover:animate-pulse"
                    })}
                  </div>
                </motion.div>

                <motion.h3
                  className="text-2xl font-serif text-white mb-4 relative"
                  animate={[
                    '0 0 0px rgba(255,255,255,0)',
                    '0 0 8px rgba(255,255,255,0.3)',
                    '0 0 0px rgba(255,255,255,0)'
                  ]}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: index * 0.3
                  }}
                >
                  {value.title}

                  {/* Underline accent */}
                  <motion.div
                    className="absolute -bottom-2 left-0 h-[1px] bg-accent/50 w-12"
                    initial={{ scaleX: 0, transformOrigin: 'left' }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.6 + (index * 0.1) }}
                  />
                </motion.h3>

                <p className="text-white/70 leading-relaxed flex-grow">
                  {value.description}
                </p>

                {/* Interactive decorative element */}
                <motion.div
                  className="absolute bottom-4 right-4 w-12 h-12 rounded-full border border-accent/20 opacity-40"
                  animate={{
                    rotate: [0, 360],
                    transition: { duration: 20, repeat: Infinity, ease: "linear" }
                  }}
                  whileHover={{ scale: 1.5, opacity: 0.6 }}
                >
                  <motion.div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-accent"
                    animate={{
                      boxShadow: [
                        '0 0 0px rgba(211,161,126,0)',
                        '0 0 10px rgba(211,161,126,0.8)',
                        '0 0 0px rgba(211,161,126,0)'
                      ]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "mirror"
                    }}
                  />
                </motion.div>

                {/* Learn more interactive element */}
                <motion.div
                  className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-white/50 group-hover:text-accent/80 transition-colors duration-300"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.8 + (index * 0.1) }}
                >
                  <span className="uppercase tracking-wider">
                    {language === 'pt' ? 'Saiba mais' : 'Saber más'}
                  </span>

                  <motion.div
                    className="w-6 h-6 flex items-center justify-center rounded-full border border-white/20 group-hover:border-accent/50 transition-colors duration-300"
                    whileHover={{ scale: 1.2, rotate: 90 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ArrowRight size={12} />
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* 3D perspective shadow effect */}
              <motion.div
                className="absolute inset-0 bg-accent/5 rounded-lg -z-10 translate-y-4 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: 'rotateX(10deg)'
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* Values inspiration quote */}
        <motion.div
          className="mt-24 lg:mt-32 max-w-4xl mx-auto text-center relative"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          {/* Decorative quote marks */}
          <motion.div
            className="absolute -top-12 left-0 text-8xl font-serif text-accent/20"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            &ldquo;
          </motion.div>

          <motion.div
            className="absolute -bottom-20 right-0 text-8xl font-serif text-accent/20"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            &rdquo;
          </motion.div>

          <motion.p
            className="text-xl md:text-2xl lg:text-3xl font-serif text-white/90 italic leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            {language === 'pt'
              ? 'Não criamos apenas móveis, criamos peças que transformam espaços e contam histórias através do tempo.'
              : 'No solo creamos muebles, creamos piezas que transforman espacios y cuentan historias a través del tiempo.'}
          </motion.p>

          <motion.div
            className="mt-6 text-accent uppercase tracking-widest text-sm"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            <span className="block mt-2">— Carlos Mendes</span>
            <span className="text-xs text-white/50">
              {language === 'pt' ? 'Fundador & Designer Principal' : 'Fundador & Diseñador Principal'}
            </span>
          </motion.div>
        </motion.div>

        {/* Call to action */}
        <motion.div
          className="flex justify-center mt-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <motion.a
            href="#team"
            className="group relative inline-block px-8 py-4 overflow-hidden border border-accent text-white font-light tracking-wide"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection(teamRef);
            }}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3 }}
          >
            <span className="relative z-10 flex items-center space-x-3">
              <span>{language === 'pt' ? 'Conheça Nossa Equipe' : 'Conozca Nuestro Equipo'}</span>
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <ArrowRight size={16} className="text-accent" />
              </motion.span>
            </span>

            <motion.div
              className="absolute inset-0 bg-accent/20 z-0"
              initial={{ x: '-100%' }}
              whileHover={{ x: '0%' }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            />
          </motion.a>
        </motion.div>
      </div>
    </motion.div>
  );
}
export default About;