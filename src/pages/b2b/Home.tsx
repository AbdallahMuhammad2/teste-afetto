import React, { useContext, useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CountUp from 'react-countup';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, ChevronRight, Download, FileText, PlusSquare, 
  Shield, Grid, Users, Clock, Briefcase, ChevronDown, Search,
  ArrowUpRight, Workflow, Award, PlayCircle, DownloadCloud, X, Mail, MapPin
} from 'lucide-react';
import LanguageContext from '../../context/LanguageContext';

type B2BHomeProps = {
  resetUserType: () => void;
};

const B2BHome: React.FC<B2BHomeProps> = ({ resetUserType }) => {
  const { language } = useContext(LanguageContext);
  const navigate = useNavigate();
  
  // Refs for scroll animations
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const catalogRef = useRef<HTMLDivElement>(null);
  const processRef = useRef<HTMLDivElement>(null);
  const showcaseRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  
  // State hooks for interactive elements
  const [activeTab, setActiveTab] = useState<string>('furniture');
  const [showVideoModal, setShowVideoModal] = useState<boolean>(false);
  const [navBackground, setNavBackground] = useState<boolean>(false);
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  // Animation scroll hooks
  const { scrollYProgress } = useScroll();
  const { scrollYProgress: heroScrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  // Transform animations based on scroll
  const heroScale = useTransform(heroScrollYProgress, [0, 1], [1, 1.1]);
  const heroOpacity = useTransform(heroScrollYProgress, [0, 1], [1, 0.3]);
  const heroTextY = useTransform(heroScrollYProgress, [0, 1], [0, 100]);
  
  // Handle scroll for navbar background change
  useEffect(() => {
    const handleScroll = () => {
      setNavBackground(window.scrollY > 20);
      setScrollProgress(window.scrollY / (document.body.scrollHeight - window.innerHeight));
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const translations = {
    hero: {
      lead: {
        pt: 'PORTAL EXCLUSIVO',
        es: 'PORTAL EXCLUSIVO'
      },
      title: {
        pt: 'Soluções Premium de Mobiliário para Profissionais',
        es: 'Soluciones Premium de Mobiliario para Profesionales'
      },
      subtitle: {
        pt: 'Especificações técnicas detalhadas, opções de personalização escaláveis e condições exclusivas para arquitetos, designers e compradores corporativos.',
        es: 'Especificaciones técnicas detalladas, opciones de personalización escalables y condiciones exclusivas para arquitectos, diseñadores y compradores corporativos.'
      },
      cta: {
        pt: 'Explorar Catálogo Técnico',
        es: 'Explorar Catálogo Técnico'
      },
      ctaSecondary: {
        pt: 'Agendar Consultoria',
        es: 'Programar Consultoría' 
      },
      video: {
        pt: 'Assista ao Tour Virtual',
        es: 'Ver Tour Virtual'
      }
    },
    features: {
      title: {
        pt: 'Recursos para Profissionais',
        es: 'Recursos para Profesionales'
      },
      subtitle: {
        pt: 'Ferramentas exclusivas para otimizar seu processo de especificação',
        es: 'Herramientas exclusivas para optimizar su proceso de especificación'
      },
      items: [
        {
          title: { pt: 'Especificações Técnicas Completas', es: 'Especificaciones Técnicas Completas' },
          description: { 
            pt: 'Acesse detalhes precisos sobre materiais, dimensões, resistência e durabilidade, com certificações e garantias documentadas.',
            es: 'Acceda a detalles precisos sobre materiales, dimensiones, resistencia y durabilidad, con certificaciones y garantías documentadas.'
          },
          icon: FileText,
          color: 'from-amber-400/20 to-amber-600/5'
        },
        {
          title: { pt: 'Biblioteca de Arquivos Técnicos', es: 'Biblioteca de Archivos Técnicos' },
          description: { 
            pt: 'Baixe catálogos técnicos, modelos 3D, renders em alta resolução e arquivos CAD compatíveis com seu software.',
            es: 'Descargue catálogos técnicos, modelos 3D, renderizaciones en alta resolución y archivos CAD compatibles con su software.'
          },
          icon: DownloadCloud,
          color: 'from-blue-400/20 to-blue-600/5'
        },
        {
          title: { pt: 'Personalização em Escala', es: 'Personalización a Escala' },
          description: { 
            pt: 'Configurador avançado para personalizar materiais, acabamentos, dimensões e detalhes técnicos para projetos corporativos.',
            es: 'Configurador avanzado para personalizar materiales, acabados, dimensiones y detalles técnicos para proyectos corporativos.'
          },
          icon: Workflow,
          color: 'from-emerald-400/20 to-emerald-600/5'
        },
        {
          title: { pt: 'Projetos Sob Demanda', es: 'Proyectos Bajo Demanda' },
          description: { 
            pt: 'Solicite desenvolvimentos exclusivos com nossa equipe técnica para necessidades específicas do seu projeto.',
            es: 'Solicite desarrollos exclusivos con nuestro equipo técnico para necesidades específicas de su proyecto.'
          },
          icon: PlusSquare,
          color: 'from-purple-400/20 to-purple-600/5'
        },
        {
          title: { pt: 'Condições Exclusivas', es: 'Condiciones Exclusivas' },
          description: { 
            pt: 'Prazos de entrega especiais, políticas de frete diferenciadas e condições comerciais para volume e recorrência.',
            es: 'Plazos de entrega especiales, políticas de flete diferenciadas y condiciones comerciales para volumen y recurrencia.'
          },
          icon: Award,
          color: 'from-rose-400/20 to-rose-600/5'
        },
        {
          title: { pt: 'Suporte Dedicado', es: 'Soporte Dedicado' },
          description: { 
            pt: 'Acesso exclusivo ao nosso time de especialistas para consultorias técnicas e acompanhamento de projetos.',
            es: 'Acceso exclusivo a nuestro equipo de especialistas para consultorías técnicas y seguimiento de proyectos.'
          },
          icon: Users,
          color: 'from-teal-400/20 to-teal-600/5'
        }
      ]
    },
    catalog: {
      title: {
        pt: 'Catálogo Técnico Avançado',
        es: 'Catálogo Técnico Avanzado'
      },
      subtitle: {
        pt: 'Explore nossa linha de produtos com todas as especificações necessárias para a sua especificação',
        es: 'Explore nuestra línea de productos con todas las especificaciones necesarias para su especificación'
      },
      tabs: {
        furniture: {
          pt: 'Mobiliário Corporativo',
          es: 'Mobiliario Corporativo'
        },
        lighting: {
          pt: 'Iluminação Técnica',
          es: 'Iluminación Técnica'
        },
        acoustic: {
          pt: 'Soluções Acústicas',
          es: 'Soluciones Acústicas'
        }
      },
      items: {
        furniture: [
          {
            id: 'exec-line',
            name: { pt: 'Linha Executiva Milano', es: 'Línea Ejecutiva Milano' },
            description: { 
              pt: 'Coleção de mobiliário para espaços executivos com opções de personalização premium.',
              es: 'Colección de mobiliario para espacios ejecutivos con opciones de personalización premium.'
            },
            specs: { 
              pt: 'Madeira nobre, couro natural, metal com acabamento premium',
              es: 'Madera noble, cuero natural, metal con acabado premium'
            },
            image: '/images/b2b-product-exec.jpg',
            downloads: 187
          },
          {
            id: 'modular-line',
            name: { pt: 'Sistema Modular Adaptive', es: 'Sistema Modular Adaptive' },
            description: { 
              pt: 'Mobiliário modular configurável para áreas de trabalho flexíveis e colaborativas.',
              es: 'Mobiliario modular configurable para áreas de trabajo flexibles y colaborativas.'
            },
            specs: { 
              pt: 'Estrutura de alumínio, MDF naval, acabamentos personalizáveis',
              es: 'Estructura de aluminio, MDF naval, acabados personalizables'
            },
            image: '/images/b2b-product-modular.jpg',
            downloads: 243
          },
          {
            id: 'acoustic-line',
            name: { pt: 'Linha Safe Spaces', es: 'Línea Safe Spaces' },
            description: { 
              pt: 'Soluções para áreas de privacidade com tratamento acústico e isolamento visual.',
              es: 'Soluciones para áreas de privacidad con tratamiento acústico y aislamiento visual.'
            },
            specs: { 
              pt: 'Painéis acústicos certificados, vidro temperado, estrutura de aço',
              es: 'Paneles acústicos certificados, vidrio templado, estructura de acero'
            },
            image: '/images/b2b-product-acoustic.jpg',
            downloads: 159
          }
        ],
        lighting: [
          {
            id: 'light-tech',
            name: { pt: 'Série Técnica Lumina Pro', es: 'Serie Técnica Lumina Pro' },
            description: { 
              pt: 'Iluminação técnica para ambientes de trabalho com controle de ofuscamento e temperatura.',
              es: 'Iluminación técnica para ambientes de trabajo con control de deslumbramiento y temperatura.'
            },
            specs: { 
              pt: 'LED de alta performance, CRI>95, 3000K-5000K ajustável',
              es: 'LED de alto rendimiento, CRI>95, 3000K-5000K ajustable'
            },
            image: '/images/b2b-product-lighting.jpg',
            downloads: 132
          }
        ],
        acoustic: [
          {
            id: 'sound-panels',
            name: { pt: 'Painéis Acústicos Modulares', es: 'Paneles Acústicos Modulares' },
            description: { 
              pt: 'Sistema modular de painéis acústicos para controle de reverberação em espaços comerciais.',
              es: 'Sistema modular de paneles acústicos para control de reverberación en espacios comerciales.'
            },
            specs: { 
              pt: 'NRC 0.95, classe A de absorção, tecidos com certificação antichama',
              es: 'NRC 0.95, clase A de absorción, tejidos con certificación antillama'
            },
            image: '/images/b2b-product-panels.jpg',
            downloads: 98
          }
        ]
      },
      viewAll: {
        pt: 'Ver catálogo completo',
        es: 'Ver catálogo completo'
      },
      downloadCta: {
        pt: 'Baixar especificações',
        es: 'Descargar especificaciones'
      }
    },
    process: {
      title: {
        pt: 'Processo Simplificado',
        es: 'Proceso Simplificado'
      },
      subtitle: {
        pt: 'Da especificação à entrega, oferecemos suporte em cada etapa',
        es: 'De la especificación a la entrega, ofrecemos soporte en cada etapa'
      },
      steps: [
        {
          title: { pt: 'Especificação Técnica', es: 'Especificación Técnica' },
          description: { 
            pt: 'Acesse catálogos detalhados e ferramentas de especificação personalizada.',
            es: 'Acceda a catálogos detallados y herramientas de especificación personalizada.'
          },
          icon: FileText
        },
        {
          title: { pt: 'Orçamento Exclusivo', es: 'Presupuesto Exclusivo' },
          description: { 
            pt: 'Receba condições especiais para profissionais e projetos corporativos.',
            es: 'Reciba condiciones especiales para profesionales y proyectos corporativos.'
          },
          icon: Briefcase
        },
        {
          title: { pt: 'Produção Personalizada', es: 'Producción Personalizada' },
          description: { 
            pt: 'Acompanhe a produção dos itens com possibilidade de personalização.',
            es: 'Siga la producción de los artículos con posibilidad de personalización.'
          },
          icon: Grid
        },
        {
          title: { pt: 'Entrega & Instalação', es: 'Entrega & Instalación' },
          description: { 
            pt: 'Serviço premium de logística e montagem por equipe especializada.',
            es: 'Servicio premium de logística y montaje por equipo especializado.'
          },
          icon: Shield
        }
      ],
      cta: {
        pt: 'Iniciar Projeto',
        es: 'Iniciar Proyecto'
      }
    },
    showcase: {
      title: {
        pt: 'Projetos Realizados',
        es: 'Proyectos Realizados'
      },
      subtitle: {
        pt: 'Cases de sucesso em projetos corporativos executados com nossos parceiros',
        es: 'Casos de éxito en proyectos corporativos ejecutados con nuestros socios'
      },
      projects: [
        {
          title: { pt: 'Sede Corporativa Nexus', es: 'Sede Corporativa Nexus' },
          description: { 
            pt: 'Projeto completo de mobiliário para sede corporativa de empresa de tecnologia.',
            es: 'Proyecto completo de mobiliario para sede corporativa de empresa de tecnología.'
          },
          specs: {
            area: { pt: '3.500m²', es: '3.500m²' },
            location: { pt: 'São Paulo, Brasil', es: 'São Paulo, Brasil' },
            partnership: { pt: 'Studio Arq & Design', es: 'Studio Arq & Design' }
          },
          image: '/images/b2b-project-1.jpg'
        },
        {
          title: { pt: 'Centro Executivo Platinum', es: 'Centro Ejecutivo Platinum' },
          description: { 
            pt: 'Fornecimento de mobiliário premium para centro executivo e salas de reunião.',
            es: 'Suministro de mobiliario premium para centro ejecutivo y salas de reunión.'
          },
          specs: {
            area: { pt: '1.200m²', es: '1.200m²' },
            location: { pt: 'Rio de Janeiro, Brasil', es: 'Rio de Janeiro, Brasil' },
            partnership: { pt: 'Mendez & Associates', es: 'Mendez & Associates' }
          },
          image: '/images/b2b-project-2.jpg'
        },
        {
          title: { pt: 'Escritórios Colaborativos Urban', es: 'Oficinas Colaborativas Urban' },
          description: { 
            pt: 'Desenvolvimento de espaços colaborativos flexíveis para coworking premium.',
            es: 'Desarrollo de espacios colaborativos flexibles para coworking premium.'
          },
          specs: {
            area: { pt: '2.800m²', es: '2.800m²' },
            location: { pt: 'Cidade do México, México', es: 'Ciudad de México, México' },
            partnership: { pt: 'Urban Spaces Architects', es: 'Urban Spaces Architects' }
          },
          image: '/images/b2b-project-3.jpg'
        }
      ],
      viewMore: {
        pt: 'Ver mais projetos',
        es: 'Ver más proyectos'
      }
    },
    testimonials: {
      title: {
        pt: 'O que nossos parceiros dizem',
        es: 'Lo que dicen nuestros socios'
      },
      items: [
        {
          quote: {
            pt: 'O nível de detalhamento técnico e suporte da equipe Afetto foi fundamental para especificarmos com precisão os itens para nosso projeto corporativo de grande escala.',
            es: 'El nivel de detalle técnico y soporte del equipo Afetto fue fundamental para especificar con precisión los elementos para nuestro proyecto corporativo a gran escala.'
          },
          author: 'Carla Mendes',
          role: {
            pt: 'Diretora de Projetos, Studio Arquitetura',
            es: 'Directora de Proyectos, Studio Arquitectura'
          }
        },
        {
          quote: {
            pt: 'A flexibilidade nas opções de personalização e a qualidade consistente dos produtos Afetto nos permitem oferecer soluções realmente exclusivas para clientes corporativos exigentes.',
            es: 'La flexibilidad en las opciones de personalización y la calidad consistente de los productos Afetto nos permiten ofrecer soluciones realmente exclusivas a clientes corporativos exigentes.'
          },
          author: 'Ricardo Soares',
          role: {
            pt: 'Arquiteto Principal, RS Design Group',
            es: 'Arquitecto Principal, RS Design Group'
          }
        },
        {
          quote: {
            pt: 'Os prazos de entrega cumpridos e a consistência na qualidade fazem da Afetto um parceiro confiável para nossos projetos de hotelaria de luxo em toda a América Latina.',
            es: 'Los plazos de entrega cumplidos y la consistencia en la calidad hacen de Afetto un socio confiable para nuestros proyectos hoteleros de lujo en toda América Latina.'
          },
          author: 'Ana Vega',
          role: {
            pt: 'Gerente de Compras, Luxury Hotels Group',
            es: 'Gerente de Compras, Luxury Hotels Group'
          }
        }
      ]
    },
    callToAction: {
      title: {
        pt: 'Pronto para transformar seus projetos?',
        es: '¿Listo para transformar sus proyectos?'
      },
      subtitle: {
        pt: 'Entre em contato com nossa equipe para uma consultoria personalizada',
        es: 'Contacte con nuestro equipo para una consultoría personalizada'
      },
      primary: {
        pt: 'Solicitar Consultoria',
        es: 'Solicitar Consultoría'
      },
      secondary: {
        pt: 'Explorar Catálogo',
        es: 'Explorar Catálogo'
      }
    },
    header: {
      resources: {
        pt: 'Recursos',
        es: 'Recursos'
      },
      catalog: {
        pt: 'Catálogo',
        es: 'Catálogo'
      },
      projects: {
        pt: 'Projetos',
        es: 'Proyectos'
      },
      support: {
        pt: 'Suporte',
        es: 'Soporte'
      },
      partnerArea: {
        pt: 'Área do Parceiro',
        es: 'Área del Socio'
      },
      search: {
        pt: 'Pesquisar',
        es: 'Buscar'
      }
    },
    footer: {
      resources: {
        pt: 'Recursos',
        es: 'Recursos'
      },
      specs: {
        pt: 'Especificações Técnicas',
        es: 'Especificaciones Técnicas'
      },
      downloads: {
        pt: 'Downloads',
        es: 'Descargas'
      },
      partnerPricing: {
        pt: 'Preços para Parceiros',
        es: 'Precios para Socios'
      },
      support: {
        pt: 'Suporte',
        es: 'Soporte'
      },
      becomePartner: {
        pt: 'Tornar-se Parceiro',
        es: 'Convertirse en Socio'
      },
      technicalSupport: {
        pt: 'Suporte Técnico',
        es: 'Soporte Técnico'
      },
      faq: {
        pt: 'Perguntas Frequentes',
        es: 'Preguntas Frecuentes'
      },
      contact: {
        pt: 'Contato',
        es: 'Contacto'
      },
      privacy: {
        pt: 'Política de Privacidade',
        es: 'Política de Privacidad'
      },
      terms: {
        pt: 'Termos de Uso',
        es: 'Términos de Uso'
      },
      switchVersion: {
        pt: 'Alternar para Versão Cliente',
        es: 'Cambiar a Versión Cliente'
      }
    }
  };

  // Custom animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: i * 0.1,
        ease: [0.22, 1, 0.36, 1]
      }
    })
  };

  const fadeInLeft = {
    hidden: { opacity: 0, x: 40 },
    visible: (i = 0) => ({
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        delay: i * 0.1,
        ease: [0.22, 1, 0.36, 1]
      }
    })
  };
  
  const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: (i = 0) => ({
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: i * 0.1,
        ease: [0.22, 1, 0.36, 1]
      }
    })
  };
  
  // Get active catalog items based on the selected tab
  const getActiveCatalogItems = () => {
    return translations.catalog.items[activeTab as keyof typeof translations.catalog.items] || [];
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="min-h-screen bg-gradient-to-br from-[#181617] via-[#23201C] to-[#1a1713] overflow-hidden"
    >
      {/* Progress bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-[2px] bg-accent z-[100]"
        style={{ 
          scaleX: scrollProgress,
          transformOrigin: "0%",
          opacity: navBackground ? 1 : 0
        }}
      />

      {/* Header */}
      <motion.header 
        className={`fixed top-0 left-0 right-0 h-[90px] z-50 flex items-center px-8 border-b transition-colors duration-500 ${
          navBackground ? "bg-[#181617]/95 backdrop-blur-md border-white/10" : "bg-transparent border-transparent"
        }`}
      >
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/b2b" className="text-white flex items-center">
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
            <motion.span 
              className="ml-2 text-accent text-sm border-l border-accent/30 pl-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >PRO</motion.span>
          </Link>

          <nav className="hidden lg:flex items-center space-x-8">
            <div className="relative group">
              <button className="flex items-center text-white/70 hover:text-accent transition-colors duration-300">
                <span>{translations.header.resources[language]}</span>
                <ChevronDown size={14} className="ml-1 opacity-70 group-hover:opacity-100" />
              </button>
              
              <div className="absolute left-0 top-full pt-5 hidden group-hover:block">
                <div className="bg-[#1a1713]/95 backdrop-blur-md border border-white/10 p-6 rounded-md w-64 shadow-xl">
                  <div className="space-y-4">
                    <Link to="/especificacoes-tecnicas" className="block text-white/70 hover:text-accent transition-colors duration-300">
                      {translations.footer.specs[language]}
                    </Link>
                    <Link to="/downloads" className="block text-white/70 hover:text-accent transition-colors duration-300">
                      {translations.footer.downloads[language]}
                    </Link>
                    <Link to="/projetos" className="block text-white/70 hover:text-accent transition-colors duration-300">
                      {translations.header.projects[language]}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            
            <Link to="/catalogo-tecnico" className="text-white/70 hover:text-accent transition-colors duration-300">
              {translations.header.catalog[language]}
            </Link>
            
            <Link to="/projetos" className="text-white/70 hover:text-accent transition-colors duration-300">
              {translations.header.projects[language]}
            </Link>
            
            <Link to="/suporte" className="text-white/70 hover:text-accent transition-colors duration-300">
              {translations.header.support[language]}
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <motion.button
              onClick={() => setShowSearch(!showSearch)}
              className="text-white/60 hover:text-white transition-colors duration-300 p-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Search size={18} />
            </motion.button>
            
            <Link
              to="/area-parceiro"
              className="hidden md:flex items-center text-white border border-white/20 px-5 py-2.5 hover:bg-accent hover:border-accent hover:text-black transition-all duration-500"
            >
              <span className="font-light tracking-wider">
                {translations.header.partnerArea[language]}
              </span>
              <ArrowUpRight size={14} className="ml-2" />
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Search Overlay */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-[60] backdrop-blur-md flex items-start justify-center pt-[20vh]"
          >
            <div className="container mx-auto px-6 max-w-3xl">
              <div className="relative">
                <input 
                  type="text"
                  className="w-full bg-transparent border-b-2 border-white/20 text-white text-2xl py-4 outline-none focus:border-accent transition-colors"
                  placeholder={translations.header.search[language] + "..."}
                  autoFocus
                />
                <button 
                  onClick={() => setShowSearch(false)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="mt-8 text-white/60">
                <p>{language === 'pt' ? 'Sugestões:' : 'Sugerencias:'}</p>
                <div className="flex flex-wrap gap-3 mt-4">
                  {['CAD Files', 'Technical Specs', 'Executive Furniture', 'Office Lighting', 'Custom Projects'].map((tag, idx) => (
                    <button 
                      key={idx}
                      className="px-4 py-2 border border-white/20 hover:border-accent hover:text-accent rounded-full transition-colors text-sm"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video Modal */}
      <AnimatePresence>
        {showVideoModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center"
          >
            <div className="relative w-full max-w-5xl aspect-video">
              <iframe 
                className="w-full h-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" 
                title="Afetto Virtual Tour"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
              
              <motion.button
                onClick={() => setShowVideoModal(false)}
                className="absolute -top-12 right-0 text-white/70 hover:text-white transition-colors"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
              >
                <X size={28} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section with Parallax Effects */}
      <section 
        ref={heroRef}
        className="relative min-h-screen flex items-center pt-28 pb-20 overflow-hidden"
      >
        <motion.div
          className="absolute inset-0 z-0"
          style={{ scale: heroScale }}
        >
          <motion.div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/60 to-black/30 z-10"></motion.div>
          <motion.video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover opacity-50"
            style={{ opacity: heroOpacity }}
          >
            <source src="/videos/b2b-hero.mp4" type="video/mp4" />
          </motion.video>
        </motion.div>

        <div className="container mx-auto px-6 md:px-10 lg:px-20 relative z-10">
          <div className="max-w-5xl">
            <motion.div 
              variants={fadeInUp}
              custom={0}
              initial="hidden"
              animate="visible"
              className="mb-6"
            >
              <span className="inline-block text-accent text-sm tracking-[0.2em] font-light uppercase border-b border-accent/30 pb-1">
                {translations.hero.lead[language]}
              </span>
            </motion.div>
            
            <motion.h1
              variants={fadeInUp}
              custom={1}
              initial="hidden"
              animate="visible"
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif text-white mb-6 leading-tight"
              style={{ y: heroTextY }}
            >
              {translations.hero.title[language]}
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              custom={2}
              initial="hidden"
              animate="visible"
              className="text-white/80 text-xl max-w-3xl mb-10 leading-relaxed"
            >
              {translations.hero.subtitle[language]}
            </motion.p>

            <motion.div
              variants={fadeInUp}
              custom={3}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap gap-6"
            >
              <Link
                to="/catalogo-tecnico"
                className="inline-flex items-center bg-accent px-8 py-4 text-black font-medium tracking-wide hover:bg-white transition-colors duration-500 group"
              >
                <span>{translations.hero.cta[language]}</span>
                <motion.div
                  className="ml-3"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, repeatDelay: 2 }}
                >
                  <ArrowRight size={16} />
                </motion.div>
              </Link>
              
              <Link
                to="/consultoria"
                className="inline-flex items-center border border-white/30 px-8 py-4 text-white tracking-wide hover:bg-white/10 transition-all duration-500"
              >
                <span>{translations.hero.ctaSecondary[language]}</span>
                <ChevronRight size={16} className="ml-3" />
              </Link>
              
              <motion.button
                onClick={() => setShowVideoModal(true)}
                className="inline-flex items-center text-white/80 hover:text-accent transition-colors duration-300 mt-2 sm:mt-0"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="h-10 w-10 rounded-full border border-white/20 flex items-center justify-center mr-3 group-hover:border-accent/50">
                  <PlayCircle size={16} className="text-accent" />
                </div>
                <span className="tracking-wide">
                  {translations.hero.video[language]}
                </span>
              </motion.button>
            </motion.div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <motion.div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-accent to-transparent mx-auto" />
        </motion.div>
      </section>

      {/* Features Grid with Animated Cards */}
      <section 
        ref={featuresRef}
        className="py-20 relative bg-gradient-to-b from-[#1a1713]/80 to-[#1a1713]"
      >
        {/* Background texture */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute inset-0 bg-[url('/images/texture-pattern.png')] bg-repeat"></div>
        </div>
        
        <div className="container mx-auto px-6 md:px-10 lg:px-20 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.h2
              variants={fadeInUp}
              custom={0}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-4xl font-serif text-white mb-4"
            >
              {translations.features.title[language]}
            </motion.h2>
            
            <motion.p
              variants={fadeInUp}
              custom={1}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-white/70 text-lg"
            >
              {translations.features.subtitle[language]}
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {translations.features.items.map((feature, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                custom={index * 0.1}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className={`bg-gradient-to-br ${feature.color} backdrop-blur-sm p-8 border border-white/10 rounded-sm`}
              >
                <div className="h-14 w-14 rounded-sm flex items-center justify-center mb-6 bg-white/5 backdrop-blur-sm">
                  <feature.icon size={28} className="text-accent" />
                </div>
                <h3 className="text-xl font-medium text-white mb-4">
                  {feature.title[language]}
                </h3>
                <p className="text-white/70 leading-relaxed mb-6">
                  {feature.description[language]}
                </p>
                <Link
                  to="#"
                  className="inline-flex items-center text-accent hover:text-white transition-colors duration-300 group"
                >
                  <span className="mr-2 border-b border-accent/30 pb-0.5 group-hover:border-white/30">
                    {language === 'pt' ? 'Saiba mais' : 'Saber más'}
                  </span>
                  <motion.div
                    animate={{ x: [0, 3, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, repeatDelay: 1 }}
                  >
                    <ArrowRight size={14} />
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Catalog Section with Tabbed Interface */}
      <section 
        ref={catalogRef}
        className="py-24 bg-[#1a1713] relative"
      >
        {/* Subtle grid background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <div className="h-full w-full bg-[url('/images/grid-pattern.svg')] bg-repeat"></div>
        </div>
        
        <div className="container mx-auto px-6 md:px-10 lg:px-20 relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <motion.h2
              variants={fadeInUp}
              custom={0}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-serif text-white mb-4"
            >
              {translations.catalog.title[language]}
            </motion.h2>
            
            <motion.p
              variants={fadeInUp}
              custom={1}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-white/70 text-lg md:text-xl max-w-3xl mx-auto"
            >
              {translations.catalog.subtitle[language]}
            </motion.p>
            
            {/* Catalog Tabs */}
            <motion.div
              variants={fadeInUp}
              custom={2}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex flex-wrap justify-center gap-2 mt-10 mb-12"
            >
              {Object.keys(translations.catalog.tabs).map((tab) => (
                <motion.button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 rounded-sm text-sm tracking-wider transition-colors ${
                    activeTab === tab 
                      ? "bg-accent text-black" 
                      : "bg-white/5 text-white/70 hover:bg-white/10"
                  }`}
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                >
                  {translations.catalog.tabs[tab as keyof typeof translations.catalog.tabs][language]}
                </motion.button>
              ))}
            </motion.div>
          </div>

          {/* Technical catalog items */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="wait">
              {getActiveCatalogItems().map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group bg-white/[0.02] backdrop-blur-sm rounded-sm overflow-hidden border border-white/10"
                >
                  <div className="relative h-72 overflow-hidden">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.6 }}
                      className="absolute inset-0"
                    >
                      <img
                        src={item.image}
                        alt={item.name[language]}
                        className="w-full h-full object-cover transition-transform duration-700"
                      />
                    </motion.div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center text-white/90 text-sm">
                          <Download size={14} className="mr-2" />
                          <span>{item.downloads}</span>
                        </div>
                        <Link
                          to={`/downloads/${item.id}`}
                          className="flex items-center text-accent bg-black/70 backdrop-blur-sm px-3 py-1.5 text-xs tracking-wider"
                        >
                          {translations.catalog.downloadCta[language]}
                          <ChevronRight size={14} className="ml-1" />
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-medium text-white mb-2">
                      {item.name[language]}
                    </h3>
                    <p className="text-white/60 mb-4 line-clamp-2">
                      {item.description[language]}
                    </p>
                    <div className="mb-5">
                      <div className="text-xs uppercase tracking-wider text-white/40 mb-1.5">
                        {language === 'pt' ? 'Especificações' : 'Especificaciones'}
                      </div>
                      <p className="text-sm text-white/80">
                        {item.specs[language]}
                      </p>
                    </div>
                    <Link
                      to={`/produto/${item.id}`}
                      className="inline-flex items-center text-accent hover:text-white transition-colors duration-300 text-sm tracking-wider"
                    >
                      <span className="mr-2 border-b border-accent/30 pb-0.5 hover:border-white/30">
                        {language === 'pt' ? 'Ver detalhes técnicos' : 'Ver detalles técnicos'}
                      </span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="text-center mt-16">
            <motion.div
              variants={scaleIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <Link
                to="/catalogo-tecnico"
                className="inline-flex items-center border border-accent px-8 py-4 text-white hover:bg-accent hover:text-black transition-all duration-300"
              >
                <span>
                  {translations.catalog.viewAll[language]}
                </span>
                <motion.div
                  className="ml-3"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, repeatDelay: 2 }}
                >
                  <ArrowRight size={16} />
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Process Section */}
      <section 
        ref={processRef}
        className="py-24 bg-[#23201C] relative overflow-hidden"
      >
        <div className="absolute -right-[30%] top-0 bottom-0 w-[60%] bg-accent/5 rounded-l-[100px] transform rotate-12"></div>
        <div className="absolute -left-[30%] bottom-0 top-0 w-[60%] bg-accent/3 rounded-r-[100px] transform -rotate-12"></div>
        
        <div className="container mx-auto px-6 md:px-10 lg:px-20 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.h2
              variants={fadeInUp}
              custom={0}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-4xl font-serif text-white mb-4"
            >
              {translations.process.title[language]}
            </motion.h2>
            
            <motion.p
              variants={fadeInUp}
              custom={1}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-white/70 text-lg"
            >
              {translations.process.subtitle[language]}
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4 max-w-5xl mx-auto">
            {translations.process.steps.map((step, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                custom={index * 0.2}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="relative"
              >
                <div className="bg-white/5 backdrop-blur-md p-6 rounded-sm border border-white/10 h-full">
                  <motion.div
                    className="h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center mb-6 relative"
                    whileHover={{ 
                      rotate: 5, 
                      scale: 1.1,
                      boxShadow: "0 0 15px rgba(211, 161, 126, 0.3)" 
                    }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <step.icon size={24} className="text-accent" />
                    <div className="absolute -top-3 -right-3 bg-accent h-6 w-6 rounded-full text-black text-sm font-medium flex items-center justify-center">
                      {index + 1}
                    </div>
                  </motion.div>
                  
                  <h3 className="text-white text-xl mb-3">
                    {step.title[language]}
                  </h3>
                  <p className="text-white/70">
                    {step.description[language]}
                  </p>
                </div>
                
                {index < translations.process.steps.length - 1 && (
                  <motion.div 
                    className="hidden lg:block absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-10 h-[1px] bg-white/20"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  />
                )}
              </motion.div>
            ))}
          </div>
          
          <motion.div
            className="text-center mt-12"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Link
              to="/iniciar-projeto"
              className="inline-flex items-center bg-accent/90 hover:bg-accent px-8 py-4 text-black font-medium tracking-wide transition-all duration-300"
            >
              <span>{translations.process.cta[language]}</span>
              <ArrowUpRight size={16} className="ml-3" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Project Showcase with Hover Effects */}
      <section 
        ref={showcaseRef}
        className="py-24 bg-[#1a1713] relative"
      >
        <div className="container mx-auto px-6 md:px-10 lg:px-20 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.h2
              variants={fadeInUp}
              custom={0}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-4xl font-serif text-white mb-4"
            >
              {translations.showcase.title[language]}
            </motion.h2>
            
            <motion.p
              variants={fadeInUp}
              custom={1}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-white/70 text-lg"
            >
              {translations.showcase.subtitle[language]}
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {translations.showcase.projects.map((project, index) => (
              <motion.div
                key={index}
                variants={fadeInLeft}
                custom={index * 0.2}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="group relative h-[500px] overflow-hidden rounded-sm border border-white/10"
              >
                <motion.div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700"
                  style={{ backgroundImage: `url(${project.image})` }}
                  whileHover={{ scale: 1.05 }}
                ></motion.div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                
                <div className="absolute inset-x-0 bottom-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-2xl font-serif text-white mb-3">
                    {project.title[language]}
                  </h3>
                  <p className="text-white/80 mb-5">
                    {project.description[language]}
                  </p>
                  
                  <div className="grid grid-cols-3 gap-4 mb-6 group-hover:opacity-100 opacity-80 transition-opacity">
                    <div>
                      <div className="text-accent text-xs uppercase tracking-wider mb-1">
                        {language === 'pt' ? 'Área' : 'Área'}
                      </div>
                      <div className="text-white text-sm">
                        {project.specs.area[language]}
                      </div>
                    </div>
                    <div>
                      <div className="text-accent text-xs uppercase tracking-wider mb-1">
                        {language === 'pt' ? 'Local' : 'Ubicación'}
                      </div>
                      <div className="text-white text-sm">
                        {project.specs.location[language]}
                      </div>
                    </div>
                    <div>
                      <div className="text-accent text-xs uppercase tracking-wider mb-1">
                        {language === 'pt' ? 'Parceiro' : 'Socio'}
                      </div>
                      <div className="text-white text-sm">
                        {project.specs.partnership[language]}
                      </div>
                    </div>
                  </div>
                  
                  <Link
                    to={`/projetos/${index + 1}`}
                    className="inline-flex items-center text-accent hover:text-white transition-colors duration-300"
                  >
                    <span className="mr-2 border-b border-accent/30 pb-0.5 hover:border-white/30">
                      {language === 'pt' ? 'Ver detalhes do projeto' : 'Ver detalles del proyecto'}
                    </span>
                    <ArrowUpRight size={14} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <motion.div
              variants={scaleIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <Link
                to="/projetos"
                className="inline-flex items-center border border-white/20 px-8 py-4 text-white hover:bg-white/10 transition-all duration-300"
              >
                <span>
                  {translations.showcase.viewMore[language]}
                </span>
                <ArrowRight size={16} className="ml-3" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section 
        ref={testimonialsRef}
        className="py-24 bg-[#23201C] relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent"></div>
        
        <div className="container mx-auto px-6 md:px-10 lg:px-20 relative z-10">
          <motion.h2
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-4xl font-serif text-white mb-16 text-center"
          >
            {translations.testimonials.title[language]}
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {translations.testimonials.items.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                custom={index * 0.2}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileHover={{ y: -5, boxShadow: "0 15px 30px -15px rgba(0, 0, 0, 0.3)" }}
                className="bg-white/5 backdrop-blur-sm p-8 border border-white/10 rounded-sm relative"
              >
                <svg className="text-accent/20 absolute top-4 right-4 h-12 w-12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                
                <p className="text-white/80 mb-6 relative">
                  "{testimonial.quote[language]}"
                </p>
                
                <div>
                  <div className="text-white text-lg font-medium">
                    {testimonial.author}
                  </div>
                  <div className="text-white/60 text-sm">
                    {testimonial.role[language]}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-24 bg-[#1a1713] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/pattern.svg')] bg-repeat"></div>
        </div>
        
        <div className="container mx-auto px-6 md:px-10 lg:px-20 relative z-10">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-black/40 via-black/60 to-black/40 backdrop-blur-md p-12 lg:p-16 border border-white/10 rounded-sm relative overflow-hidden">
             {/* Decorative elements */}
             <div className="absolute -top-10 -right-10 w-40 h-40 blur-[80px] bg-accent/30 rounded-full"></div>
             <div className="absolute -bottom-20 -left-20 w-60 h-60 blur-[100px] bg-accent/20 rounded-full"></div>
             <motion.div 
               className="absolute top-0 left-0 w-full h-1"
               initial={{ scaleX: 0, originX: 0 }}
               whileInView={{ scaleX: 1 }}
               viewport={{ once: true }}
               transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
             >
               <div className="h-full w-full bg-gradient-to-r from-transparent via-accent to-transparent"></div>
             </motion.div>
             <motion.div 
               className="absolute bottom-0 left-0 w-full h-1"
               initial={{ scaleX: 0, originX: 1 }}
               whileInView={{ scaleX: 1 }}
               viewport={{ once: true }}
               transition={{ duration: 1.2, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
             >
               <div className="h-full w-full bg-gradient-to-r from-transparent via-accent to-transparent"></div>
             </motion.div>
             <motion.div 
               className="absolute left-0 top-0 h-full w-1"
               initial={{ scaleY: 0, originY: 0 }}
               whileInView={{ scaleY: 1 }}
               viewport={{ once: true }}
               transition={{ duration: 1.2, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
             >
               <div className="w-full h-full bg-gradient-to-b from-transparent via-accent to-transparent"></div>
             </motion.div>
             <motion.div 
               className="absolute right-0 top-0 h-full w-1"
               initial={{ scaleY: 0, originY: 1 }}
               whileInView={{ scaleY: 1 }}
               viewport={{ once: true }}
               transition={{ duration: 1.2, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
             >
               <div className="w-full h-full bg-gradient-to-b from-transparent via-accent to-transparent"></div>
             </motion.div>
             
             {/* Content */}
             <div className="relative z-10">
               <motion.h2
                 variants={fadeInUp}
                 initial="hidden"
                 whileInView="visible"
                 viewport={{ once: true }}
                 className="text-4xl md:text-5xl font-serif text-white mb-6 text-center"
               >
                 {translations.callToAction.title[language]}
               </motion.h2>
               
               <motion.p
                 variants={fadeInUp}
                 custom={0.1}
                 initial="hidden"
                 whileInView="visible"
                 viewport={{ once: true }}
                 className="text-white/70 text-lg md:text-xl text-center mb-10"
               >
                 {translations.callToAction.subtitle[language]}
               </motion.p>
               
               <motion.div
                 variants={fadeInUp}
                 custom={0.2}
                 initial="hidden"
                 whileInView="visible"
                 viewport={{ once: true }}
                 className="flex flex-col sm:flex-row gap-4 justify-center items-center"
               >
                 <Link
                   to="/consultoria"
                   className="group inline-flex items-center justify-center bg-accent hover:bg-accent/90 text-black px-8 py-4 min-w-[220px] transition-all duration-300 relative overflow-hidden"
                 >
                   <motion.span 
                     className="absolute inset-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-800 ease-out"
                   />
                   <span className="relative z-10 font-medium tracking-wide flex items-center">
                     {translations.callToAction.primary[language]}
                     <ArrowUpRight size={18} className="ml-2 relative top-px" />
                   </span>
                 </Link>
                 
                 <Link
                   to="/catalogo-tecnico"
                   className="group inline-flex items-center justify-center border border-white/30 hover:border-accent text-white hover:text-accent px-8 py-4 min-w-[220px] transition-all duration-300"
                 >
                   <span className="tracking-wide flex items-center">
                     {translations.callToAction.secondary[language]}
                     <motion.span
                       animate={{ x: [0, 5, 0] }}
                       transition={{ repeat: Infinity, duration: 1.5, repeatDelay: 1 }}
                     >
                       <ArrowRight size={18} className="ml-2 relative top-px" />
                     </motion.span>
                   </span>
                 </Link>
               </motion.div>
             </div>
           </div>
           
           {/* Floating statistics cards */}
           <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto relative z-10">
             <motion.div
               variants={scaleIn}
               custom={0}
               initial="hidden"
               whileInView="visible"
               viewport={{ once: true, margin: "-100px" }}
               whileHover={{ y: -8, boxShadow: "0 20px 40px -20px rgba(0, 0, 0, 0.3)" }}
               className="bg-white/5 backdrop-blur-sm p-8 border border-white/10 rounded-sm"
             >
               <div className="text-5xl md:text-6xl font-serif text-white mb-4">
                 <CountUp start={0} end={500} duration={2.5} separator="," />+
               </div>
               <div className="text-accent text-lg mb-2">
                 {language === 'pt' ? 'Arquivos Técnicos' : 'Archivos Técnicos'}
               </div>
               <p className="text-white/60">
                 {language === 'pt' ? 'Atualizados semanalmente com novas especificações e modelos.' : 'Actualizados semanalmente con nuevas especificaciones y modelos.'}
               </p>
             </motion.div>
             
             <motion.div
               variants={scaleIn}
               custom={0.1}
               initial="hidden"
               whileInView="visible"
               viewport={{ once: true, margin: "-100px" }}
               whileHover={{ y: -8, boxShadow: "0 20px 40px -20px rgba(0, 0, 0, 0.3)" }}
               className="bg-white/5 backdrop-blur-sm p-8 border border-white/10 rounded-sm"
             >
               <div className="text-5xl md:text-6xl font-serif text-white mb-4">
                 <CountUp start={0} end={150} duration={2.5} separator="," />+
               </div>
               <div className="text-accent text-lg mb-2">
                 {language === 'pt' ? 'Projetos Corporativos' : 'Proyectos Corporativos'}
               </div>
               <p className="text-white/60">
                 {language === 'pt' ? 'Executados com excelência para clientes ao redor do mundo.' : 'Ejecutados con excelencia para clientes alrededor del mundo.'}
               </p>
             </motion.div>
             
             <motion.div
               variants={scaleIn}
               custom={0.2}
               initial="hidden"
               whileInView="visible"
               viewport={{ once: true, margin: "-100px" }}
               whileHover={{ y: -8, boxShadow: "0 20px 40px -20px rgba(0, 0, 0, 0.3)" }}
               className="bg-white/5 backdrop-blur-sm p-8 border border-white/10 rounded-sm"
             >
               <div className="text-5xl md:text-6xl font-serif text-white mb-4">
                 <CountUp start={0} end={98} duration={2.5} suffix="%" />
               </div>
               <div className="text-accent text-lg mb-2">
                 {language === 'pt' ? 'Taxa de Satisfação' : 'Tasa de Satisfacción'}
               </div>
               <p className="text-white/60">
                 {language === 'pt' ? 'De nossos parceiros e clientes corporativos em nossas avaliações.' : 'De nuestros socios y clientes corporativos en nuestras evaluaciones.'}
               </p>
             </motion.div>
           </div>
         </div>
       </section>

       {/* Advanced Footer with Premium Design */}
       <footer className="bg-[#181617] border-t border-white/10 relative overflow-hidden pt-20 pb-10">
         <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent"></div>
         <div className="absolute inset-0 opacity-5">
           <div className="absolute inset-0 bg-[url('/images/texture-pattern.png')] bg-repeat"></div>
         </div>
         
         <div className="container mx-auto px-6 md:px-10 lg:px-20 relative z-10">
           <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-16">
             <div className="col-span-1 md:col-span-1">
               <Link to="/b2b" className="flex items-center mb-6">
                 <svg width="60" height="30" viewBox="0 0 120 24" className="text-white">
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
                 <span className="ml-1 font-serif tracking-wider text-2xl text-white">afetto</span>
                 <span className="ml-1 text-accent text-sm border-l border-accent/30 pl-2">PRO</span>
               </Link>
               
               <p className="text-white/60 mb-6">
                 {language === 'pt' 
                   ? 'Soluções exclusivas de mobiliário e design para profissionais e projetos corporativos.' 
                   : 'Soluciones exclusivas de mobiliario y diseño para profesionales y proyectos corporativos.'
                 }
               </p>
               
               <div className="flex space-x-4">
                 <motion.a 
                   href="https://linkedin.com" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="h-10 w-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-accent hover:border-accent transition-colors duration-300"
                   whileHover={{ y: -3, scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                 >
                   <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                     <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                   </svg>
                 </motion.a>
                 <motion.a 
                   href="https://instagram.com" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="h-10 w-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-accent hover:border-accent transition-colors duration-300"
                   whileHover={{ y: -3, scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                 >
                   <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                     <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                   </svg>
                 </motion.a>
                 <motion.a 
                   href="https://pinterest.com" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="h-10 w-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-accent hover:border-accent transition-colors duration-300"
                   whileHover={{ y: -3, scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                 >
                   <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                     <path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
                   </svg>
                 </motion.a>
               </div>
             </div>
             
             <div>
               <h3 className="text-white text-lg mb-6 font-medium">
                 {translations.footer.resources[language]}
               </h3>
               <ul className="space-y-3">
                 <li>
                   <Link to="/especificacoes-tecnicas" className="text-white/60 hover:text-accent transition-colors duration-300">
                     {translations.footer.specs[language]}
                   </Link>
                 </li>
                 <li>
                   <Link to="/downloads" className="text-white/60 hover:text-accent transition-colors duration-300">
                     {translations.footer.downloads[language]}
                   </Link>
                 </li>
                 <li>
                   <Link to="/precos-parceiros" className="text-white/60 hover:text-accent transition-colors duration-300">
                     {translations.footer.partnerPricing[language]}
                   </Link>
                 </li>
               </ul>
             </div>
             
             <div>
               <h3 className="text-white text-lg mb-6 font-medium">
                 {translations.footer.support[language]}
               </h3>
               <ul className="space-y-3">
                 <li>
                   <Link to="/tornar-se-parceiro" className="text-white/60 hover:text-accent transition-colors duration-300">
                     {translations.footer.becomePartner[language]}
                   </Link>
                 </li>
                 <li>
                   <Link to="/suporte-tecnico" className="text-white/60 hover:text-accent transition-colors duration-300">
                     {translations.footer.technicalSupport[language]}
                   </Link>
                 </li>
                 <li>
                   <Link to="/faq" className="text-white/60 hover:text-accent transition-colors duration-300">
                     {translations.footer.faq[language]}
                   </Link>
                 </li>
               </ul>
             </div>
             
             <div>
               <h3 className="text-white text-lg mb-6 font-medium">
                 {translations.footer.contact[language]}
               </h3>
               <ul className="space-y-3">
                 <li className="flex items-start">
                   <MapPin size={18} className="text-accent mr-3 mt-1 flex-shrink-0" />
                   <span className="text-white/60">
                     Av. Paulista, 1000, São Paulo - SP, Brasil
                   </span>
                 </li>
                 <li className="flex items-start">
                   <Mail size={18} className="text-accent mr-3 mt-1 flex-shrink-0" />
                   <a href="mailto:comercial@afetto.com.br" className="text-white/60 hover:text-accent transition-colors duration-300">
                     comercial@afetto.com.br
                   </a>
                 </li>
                 <li className="flex items-start">
                   <Clock size={18} className="text-accent mr-3 mt-1 flex-shrink-0" />
                   <span className="text-white/60">
                     {language === 'pt' ? 'Seg-Sex, 9h às 18h' : 'Lun-Vie, 9h a 18h'}
                   </span>
                 </li>
               </ul>
             </div>
           </div>
           
           <div className="pt-8 mt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
             <p className="text-white/40 text-sm mb-4 md:mb-0">
               &copy; {new Date().getFullYear()} Afetto. {language === 'pt' ? 'Todos os direitos reservados.' : 'Todos los derechos reservados.'}
             </p>
             
             <div className="flex flex-wrap justify-center gap-4 md:gap-8">
               <Link to="/politica-privacidade" className="text-white/40 text-sm hover:text-accent transition-colors duration-300">
                 {translations.footer.privacy[language]}
               </Link>
               <Link to="/termos-uso" className="text-white/40 text-sm hover:text-accent transition-colors duration-300">
                 {translations.footer.terms[language]}
               </Link>
               <button 
                 onClick={resetUserType}
                 className="text-white/40 text-sm hover:text-accent transition-colors duration-300 flex items-center"
               >
                 <ArrowUpRight size={14} className="mr-1" />
                 {translations.footer.switchVersion[language]}
               </button>
             </div>
           </div>
         </div>
         
         {/* Back to top button */}
         <motion.button
           onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
           className="fixed bottom-6 right-6 h-12 w-12 bg-accent/90 hover:bg-accent text-black flex items-center justify-center rounded-sm shadow-lg z-20"
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: navBackground ? 1 : 0, y: navBackground ? 0 : 20 }}
           whileHover={{ y: -3 }}
           whileTap={{ scale: 0.95 }}
         >
           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
             <path d="M12 19V5M5 12l7-7 7 7"/>
           </svg>
         </motion.button>
       </footer>
     </motion.div>
   );
};

export default B2BHome;