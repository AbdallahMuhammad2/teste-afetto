import React, { useContext, useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  motion, useScroll, useTransform, AnimatePresence, useSpring,
  MotionValue, useMotionValue, useMotionValueEvent, useAnimation, animate
} from 'framer-motion';
// Corrija o erro de importação adicionando ChevronDown aos imports do Lucide React
import {
  ChevronRight, ArrowRight, ArrowDown, Plus, ChevronDown
} from 'lucide-react';
import FeaturedProjects from '../components/home/FeaturedProjects';
import ErrorBoundary from '../components/ErrorBoundary';
// Restante das importações permanecem as mesmasimport LanguageContext from '../context/LanguageContext';
import Icon from '../components/ui/Icon';
import { translations } from '../data/translations';
import { projects } from '../data/projects';
import ProjectsGrid from '../components/ProjectsGrid';
import { useLenis } from '@studio-freight/react-lenis';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { blendColor } from '../utils/color';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, OrbitControls, ContactShadows, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Vector2 } from 'three';
import LanguageContext from '../context/LanguageContext';
interface Material {
  id: string;
  name: string;
  type: string;
  origin: string;
  color: string;
  roughness: number;
  metalness: number;
  durability: number;
  maintenance: number;
  sustainability: number;
  applications: { pt: string; en: string; }[];
  description: { pt: string; es: string; };
}

interface AllMaterials {
  woods: Material[];
  fabrics: Material[];
  metals: Material[];
  stones: Material[];
}

// Enhanced parallax effect with variable intensity
const useParallax = (value: MotionValue<number>, distance: number, reverse = false) => {
  return useTransform(value, [0, 1], reverse ? [distance, 0] : [0, distance]);
};

// Custom spring physics options
const fastSpring = { stiffness: 220, damping: 20, mass: 1 };
const slowSpring = { stiffness: 100, damping: 30, mass: 1 };

// Enhanced typography animations with premium timing
const textReveal = {
  hidden: { y: 100, opacity: 0 },
  visible: (i = 0) => ({
    y: 0,
    opacity: 1,
    transition: {
      duration: 1.2,
      delay: 0.1 * i,
      ease: [0.22, 1, 0.36, 1]
    }
  })
};

const lineReveal = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: (i = 0) => ({
    scaleX: 1,
    opacity: 1,
    transition: {
      duration: 1.4,
      delay: 0.2 + (0.1 * i),
      ease: [0.22, 1, 0.36, 1]
    }
  })
};

// Add this to create premium hover effects for all buttons
const premiumButtonHover = (event: MouseEvent) => {
  const button = event.currentTarget as HTMLButtonElement;
  const rect = button.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  button.style.setProperty('--x', `${x}px`);
  button.style.setProperty('--y', `${y}px`);
};

interface MaterialProps {
  color: string;
  metalness?: number;
  roughness?: number;
  clearcoat?: number;
}

const MaterialShowcase = ({ material }: { material: MaterialProps }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [isSpinning, setIsSpinning] = useState(true);
  const [showMode, setShowMode] = useState('material'); // 'material', 'furniture'
  const [furniture, setFurniture] = useState('table'); // 'table', 'chair', 'cabinet'

  // Auto-rotation
  useFrame((state) => {
    if (meshRef.current && isSpinning) {
      meshRef.current.rotation.y += 0.003;
    }
  });

  // Toggle between showing just material or furniture application
  const toggleShowMode = () => {
    setShowMode(showMode === 'material' ? 'furniture' : 'material');
  };

  // Cycle through furniture types
  const cycleFurniture = () => {
    const types = ['table', 'chair', 'cabinet'];
    const currentIndex = types.indexOf(furniture);
    const nextIndex = (currentIndex + 1) % types.length;
    setFurniture(types[nextIndex]);
  };
  const { scrollYProgress } = useScroll();

  // Material showcase with simple shapes
  const renderMaterial = () => (
    <mesh
      ref={meshRef}
      castShadow
      receiveShadow
      onClick={() => setIsSpinning(!isSpinning)}
      onDoubleClick={toggleShowMode}
    >
      {furniture === 'table' && <boxGeometry args={[3, 0.2, 1.5]} />}
      {furniture === 'chair' && (
        <group>
          <mesh position={[0, -0.5, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.5, 0.05, 0.5]} /> {/* seat */}
            <meshPhysicalMaterial {...getMaterialProps()} />
          </mesh>
          <mesh position={[0, 0, -0.25]} castShadow receiveShadow>
            <boxGeometry args={[0.5, 1, 0.05]} /> {/* backrest */}
            <meshPhysicalMaterial {...getMaterialProps()} />
          </mesh>
          <mesh position={[-0.225, -1, 0.225]} castShadow receiveShadow>
            <cylinderGeometry args={[0.03, 0.03, 1]} /> {/* leg */}
            <meshStandardMaterial color="#5A3A22" />
          </mesh>
          <mesh position={[0.225, -1, 0.225]} castShadow receiveShadow>
            <cylinderGeometry args={[0.03, 0.03, 1]} /> {/* leg */}
            <meshStandardMaterial color="#5A3A22" />
          </mesh>
          <mesh position={[-0.225, -1, -0.225]} castShadow receiveShadow>
            <cylinderGeometry args={[0.03, 0.03, 1]} /> {/* leg */}
            <meshStandardMaterial color="#5A3A22" />
          </mesh>
          <mesh position={[0.225, -1, -0.225]} castShadow receiveShadow>
            <cylinderGeometry args={[0.03, 0.03, 1]} /> {/* leg */}
            <meshStandardMaterial color="#5A3A22" />
          </mesh>
        </group>
      )}
      {furniture === 'cabinet' && (
        <group>
          <mesh position={[0, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.5, 1, 0.5]} /> {/* cabinet body */}
            <meshPhysicalMaterial {...getMaterialProps()} />
          </mesh>
          <mesh position={[0, 0, 0.26]} castShadow receiveShadow>
            <boxGeometry args={[0.7, 0.7, 0.02]} /> {/* door */}
            <meshPhysicalMaterial {...getMaterialProps(0.9)} />
          </mesh>
          <mesh position={[0.35, 0, 0.26]} castShadow receiveShadow rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.05, 8]} /> {/* handle */}
            <meshStandardMaterial color="#D4AF37" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>
      )}
      {showMode === 'material' && (
        <>
          {furniture === 'table' && <meshPhysicalMaterial {...getMaterialProps()} />}
        </>
      )}
    </mesh>
  );

  const { language } = useContext(LanguageContext);

  // Helper to get material properties with potential overrides
  const getMaterialProps = (roughnessMultiplier = 1) => ({
    color: material.color,
    metalness: material.metalness || 0.2,
    roughness: (material.roughness || 0.3) * roughnessMultiplier,
    clearcoat: material.clearcoat || 0.5,
    clearcoatRoughness: 0.2,
    envMapIntensity: 1.5
  });

  return (
    <group scale={showMode === 'furniture' ? 0.7 : 1}>
      {renderMaterial()}

      {/* Interactive instructions */}
      <Html position={[0, -2.2, 0]} center>
        <div className="bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full text-white/90 text-xs pointer-events-none">
          {isSpinning ? "Clique para pausar" : "Clique para girar"} • Clique duplo para mudar visualização
        </div>
      </Html>

      {/* Material type indicator */}
      <Html position={[2, 1.7, 0]}>
        <button
          onClick={cycleFurniture}
          className="bg-black/40 backdrop-blur-sm px-3 py-1 rounded text-white/90 text-xs border border-white/20 hover:border-accent/50 transition-colors"
        >
          {furniture === 'table' && (language === 'pt' ? 'Mesa' : 'Mesa')}
          {furniture === 'chair' && (language === 'pt' ? 'Cadeira' : 'Silla')}
          {furniture === 'cabinet' && (language === 'pt' ? 'Armário' : 'Armario')}
        </button>
      </Html>
    </group>
  );
};

// Componente de cartão de material aprimorado
interface MaterialCardProps {
  material: Material;
  isActive: boolean;
  onSelect: () => void;
  index: number;
  isFabric?: boolean;
}

const MaterialCard = ({ material, isActive, onSelect, index, isFabric = false }: MaterialCardProps) => {
  return (
    <motion.button
      key={material.id}
      onClick={onSelect}
      className={`relative group overflow-hidden rounded-lg transition-all duration-500 aspect-square ${isActive
          ? 'ring-1 ring-accent scale-[1.02] shadow-xl shadow-accent/10 z-10'
          : 'ring-0 hover:ring-1 ring-white/10'
        }`}
      whileHover={{
        y: -5,
        boxShadow: "0 15px 30px rgba(0,0,0,0.2), 0 5px 15px rgba(0,0,0,0.15)"
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 + (index * 0.05) }}
    >
      <div className="w-full h-full">
        {!isFabric ? (
          <img
            src={`/images/materials/${material.id}.jpg`}
            alt={material.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '/images/materials/fallback.jpg';
            }}
          />
        ) : (
          <div
            className="w-full h-full transition-all duration-700 group-hover:scale-110"
            style={{ background: material.color }}
          ></div>
        )}
      </div>

      {/* Sobreposição com gradiente aprimorado */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      {/* Nome do material com animação aprimorada */}
      <div className="absolute inset-x-0 bottom-0 p-4 text-left">
        <div className="transform translate-y-6 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <p className="text-white text-base font-serif font-light">{material.name}</p>
          <p className="text-white/60 text-xs mt-1 font-sans">{material.type}</p>
        </div>
      </div>

      {/* Indicador ativo aprimorado */}
      {isActive && (
        <div className="absolute inset-0 ring-1 ring-accent pointer-events-none">
          <motion.div
            className="absolute top-2 right-2 h-2 w-2 rounded-full bg-accent shadow-lg shadow-accent/30"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              duration: 2,
              repeat: Infinity
            }}
          />
        </div>
      )}
    </motion.button>
  );
};
const MaterialIcon = ({ type, active }: { type: string; active: boolean }) => {
  const color = active ? "#000" : "#fff";
  const opacity = active ? "1" : "0.7";

  switch (type) {
    case 'wood-grain':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity }}>
          <path d="M2 12h20M2 8h20M2 16h20M2 4h20M2 20h20" />
        </svg>
      );
    case 'fabric':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity }}>
          <path d="M3 3v18M21 3v18M12 3v18M3 3h18M3 21h18M3 12h18" />
        </svg>
      );
    case 'metal':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity }}>
          <path d="M12 2v20M4.5 4v16M19.5 4v16M2 12h20" />
        </svg>
      );
    case 'stone':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity }}>
          <path d="M21 12L12 3 3 12l9 9 9-9z" />
        </svg>
      );
    case 'glass':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity }}>
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z" />
          <path d="M12 18c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6-6-2.7 6-6 6z" strokeOpacity="0.7" />
        </svg>
      );
    case 'leather':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity }}>
          <path d="M3 6h18M3 12h18M3 18h18" />
          <path d="M4 3l16 18M20 3L4 21" />
        </svg>
      );
    case 'finish':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity }}>
          <path d="M2 20h20M2 4h20M12 4v16" />
          <path d="M6 12h12M19 8l-3.5 7-2.5-3-4 6.5-3-3.5" />
        </svg>
      );
    default:
      return null;
  }
};

// Define material interfaces outside the component
interface ApplicationTranslation {
  pt: string;
  en: string;
}

interface MaterialDescription {
  pt: string;
  es: string;
}

interface Material {
  id: string;
  name: string;
  type: string;
  origin: string;
  color: string;
  roughness: number;
  metalness: number;
  durability: number;
  maintenance: number;
  sustainability: number;
  applications: ApplicationTranslation[];
  description: MaterialDescription;
}

interface AllMaterials {
  woods: Material[];
  fabrics: Material[];
  metals: Material[];
  stones: Material[];
}

// Material showcase component needs to be defined outside
// Removed duplicate definition of EnhancedMaterialShowcase

const Home: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('all'); // Initialize activeFilter with a default value
  // Context and data handling
  const { language } = useContext(LanguageContext);
  const t = translations[language];
  const featuredProjects = projects.filter(project => project.featured);
  const isReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Advanced refs for sophisticated scroll interactions
  const heroRef = useRef<HTMLDivElement>(null);
  const mainScrollRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const processRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const projectsScrollRef = useRef<HTMLDivElement>(null);

  // Enhanced state management for interactions
  const [activeProject, setActiveProject] = useState<number | null>(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState("default");
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');
  const [videoLoaded, setVideoLoaded] = useState(false);
// Add this scroll optimization configuration
const optimizeScroll = {
  renderOnScroll: !prefersReducedMotion && !isMobile,
  scrollConfig: {
    damping: 25, // More damping = smoother but slower response
    mass: 1,
    stiffness: 120,
    restDelta: 0.001,
    restSpeed: 0.001,
  }
};

// Then modify your existing scroll hooks to use these optimized settings


// Same for other scroll progress hooks...

// Optimize your useSpring configurations 

  // Materials data
  const [allMaterials] = useState<AllMaterials>({
    woods: [
      {
        id: 'sucupira',
        name: language === 'pt' ? 'Sucupira' : 'Sucupira',
        type: language === 'pt' ? 'Madeira Nacional' : 'Madera Nacional',
        origin: language === 'pt' ? 'América do Sul' : 'América del Sur',
        color: '#5A4233',
        roughness: 0.75,
        metalness: 0.0,
        durability: 4.5,
        maintenance: 3.5,
        sustainability: 3,
        applications: [
          { pt: 'Pisos nobres', en: 'Fine flooring' },
          { pt: 'Móveis de luxo', en: 'Luxury furniture' },
          { pt: 'Escadas', en: 'Staircases' }
        ],
        description: {
          pt: 'Madeira densa e escura, com alta resistência mecânica. Seus tons variam do marrom-chocolate ao quase preto, com veios sutis. Ideal para móveis que exigem resistência e beleza duradoura.',
          es: 'Madera densa y oscura, con alta resistencia mecánica. Sus tonos varían del marrón chocolate al casi negro, con vetas sutiles. Ideal para muebles que exigen resistencia y belleza duradera.'
        }
      },
      {
        id: 'pau-ferro',
        name: language === 'pt' ? 'Pau Ferro' : 'Palo de Hierro',
        type: language === 'pt' ? 'Madeira Nacional' : 'Madera Nacional',
        origin: language === 'pt' ? 'Brasil' : 'Brasil',
        color: '#4A2C1B',
        roughness: 0.8,
        metalness: 0.0,
        durability: 5,
        maintenance: 4,
        sustainability: 3,
        applications: [
          { pt: 'Tampos de mesa', en: 'Tabletops' },
          { pt: 'Instrumentos musicais', en: 'Musical instruments' },
          { pt: 'Móveis de alto padrão', en: 'High-end furniture' }
        ],
        description: {
          pt: 'Uma das madeiras mais densas do mundo, com coloração marrom-avermelhada profunda e veios dramáticos. Extremamente durável e resistente a impactos, cria móveis com aparência inconfundível.',
          es: 'Una de las maderas más densas del mundo, con coloración marrón-rojiza profunda y vetas dramáticas. Extremadamente duradera y resistente a impactos, crea muebles con apariencia inconfundible.'
        }
      }
    ],
    fabrics: [
      {
        id: 'linho-belga',
        name: language === 'pt' ? 'Linho Belga' : 'Lino Belga',
        type: language === 'pt' ? 'Tecido Natural' : 'Tejido Natural',
        origin: language === 'pt' ? 'Bélgica' : 'Bélgica',
        color: '#E3DDD3',
        roughness: 0.9,
        metalness: 0.0,
        durability: 4,
        maintenance: 3,
        sustainability: 5,
        applications: [
          { pt: 'Estofados', en: 'Upholstery' },
          { pt: 'Almofadas', en: 'Pillows' },
          { pt: 'Revestimentos', en: 'Coverings' }
        ],
        description: {
          pt: 'Tecido natural de alta qualidade com textura distintiva e toque fresco. Respirável e altamente durável, o linho belga é conhecido por desenvolver um caráter único com o tempo de uso.',
          es: 'Tejido natural de alta calidad con textura distintiva y tacto fresco. Transpirable y altamente duradero, el lino belga es conocido por desarrollar un carácter único con el tiempo de uso.'
        }
      },
      {
        id: 'veludo-italiano',
        name: language === 'pt' ? 'Veludo Italiano' : 'Terciopelo Italiano',
        type: language === 'pt' ? 'Tecido Premium' : 'Tejido Premium',
        origin: language === 'pt' ? 'Itália' : 'Italia',
        color: '#60383B',
        roughness: 0.2,
        metalness: 0.0,
        durability: 3.5,
        maintenance: 4,
        sustainability: 3,
        applications: [
          { pt: 'Poltronas', en: 'Armchairs' },
          { pt: 'Sofás', en: 'Sofas' },
          { pt: 'Cabeceiras', en: 'Headboards' }
        ],
        description: {
          pt: 'Veludo de alta densidade com toque macio e reflexos luminosos. Sua textura luxuosa adiciona profundidade e sofisticação aos ambientes, sendo perfeito para peças de destaque.',
          es: 'Terciopelo de alta densidad con tacto suave y reflejos luminosos. Su textura lujosa añade profundidad y sofisticación a los ambientes, siendo perfecto para piezas destacadas.'
        }
      }
    ],
    metals: [
      {
        id: 'bronze-envelhecido',
        name: language === 'pt' ? 'Bronze Envelhecido' : 'Bronce Envejecido',
        type: language === 'pt' ? 'Metal Nobre' : 'Metal Noble',
        origin: language === 'pt' ? 'Produção Local' : 'Producción Local',
        color: '#966F42',
        roughness: 0.1,
        metalness: 0.8,
        durability: 5,
        maintenance: 2.5,
        sustainability: 4,
        applications: [
          { pt: 'Puxadores', en: 'Handles' },
          { pt: 'Pés de móveis', en: 'Furniture legs' },
          { pt: 'Detalhes decorativos', en: 'Decorative details' }
        ],
        description: {
          pt: 'Liga metálica com acabamento artesanal que confere personalidade e sofisticação aos detalhes do mobiliário. Desenvolve uma pátina natural que enriquece sua aparência ao longo do tempo.',
          es: 'Aleación metálica con acabado artesanal que confiere personalidad y sofisticación a los detalles del mobiliario. Desarrolla una pátina natural que enriquece su apariencia a lo largo del tiempo.'
        }
      },
      {
        id: 'latao-polido',
        name: language === 'pt' ? 'Latão Polido' : 'Latón Pulido',
        type: language === 'pt' ? 'Metal Nobre' : 'Metal Noble',
        origin: language === 'pt' ? 'Produção Local' : 'Producción Local',
        color: '#D4AF37',
        roughness: 0.1,
        metalness: 0.9,
        durability: 4.5,
        maintenance: 3,
        sustainability: 4,
        applications: [
          { pt: 'Bases de mesa', en: 'Table bases' },
          { pt: 'Ferragens decorativas', en: 'Decorative hardware' },
          { pt: 'Acessórios', en: 'Accessories' }
        ],
        description: {
          pt: 'Metal dourado com brilho sofisticado que adiciona um toque de luxo aos móveis. Sua tonalidade quente combina harmoniosamente com madeiras escuras e mármores.',
          es: 'Metal dorado con brillo sofisticado que añade un toque de lujo a los muebles. Su tonalidad cálida combina armoniosamente con maderas oscuras y mármoles.'
        }
      }
    ],
    stones: [
      {
        id: 'marmore-carrara',
        name: language === 'pt' ? 'Mármore Carrara' : 'Mármol Carrara',
        type: language === 'pt' ? 'Pedra Natural' : 'Piedra Natural',
        origin: language === 'pt' ? 'Itália' : 'Italia',
        color: '#E9E9E6',
        roughness: 0.2,
        metalness: 0.1,
        durability: 4,
        maintenance: 4.5,
        sustainability: 3,
        applications: [
          { pt: 'Tampos de mesa', en: 'Tabletops' },
          { pt: 'Bancadas', en: 'Countertops' },
          { pt: 'Mesas laterais', en: 'Side tables' }
        ],
        description: {
          pt: 'Mármore italiano de primeira qualidade, com fundo branco e veios cinza sutis. Cada peça é única, com padrões naturais irreproduzíveis que conferem exclusividade ao mobiliário.',
          es: 'Mármol italiano de primera calidad, con fondo blanco y vetas grises sutiles. Cada pieza es única, con patrones naturales irrepetibles que confieren exclusividad al mobiliario.'
        }
      },
      {
        id: 'granito-preto',
        name: language === 'pt' ? 'Granito Preto Absoluto' : 'Granito Negro Absoluto',
        type: language === 'pt' ? 'Pedra Natural' : 'Piedra Natural',
        origin: language === 'pt' ? 'Brasil/Índia' : 'Brasil/India',
        color: '#1D1D1D',
        roughness: 0.3,
        metalness: 0.2,
        durability: 5,
        maintenance: 4.5,
        sustainability: 3,
        applications: [
          { pt: 'Tampos de mesa', en: 'Tabletops' },
          { pt: 'Bancadas', en: 'Countertops' },
          { pt: 'Revestimentos', en: 'Wall cladding' }
        ],
        description: {
          pt: 'Granito de cor preta profunda e uniforme, com alta densidade e resistência excepcional a manchas e arranhões. Sua sobriedade cria um contraste elegante com elementos mais claros.',
          es: 'Granito de color negro profundo y uniforme, con alta densidad y resistencia excepcional a manchas y arañazos. Su sobriedad crea un contraste elegante con elementos más claros.'
        }
      }
    ]
  });

  // State for material showcase
  const [activeMaterial, setActiveMaterial] = useState<Material | null>(null);
  const [activeCategory, setActiveCategory] = useState(0);
  const [currentFurniture, setCurrentFurniture] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [furnitureLabels] = useState([
    { pt: 'Mesa', en: 'Table' },
    { pt: 'Cadeira', en: 'Chair' },
    { pt: 'Armário', en: 'Cabinet' },
    { pt: 'Estante', en: 'Shelf' },
    { pt: 'Bancada', en: 'Counter' }
  ]);

  // State for process steps
  const [activeProcessStep, setActiveProcessStep] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  interface Material {
    id: string;
    name: string;
    color: string;
    roughness: number;
    metalness: number;
    furniture?: string; // Add furniture property
    properties?: string; // Added the optional 'properties' field
    sustainability?: number; // Add the 'sustainability' property
    durability?: number; // Add the 'durability' property
    maitenance?: number; // Add the 'maintenance' property
    
  }

  const EnhancedMaterialShowcase = ({ material, currentFurniture }: { material: Material, currentFurniture: number }) => {
    const meshRef = useRef<THREE.Mesh<THREE.BufferGeometry, THREE.Material> | null>(null);

    const renderFurnitureModel = () => {
      switch (currentFurniture) {
        case 0:
          return (
            <group>
              <mesh castShadow receiveShadow position={[0, 0, 0]}>
                <boxGeometry args={[3, 0.1, 1.5]} />
                <meshPhysicalMaterial {...getMaterialProps()} />
              </mesh>
              <mesh castShadow position={[-1.2, -0.75, 0]} rotation={[0, 0, 0]}>
                <cylinderGeometry args={[0.05, 0.05, 1.6]} />
                <meshStandardMaterial color="#5A3A22" />
              </mesh>
              <mesh castShadow position={[1.2, -0.75, 0]} rotation={[0, 0, 0]}>
                <cylinderGeometry args={[0.05, 0.05, 1.6]} />
                <meshStandardMaterial color="#5A3A22" />
              </mesh>
            </group>
          );

        case 1:
          return (
            <group>
              <mesh position={[0, -0.3, 0]} castShadow receiveShadow>
                <boxGeometry args={[0.5, 0.05, 0.5]} />
                <meshPhysicalMaterial {...getMaterialProps()} />
              </mesh>
              <mesh position={[0, 0.2, -0.25]} castShadow receiveShadow>
                <boxGeometry args={[0.5, 1, 0.05]} />
                <meshPhysicalMaterial {...getMaterialProps()} />
              </mesh>
              <mesh position={[-0.225, -0.8, 0.225]} castShadow receiveShadow>
                <cylinderGeometry args={[0.03, 0.03, 1]} />
                <meshStandardMaterial color="#5A3A22" />
              </mesh>
              <mesh position={[0.225, -0.8, 0.225]} castShadow receiveShadow>
                <cylinderGeometry args={[0.03, 0.03, 1]} />
                <meshStandardMaterial color="#5A3A22" />
              </mesh>
              <mesh position={[-0.225, -0.8, -0.225]} castShadow receiveShadow>
                <cylinderGeometry args={[0.03, 0.03, 1]} />
                <meshStandardMaterial color="#5A3A22" />
              </mesh>
              <mesh position={[0.225, -0.8, -0.225]} castShadow receiveShadow>
                <cylinderGeometry args={[0.03, 0.03, 1]} />
                <meshStandardMaterial color="#5A3A22" />
              </mesh>
            </group>
          );

        case 2:
          return (
            <group>
              <mesh position={[0, 0, 0]} castShadow receiveShadow>
                <boxGeometry args={[1.5, 1, 0.5]} />
                <meshPhysicalMaterial {...getMaterialProps()} />
              </mesh>
              <mesh position={[-0.37, 0, 0.26]} castShadow receiveShadow>
                <boxGeometry args={[0.7, 0.7, 0.02]} />
                <meshPhysicalMaterial {...getMaterialProps(0.9)} />
              </mesh>
              <mesh position={[0.37, 0, 0.26]} castShadow receiveShadow>
                <boxGeometry args={[0.7, 0.7, 0.02]} />
                <meshPhysicalMaterial {...getMaterialProps(0.9)} />
              </mesh>
              <mesh position={[-0.7, 0, 0.27]} castShadow receiveShadow rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.02, 0.02, 0.06, 8]} />
                <meshStandardMaterial color="#D4AF37" metalness={0.8} roughness={0.2} />
              </mesh>
              <mesh position={[0.7, 0, 0.27]} castShadow receiveShadow rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.02, 0.02, 0.06, 8]} />
                <meshStandardMaterial color="#D4AF37" metalness={0.8} roughness={0.2} />
              </mesh>
            </group>
          );

        case 3:
          return (
            <group>
              <mesh position={[0, 0, 0]} castShadow receiveShadow>
                <boxGeometry args={[2, 0.5, 0.8]} />
                <meshPhysicalMaterial {...getMaterialProps()} />
              </mesh>
              <mesh position={[0, 0.5, -0.35]} castShadow receiveShadow>
                <boxGeometry args={[2, 0.5, 0.1]} />
                <meshPhysicalMaterial {...getMaterialProps()} />
              </mesh>
              <mesh position={[-0.9, 0.5, 0]} castShadow receiveShadow>
                <boxGeometry args={[0.2, 0.5, 0.8]} />
                <meshPhysicalMaterial {...getMaterialProps()} />
              </mesh>
              <mesh position={[0.9, 0.5, 0]} castShadow receiveShadow>
                <boxGeometry args={[0.2, 0.5, 0.8]} />
                <meshPhysicalMaterial {...getMaterialProps()} />
              </mesh>
              <mesh position={[0, 0.3, 0.15]} castShadow receiveShadow>
                <boxGeometry args={[1.6, 0.1, 0.5]} />
                <meshPhysicalMaterial {...getMaterialProps(0.5)} />
              </mesh>
            </group>
          );

        case 4:
          return (
            <group>
              <mesh position={[0, 0, 0]} castShadow receiveShadow>
                <boxGeometry args={[3, 0.05, 0.8]} />
                <meshPhysicalMaterial {...getMaterialProps()} />
              </mesh>
              <mesh position={[0, -0.5, -0.2]} castShadow receiveShadow>
                <boxGeometry args={[2.8, 1, 0.4]} />
                <meshStandardMaterial color="#564A41" />
              </mesh>
              <mesh position={[0, -0.25, 0.25]} castShadow receiveShadow>
                <cylinderGeometry args={[0.15, 0.15, 0.2, 16]} />
                <meshStandardMaterial color="#CCCCCC" metalness={0.5} roughness={0.2} />
              </mesh>
            </group>
          );

        default:
          return (
            <mesh castShadow receiveShadow ref={meshRef}>
              <sphereGeometry args={[1, 64, 64]} />
              <meshPhysicalMaterial {...getMaterialProps()} />
            </mesh>
          );
      }
    };

    const getMaterialProps = (roughnessMultiplier = 1) => ({
      metalness: material.metalness || 0.2,
      roughness: (material.roughness || 0.3) * roughnessMultiplier,
      clearcoat: material.id.includes('marmore') || material.id.includes('vidro') ? 0.5 : 0.1,
      clearcoatRoughness: 0.2,
      envMapIntensity: material.metalness > 0.5 ? 2 : 1,
      normalScale: material.id.includes('madeira') ? new Vector2(0.3, 0.3) : new Vector2(0.1, 0.1)
    });

    return (
      <group ref={meshRef as any}>
        {renderFurnitureModel()}
      </group>
    );
  };

  // View tracking for premium transitions
  // View tracking for premium transitions
  const [isInView, setIsInView] = useState({
    hero: true,
    gallery: false,
    about: false,
    process: false,
    contact: false
  });

 // Add this to where you initialize Lenis
interface LenisOptions {
  duration?: number;
  easing?: (t: number) => number;
  orientation?: 'vertical' | 'horizontal';
  smoothWheel?: boolean;
  wheelMultiplier?: number;
  smoothTouch?: boolean;
  lerp?: number;
  touchMultiplier?: number;
  syncTouch?: boolean;
  infinite?: boolean;
}
// Update your Lenis options with these optimized settings
const lenisOptions = {
  duration: 0.8,           // Reduced from 1.2 for faster response with mouse wheel
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: 'vertical',
  smoothWheel: true,
  wheelMultiplier: 1.2,    // Increased from 0.6 for better mouse wheel responsiveness
  smoothTouch: false,      
  lerp: 0.025,             // Reduced to make mouse wheel feel more direct
  touchMultiplier: 1.5,
  syncTouch: true,
  infinite: false,
  gestureOrientation: 'vertical',
  normalizeWheel: true,    // Added to normalize wheel input across devices
  wheelEventsTarget: window, // For better wheel event consistency
};

// Initialize Lenis with the updated options
const lenis = useLenis(
  ({ scroll }) => {
    // Optional callback
  },
  [] // Dependencies for the callback; empty if none. Options are set via <ReactLenis>.
);

  // Advanced scroll tracking for sophisticated parallax effects
  const { scrollY } = useScroll();
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const { scrollYProgress: galleryProgress } = useScroll({
    target: galleryRef,
    offset: ["start end", "end start"]
  });

  const { scrollYProgress: aboutProgress } = useScroll({
    target: aboutRef,
    offset: ["start end", "end start"]
  });

  const { scrollYProgress: processScrollProgress } = useScroll({
    target: processRef,
    offset: ["start end", "end start"]
  });
  // Testimonials data
  const testimonials = [
    {
      quote: {
        pt: "A Afetto transformou completamente nossa sala de estar, criando um espaço que é ao mesmo tempo elegante e acolhedor. Cada detalhe foi pensado cuidadosamente, resultando em uma atmosfera que realmente reflete nossa personalidade.",
        es: "Afetto transformó completamente nuestra sala de estar, creando un espacio que es a la vez elegante y acogedor. Cada detalle fue cuidadosamente pensado, resultando en una atmósfera que realmente refleja nuestra personalidad."
      },
      name: "Carolina Mendes",
      title: "São Paulo, Brasil",
      image: "/images/testimonials/client-1.jpg"
    },
    {
      quote: {
        pt: "O processo de trabalho com a equipe da Afetto foi extraordinário. Sua atenção aos detalhes e compromisso com a excelência são incomparáveis. As peças personalizadas que criaram para nosso escritório são verdadeiras obras de arte.",
        es: "El proceso de trabajo con el equipo de Afetto fue extraordinario. Su atención al detalle y compromiso con la excelencia son incomparables. Las piezas personalizadas que crearon para nuestra oficina son verdaderas obras de arte."
      },
      name: "Rafael Oliveira",
      title: "Rio de Janeiro, Brasil",
      image: "/images/testimonials/client-2.jpg"
    },
    {
      quote: {
        pt: "Procurávamos algo único que refletisse nossa paixão por design e funcionalidade. A Afetto entendeu perfeitamente nossa visão e a transformou em realidade, superando todas as nossas expectativas.",
        es: "Buscábamos algo único que reflejara nuestra pasión por el diseño y la funcionalidad. Afetto entendió perfectamente nuestra visión y la transformó en realidad, superando todas nuestras expectativas."
      },
      name: "Maria e Pedro Santos",
      title: "Porto Alegre, Brasil",
      image: "/images/testimonials/client-3.jpg"
    },
    {
      quote: {
        pt: "Trabalhar com a Afetto foi uma experiência transformadora. Eles não apenas criaram móveis incríveis, mas também nos guiaram através de todo o processo de design, garantindo que cada escolha fosse perfeita para nosso espaço.",
        es: "Trabajar con Afetto fue una experiencia transformadora. No solo crearon muebles increíbles, sino que también nos guiaron a través de todo el proceso de diseño, asegurando que cada elección fuera perfecta para nuestro espacio."
      },
      name: "Fernanda Lima",
      title: "Brasília, Brasil",
      image: "/images/testimonials/client-4.jpg"
    }
  ];
  // Ultra-smooth motion values with custom physics
  const smoothHeroProgress = useSpring(heroScrollProgress, {
    ...slowSpring,
    restDelta: 0.001
  });

  const smoothGalleryProgress = useSpring(galleryProgress, {
    ...slowSpring,
    restDelta: 0.001
  });

  const smoothAboutProgress = useSpring(aboutProgress, {
    ...slowSpring,
    restDelta: 0.001
  });

  const smoothProcessProgress = useSpring(processScrollProgress, {
    ...fastSpring,
    restDelta: 0.001
  });

  // Advanced parallax and visual transformations
  const heroOpacity = useTransform(smoothHeroProgress, [0, 0.8], [1, 0]);
  const heroY = useTransform(smoothHeroProgress, [0, 1], [0, 200]);
  const heroScale = useTransform(smoothHeroProgress, [0, 0.5], [1, 0.97]);
  const heroTitleY = useParallax(smoothHeroProgress, -100);
  const heroSubtitleY = useParallax(smoothHeroProgress, -60);
  const heroProgressHeight = useTransform(smoothHeroProgress, [0, 1], ["0%", "100%"]);
  const processLineProgress = useTransform(processScrollProgress, [0, 0.3], [0, 1]);

  // Advanced color transitions based on scroll
  const processLineColor = useTransform(
    processScrollProgress,
    [0, 0.3, 0.6, 0.9],
    ["rgba(211, 161, 126, 0.3)", "rgba(211, 161, 126, 0.5)", "rgba(211, 161, 126, 0.7)", "rgba(211, 161, 126, 0.9)"]
  );

  // Detect scroll direction for advanced interaction cues
  useMotionValueEvent(scrollY, "change", (latest) => {
    const direction = latest > lastScrollY ? 'down' : 'up';
    if (direction !== scrollDirection) {
      setScrollDirection(direction);
    }
    setLastScrollY(latest);
  });

  // Advanced mouse tracking for parallax effects
  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!hasInteracted) setHasInteracted(true);

      setCursorPosition({
        x: e.clientX,
        y: e.clientY
      });

      // Calculate mouse position relative to window center (-1 to 1)
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [hasInteracted, prefersReducedMotion]);

  // Project hover state management with smooth transitions
  const handleProjectHover = useCallback((index: number | null) => {
    setActiveProject(index);
    setCursorVariant(index !== null ? "project" : "default");
  }, []);

  // Dynamic cursor behavior
  const handleLinkHover = useCallback((enter: boolean) => {
    setCursorVariant(enter ? "link" : "default");
  }, []);

  const handleCtaHover = useCallback((enter: boolean) => {
    setCursorVariant(enter ? "cta" : "default");
  }, []);

  const handleDragHover = useCallback((enter: boolean) => {
    setCursorVariant(enter ? "drag" : "default");
  }, []);

  // Add this right after your Lenis initialization
useEffect(() => {
  if (!lenis) return;
  
  // Add a throttled wheel event handler for smoother mouse wheel scrolling
  const wheelHandler = (event: WheelEvent) => {
    // Normalize delta values for more consistent scrolling
    const delta = Math.abs(event.deltaY) > 100 ? 
      event.deltaY / (Math.abs(event.deltaY) / 40) : 
      event.deltaY;
      
    lenis.raf(Date.now()); // Force a lenis update
    event.preventDefault();
  };

  // Add the throttled wheel event handler
  const wheelEvents = ['wheel'];
  wheelEvents.forEach(event => {
    window.addEventListener('wheel', wheelHandler as (event: Event) => void, { passive: false });
  });

  return () => {
    wheelEvents.forEach(event => {
      window.removeEventListener(event, wheelHandler as EventListener);
    });
  };
}, [lenis]);
  // Monitor process steps for transitions
  useEffect(() => {
    const checkProcessStep = () => {
      if (!processRef.current) return;

      const { top } = processRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const scrollPosition = window.scrollY;

      // Calculate which step should be active based on scroll position
      const processStep = Math.floor(((scrollPosition + viewportHeight - top) / viewportHeight) * 3);
      if (processStep >= 0 && processStep <= 3 && processStep !== activeProcessStep) {
        setActiveProcessStep(processStep);
      }
    };

    window.addEventListener('scroll', checkProcessStep);
    return () => window.removeEventListener('scroll', checkProcessStep);
  }, [activeProcessStep]);

  // Sophisticated animation variants
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
        ease: [0.22, 1, 0.36, 1],
      }
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.2,
        ease: [0.22, 1, 0.36, 1],
      }
    }
  };

  const slideInRight = {
    hidden: { opacity: 0, x: -40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 1.2,
        ease: [0.22, 1, 0.36, 1],
      }
    }
  };

  const revealInOut = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1.4,
        ease: [0.22, 1, 0.36, 1],
      }
    }
  };

  const lineGrow = {
    hidden: { scaleX: 0 },
    visible: {
      scaleX: 1,
      transition: {
        duration: 1.2,
        ease: [0.22, 1, 0.36, 1],
      }
    }
  };

  // Handle video loading with fallbacks
  const handleVideoLoaded = () => {
    setVideoLoaded(true);
  };

  return (
    <motion.div
      ref={mainScrollRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      className="relative font-serif bg-gradient-to-br from-[#181617] via-[#23201C] to-[#1a1713] min-h-screen"
    >
      {/* Premium Custom Cursor with smoother transitions */}
      <AnimatePresence>
        {!isMobile && !prefersReducedMotion && (
          <motion.div
            ref={cursorRef}
            className="fixed z-[100] pointer-events-none hidden md:flex items-center justify-center overflow-hidden"
            variants={{
              default: {
                mixBlendMode: "difference",
                height: 24,
                width: 24,
                backgroundColor: "rgba(255, 255, 255, 0)",
                border: "1px solid rgba(255, 255, 255, 0.8)",
                x: cursorPosition.x - 12,
                y: cursorPosition.y - 12,
                borderRadius: "50%",
                transition: { duration: 0.3 },
              },
              project: {
                mixBlendMode: "normal",
                height: 120,
                width: 120,
                backgroundColor: "rgba(var(--color-accent-rgb), 0.05)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(var(--color-accent-rgb), 0.3)",
                x: cursorPosition.x - 60,
                y: cursorPosition.y - 60,
                borderRadius: "50%",
                transition: { duration: 0.3 },
              },
              link: {
                mixBlendMode: "difference",
                height: 64,
                width: 64,
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.8)",
                x: cursorPosition.x - 32,
                y: cursorPosition.y - 32,
                borderRadius: "50%",
                transition: { duration: 0.3 },
              },
              cta: {
                mixBlendMode: "normal",
                height: 120,
                width: 120,
                background: "radial-gradient(circle, rgba(var(--color-accent-rgb), 0.15) 0%, transparent 70%)",
                backdropFilter: "blur(4px)",
                border: "1px solid rgba(var(--color-accent-rgb), 0.5)",
                x: cursorPosition.x - 60,
                y: cursorPosition.y - 60,
                borderRadius: "50%",
                transition: { duration: 0.3 },
              },
            }}
            initial="default"
            animate={cursorVariant}
            transition={{
              type: "spring",
              ...fastSpring,
            }}
          >
            {cursorVariant === "project" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full w-full flex flex-col items-center justify-center relative"
              >
                <canvas
                  className="absolute inset-0 opacity-30 mix-blend-overlay"
                  width="120"
                  height="120"
                  style={{ display: hasInteracted ? "block" : "none" }}
                />
                <motion.span
                  className="text-neutral-900 text-xs font-light tracking-[0.2em] uppercase mb-1"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {language === "pt" ? "Explorar" : "Explore"}
                </motion.span>
                <motion.div
                  className="w-7 h-7 flex items-center justify-center border border-accent/40 rounded-full bg-white/5 backdrop-blur-sm"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Plus size={12} className="text-accent" />
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Header Navigation */}
      <motion.header
        className="fixed top-0 left-0 right-0 h-[90px] z-50 flex items-center px-8 transition-all duration-500"
        initial={{ y: -100 }}
        animate={{
          y: 0,
          backgroundColor: lastScrollY > 40 ? "rgba(18, 18, 20, 0.85)" : "transparent",
          backdropFilter: lastScrollY > 40 ? "blur(20px)" : "none",
          boxShadow: lastScrollY > 40 ? "0 10px 30px -10px rgba(0,0,0,0.3)" : "none",
          borderBottom: lastScrollY > 40 ? "1px solid rgba(var(--color-accent-rgb), 0.15)" : "none",
        }}
        style={{
          transform: scrollDirection === "up" || lastScrollY < 100 ? "translateY(0)" : "translateY(-100%)",
        }}
        transition={{
          duration: 0.4,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo with hover animation */}
          <Link to="/" className="text-white flex items-center group relative z-10">
            <motion.div
              initial={{ filter: "drop-shadow(0 0 0 rgba(211, 161, 126, 0))" }}
              whileHover={{ filter: "drop-shadow(0 0 8px rgba(211, 161, 126, 0.6))" }}
              transition={{ duration: 0.5 }}
              className="relative overflow-hidden flex items-center"
            >
              <motion.svg
                width="120"
                height="24"
                viewBox="0 0 120 24"
                className="text-white group-hover:text-accent transition-colors duration-500"
                initial={{ opacity: 0.9 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
              >
                <path
                  d="M10 4L18 12L10 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <motion.path
                  d="M30 6H50"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: 0.2 }}
                />
              </motion.svg>
              <motion.span
                className="ml-3 font-serif tracking-wider text-lg group-hover:text-accent transition-colors duration-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                afetto
              </motion.span>
            </motion.div>
          </Link>

          {/* Premium CTA Button with layered effects */}
          <Link
            to="/agendar"
            className="hidden md:flex items-center text-white border border-white/20 px-5 py-2.5 transition-all duration-500 group relative overflow-hidden rounded-sm"
            onMouseEnter={() => handleCtaHover(true)}
            onMouseLeave={() => handleCtaHover(false)}
          >
            <span className="relative z-10 font-light tracking-wider">
              {language === "pt" ? "Agendar Visita" : "Book a Visit"}
            </span>
            {/* Multi-layered hover effects */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-accent/50 to-accent/30 z-0 opacity-0"
              initial={{ x: "-100%" }}
              whileHover={{ x: "0%", opacity: 1 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            />
          </Link>
        </div>
      </motion.header>
      <motion.section
  ref={heroRef}
  className="relative h-[100vh] min-h-[800px] overflow-hidden"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  style={{ opacity: heroOpacity, y: heroY, scale: heroScale }}
>
  {/* ErrorBoundary with enhanced fallback */}
  <ErrorBoundary fallback={
    <div className="absolute inset-0 bg-gradient-to-r from-[#0A0806]/95 via-[#171412]/80 to-[#0B0905]/90 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5 }}
        className="relative"
      >
        <div className="absolute -inset-20 bg-accent/5 blur-[80px] rounded-full"></div>
        <div className="text-white/80 font-serif text-5xl relative">Objetos com significado</div>
      </motion.div>
    </div>
  }>
  </ErrorBoundary>
  
  {/* Enhanced cinematic multi-layered background system */}
  <div className="absolute inset-0 z-0">
    <motion.div
      className="absolute inset-0 transform-gpu"
      initial={{ scale: 1.05, filter: 'brightness(0.6) contrast(1.1)' }}
      animate={{
        scale: 1,
        filter: 'brightness(0.85) contrast(1.2)',
        transition: { duration: 6, ease: [0.22, 1, 0.36, 1] }
      }}
    >
      {/* Premium video treatment with optimized loading and advanced filters */}
      <div className="absolute inset-0 bg-[#0A0806] z-0"></div>
      <motion.div
        className="absolute inset-0 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onLoadedData={handleVideoLoaded}
          className="w-full h-full object-cover"
          style={{ 
            filter: `saturate(${useTransform(heroScrollProgress, [0, 0.6], [1, 1.5]).get()}) contrast(${useTransform(heroScrollProgress, [0, 0.6], [1, 1.1]).get()})`,
            willChange: "filter"
          }}
        >
          <source src="/videos/luxury-atelier.webm" type="video/webm" />
          <source src="/videos/luxury-atelier.mp4" type="video/mp4" />
        </video>
      </motion.div>

      {/* Advanced cinematographic color grading system */}
      <div className="absolute inset-0 z-20">
        {/* Primary atmospheric gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0806]/95 via-[#171412]/70 to-[#0B0905]/90"></div>
        
        {/* Secondary depth gradient for dimension */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 0%, rgba(5,3,2,0.9) 90%)',
            opacity: useTransform(heroScrollProgress, [0, 0.3], [0.7, 0.95])
          }}
        />
        
        {/* Vignette effect with responsive intensity */}
        <motion.div
          className="absolute inset-0 opacity-80"
          style={{
            background: 'radial-gradient(circle at 50% 80%, transparent 20%, rgba(0,0,0,0.8) 100%)',
            opacity: useTransform(heroScrollProgress, [0, 0.6], [0.6, 0.9])
          }}
        />

        {/* Dynamic texture overlay with parallax effect */}
        <motion.div
          className="absolute inset-0 opacity-[0.16] mix-blend-overlay"
          style={{ 
            backgroundImage: 'url(/images/noise-texture.png)', 
            backgroundSize: '300px',
            y: useTransform(heroScrollProgress, [0, 1], [0, -10])
          }}
          animate={!prefersReducedMotion ? { 
            backgroundPosition: ['0% 0%', '100% 100%'] 
          } : {}}
          transition={{ 
            duration: 180, 
            ease: "linear", 
            repeat: Infinity, 
            repeatType: "mirror" 
          }}
        />
        
        {/* Film grain texture for cinematic look */}
        <div 
          className="absolute inset-0 opacity-[0.03] mix-blend-overlay" 
          style={{ backgroundImage: 'url(/images/film-grain.png)' }}
        ></div>
      </div>

      {/* Advanced cinematic lighting system */}
      <div className="absolute inset-0 z-20 overflow-hidden">
        {/* Volumetric light ray */}
        <motion.div
          className="absolute top-0 right-[30%] w-[500px] h-[130vh] opacity-20 mix-blend-screen"
          initial={{ opacity: 0, scale: 0.8, rotateZ: 15 }}
          animate={{ opacity: !prefersReducedMotion ? [0.15, 0.25, 0.15] : 0.2, scale: 1, rotateZ: 15 }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "mirror" }}
          style={{
            background: 'linear-gradient(to bottom, rgba(211,161,126,0), rgba(211,161,126,0.5), rgba(255,255,255,0.1), rgba(211,161,126,0))',
            filter: 'blur(80px)',
            willChange: "opacity"
          }}
        />
        
        {/* Ambient light glow */}
        <motion.div
          className="absolute top-[20%] left-[15%] w-[600px] h-[600px] rounded-full opacity-10 mix-blend-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: !prefersReducedMotion ? [0.1, 0.16, 0.1] : 0.13 }}
          transition={{ duration: 8, repeat: Infinity, repeatType: "mirror" }}
          style={{
            background: 'radial-gradient(circle, rgba(211,161,126,0.7), transparent 70%)',
            filter: 'blur(100px)',
            willChange: "opacity"
          }}
        />
      </div>

      {/* Enhanced particle system with advanced motion physics */}
      {!prefersReducedMotion && !isMobile && (
        <motion.div className="absolute inset-0 z-30 overflow-hidden">
          {/* Primary golden dust particles */}
          {Array(20).fill(0).map((_, i) => (
            <motion.div
              key={`hero-particle-${i}`}
              className="absolute rounded-full"
              initial={{
                x: `${Math.random() * 100}%`,
                y: `${Math.random() * 100}%`,
                opacity: 0,
                scale: 0
              }}
              animate={{
                opacity: [0, 0.4 * (Math.random() * 0.5 + 0.5), 0],
                scale: [0, Math.random() * 0.5 + 0.5, 0],
                filter: [
                  'blur(3px) brightness(1)',
                  'blur(2px) brightness(1.8)',
                  'blur(3px) brightness(1)'
                ],
              }}
              transition={{
                duration: 8 + Math.random() * 15,
                ease: "easeInOut",
                repeat: Infinity,
                delay: Math.random() * 10,
              }}
              style={{
                width: `${2 + Math.random() * 6}px`,
                height: `${2 + Math.random() * 6}px`,
                background: 'radial-gradient(circle, rgba(211,161,126,1) 0%, rgba(211,161,126,0) 70%)',
                boxShadow: '0 0 15px 5px rgba(211,161,126,0.3)',
                willChange: "transform, opacity, filter"
              }}
            />
          ))}
          
          {/* Secondary atmosphere particles */}
          {Array(15).fill(0).map((_, i) => (
            <motion.div
              key={`ambient-particle-${i}`}
              className="absolute rounded-full"
              initial={{
                x: `${Math.random() * 100}%`,
                y: `${Math.random() * 100}%`,
                opacity: 0,
                scale: 0
              }}
              animate={{
                opacity: [0, 0.3 * Math.random(), 0],
                scale: [0, Math.random() * 1.5 + 0.5, 0],
                filter: ['blur(8px)', 'blur(12px)', 'blur(8px)'],
              }}
              transition={{
                duration: 15 + Math.random() * 20,
                ease: "easeInOut",
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
              style={{
                width: `${10 + Math.random() * 20}px`,
                height: `${10 + Math.random() * 20}px`,
                background: 'radial-gradient(circle, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 70%)',
                willChange: "transform, opacity"
              }}
            />
          ))}
        </motion.div>
      )}
    </motion.div>
  </div>

  {/* Enhanced architectural grid system with golden ratio */}
  <div className="absolute inset-0 z-10 opacity-[0.04] pointer-events-none">
    <div className="grid grid-cols-12 h-full w-full">
      {Array(12).fill(0).map((_, i) => (
        <div key={`grid-col-${i}`} className="h-full border-l border-white/50 last:border-r"></div>
      ))}
      <div className="absolute top-[38.2%] left-0 right-0 h-[1px] bg-white/30"></div>
      <div className="absolute top-[61.8%] left-0 right-0 h-[1px] bg-white/30"></div>
      <div className="absolute top-[23.6%] left-0 right-0 h-[0.5px] bg-white/20"></div>
      <div className="absolute top-[76.4%] left-0 right-0 h-[0.5px] bg-white/20"></div>
      <div className="absolute bottom-0 top-0 left-[38.2%] w-[1px] bg-white/30"></div>
      <div className="absolute bottom-0 top-0 left-[61.8%] w-[1px] bg-white/30"></div>
    </div>
  </div>

  {/* Advanced decorative geometric elements with sophisticated animation */}
  <motion.div
    className="absolute top-[15%] right-[12%] rounded-full opacity-0 hidden lg:block z-10"
    initial={{ scale: 0.8, rotate: 45, opacity: 0 }}
    animate={{ scale: 1, rotate: 0, opacity: 0.2 }}
    transition={{ duration: 3, ease: [0.32, 0.75, 0.36, 1] }}
  >
    <motion.div
      className="relative w-[400px] h-[400px]"
      animate={!prefersReducedMotion ? { 
        rotateZ: [0, 360],
      } : {}}
      transition={{ duration: 90, ease: "linear", repeat: Infinity }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <linearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(211,161,126,0.05)" />
            <stop offset="50%" stopColor="rgba(211,161,126,0.12)" />
            <stop offset="100%" stopColor="rgba(211,161,126,0.05)" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="49.5" stroke="url(#circleGradient)" strokeWidth="0.5" fill="none" />
        <circle cx="50" cy="50" r="30" stroke="rgba(211,161,126,0.08)" strokeWidth="0.5" fill="none" />
      </svg>
    </motion.div>
  </motion.div>

  <motion.div
    className="absolute bottom-[25%] left-[8%] rounded-full opacity-0 hidden lg:block z-10"
    initial={{ scale: 0.8, rotate: -45, opacity: 0 }}
    animate={{ scale: 1, rotate: 0, opacity: 0.15 }}
    transition={{ duration: 3, delay: 0.5, ease: [0.32, 0.75, 0.36, 1] }}
  >
    <motion.div 
      className="w-[300px] h-[300px] relative"
      animate={!prefersReducedMotion ? { 
        rotateZ: [0, -360],
      } : {}}
      transition={{ duration: 120, ease: "linear", repeat: Infinity }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <linearGradient id="squareGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(211,161,126,0.1)" />
            <stop offset="50%" stopColor="rgba(211,161,126,0.14)" />
            <stop offset="100%" stopColor="rgba(211,161,126,0.1)" />
          </linearGradient>
        </defs>
        <rect x="10" y="10" width="80" height="80" stroke="url(#squareGradient)" strokeWidth="0.5" fill="none" />
        <rect x="30" y="30" width="40" height="40" stroke="rgba(211,161,126,0.08)" strokeWidth="0.5" fill="none" />
      </svg>
    </motion.div>
  </motion.div>

  {/* Enhanced vertical accent lines with advanced gradient lighting */}
  <div className="absolute top-0 left-[10%] h-full w-[2px] z-20 overflow-hidden">
    <motion.div
      className="h-[40%] w-full"
      initial={{ y: "-100%" }}
      animate={{ y: ["100%", "-100%"] }}
      transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      style={{
        background: "linear-gradient(to bottom, rgba(211,161,126,0), rgba(211,161,126,0.4), rgba(211,161,126,0.7), rgba(211,161,126,0.4), rgba(211,161,126,0))",
        filter: "blur(1px)",
        willChange: "transform"
      }}
    />
  </div>

  <div className="absolute top-0 right-[10%] h-full w-[2px] z-20 overflow-hidden">
    <motion.div
      className="h-[40%] w-full"
      initial={{ y: "0%" }}
      animate={{ y: ["-100%", "100%"] }}
      transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      style={{
        background: "linear-gradient(to bottom, rgba(211,161,126,0), rgba(211,161,126,0.4), rgba(211,161,126,0.7), rgba(211,161,126,0.4), rgba(211,161,126,0))",
        filter: "blur(1px)",
        willChange: "transform"
      }}
    />
  </div>
  
  {/* Advanced horizontal light scan effect */}
  <div className="absolute left-0 right-0 top-[30%] h-[1px] z-20 overflow-hidden">
    <motion.div
      className="w-full h-full"
      initial={{ scaleX: 0, x: "-100%" }}
      animate={{ scaleX: 1, x: "100%" }}
      transition={{ duration: 3, repeat: Infinity, repeatDelay: 7, ease: "easeInOut" }}
      style={{
        background: "linear-gradient(to right, rgba(211,161,126,0), rgba(211,161,126,0.7), rgba(211,161,126,0))",
        filter: "blur(1px)",
        willChange: "transform"
      }}
    />
  </div>

  {/* Enhanced main content with premium 3D layout and animations */}
  <div className="relative z-30 container mx-auto px-8 md:px-24 h-full flex items-center">
    <motion.div
      className="max-w-7xl relative"
      style={{ y: heroTitleY }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3, duration: 1 }}
    >
      {/* Advanced lighting accent */}
      <motion.div
        className="absolute -left-20 -top-20 -z-10 opacity-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.15, 0] }}
        transition={{ duration: 8, repeat: Infinity, repeatType: "mirror" }}
        style={{
          width: "500px",
          height: "500px",
          background: "radial-gradient(ellipse, rgba(211,161,126,0.3), transparent 70%)",
          filter: "blur(80px)",
          willChange: "opacity"
        }}
      />

      {/* Enhanced introductory tag with premium animated underline */}
      <motion.p
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.6, ease: [0.32, 0.75, 0.36, 1] }}
        className="font-sans font-light text-accent tracking-[0.4em] uppercase text-sm mb-10 relative"
      >
        <span className="relative">
          {language === 'pt' ? 'Ateliê de Design & Artesanato' : 'Atelier de Diseño & Artesanía'}
          <motion.div className="absolute -bottom-3 left-0 w-full h-[1px] overflow-hidden">
            <motion.div
              className="w-full h-full bg-accent/60"
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              transition={{ duration: 1.2, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.div 
              className="absolute top-0 left-0 w-full h-full"
              animate={{
                background: [
                  "linear-gradient(90deg, transparent 0%, rgba(211,161,126,0.8) 50%, transparent 100%)",
                  "linear-gradient(90deg, transparent 100%, rgba(211,161,126,0.8) 150%, transparent 200%)"
                ],
                x: ["-100%", "100%"]
              }}
              transition={{ duration: 3, delay: 2, repeat: Infinity, repeatDelay: 5 }}
            />
          </motion.div>
        </span>
      </motion.p>

      {/* Premium main title with cinematic reveal and advanced text treatments */}
      <div className="relative">
        {/* Text shadow glow effect */}
        <div className="absolute -inset-2 blur-3xl opacity-30 bg-accent/10 -z-10 rounded-full"></div>
        
        <h1 className="font-serif font-light leading-[0.95] tracking-[-0.03em] text-white/95 relative">
          {/* First line with enhanced animated reveal */}
          <div className="overflow-hidden relative inline-block">
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              transition={{ 
                duration: 1.8, 
                delay: 0.8, 
                ease: [0.32, 0.75, 0.36, 1] 
              }}
              className="relative text-7xl md:text-8xl lg:text-9xl xl:text-[11rem]"
              onViewportEnter={() => {
                // Subtle life animation with extended timing
                setTimeout(() => {
                  const element = document.querySelector('.first-line-title');
                  if (element) {
                    animate(element, {
                      x: [-4, 4, -3, 2, 0],
                      filter: [
                        "blur(0px)",
                        "blur(0.5px)",
                        "blur(0px)"
                      ]
                    }, { 
                      duration: 3,
                      ease: [0.32, 0.75, 0.36, 1],
                      times: [0, 0.2, 0.5, 0.8, 1] 
                    });
                  }
                }, 7000);
              }}
              className="first-line-title"
            >
              <span className="inline-block relative">
                {language === 'pt' ? 'Objetos ' : 'Objetos '}
                <motion.div
                  className="absolute -inset-2 rounded-full blur-md -z-10 opacity-0"
                  animate={!prefersReducedMotion ? { 
                    opacity: [0, 0.15, 0],
                    background: [
                      "radial-gradient(circle, rgba(211,161,126,0.3), transparent 70%)",
                      "radial-gradient(circle, rgba(211,161,126,0.5), transparent 70%)",
                      "radial-gradient(circle, rgba(211,161,126,0.3), transparent 70%)"
                    ]
                  } : {}}
                  transition={{ duration: 4, repeat: Infinity, repeatType: "mirror" }}
                />
              </span>
              <span className="inline-block">{language === 'pt' ? 'com' : 'con'}</span>
            </motion.div>
            
            {/* Animated mask reveal effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-black to-transparent"
              initial={{ y: "0%" }}
              animate={{ y: "-100%" }}
              transition={{ 
                duration: 1.6, 
                delay: 0.9, 
                ease: [0.83, 0, 0.17, 1] 
              }}
            />
          </div>

          {/* Second line with premium gradient treatment */}
          <div className="overflow-hidden mt-1 md:mt-2">
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              transition={{ 
                duration: 1.8, 
                delay: 1.1, 
                ease: [0.32, 0.75, 0.36, 1] 
              }}
              className="relative text-7xl md:text-8xl lg:text-9xl xl:text-[11rem]"
              onViewportEnter={() => {
                // Enhanced subtle life animation with lighting effects
                setTimeout(() => {
                  const element = document.querySelector('.second-line-title');
                  if (element) {
                    animate(element, {
                      x: [4, -3, 2, -1, 0],
                      filter: [
                        "drop-shadow(0 0 0px rgba(211,161,126,0))",
                        "drop-shadow(0 0 10px rgba(211,161,126,0.3))",
                        "drop-shadow(0 0 0px rgba(211,161,126,0))"
                      ]
                    }, { 
                      duration: 4,
                      ease: [0.32, 0.75, 0.36, 1],
                      times: [0, 0.3, 0.6, 0.9, 1] 
                    });
                  }
                }, 10000);
              }}
            >
              <motion.span 
                className="bg-clip-text text-transparent relative second-line-title inline-block"
                style={{
                  backgroundImage: "linear-gradient(to right, rgba(255,255,255,1), rgba(255,255,255,0.95), rgba(211,161,126,1), rgba(255,255,255,0.95), rgba(255,255,255,1))",
                  backgroundSize: "200% 100%",
                  willChange: "background-position, filter"
                }}
                animate={!prefersReducedMotion ? { 
                  backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"] 
                } : {}}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
              >
                {language === 'pt' ? 'significado' : 'significado'}
              </motion.span>
            </motion.div>
            
            {/* Animated mask reveal effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-black to-transparent"
              initial={{ y: "0%" }}
              animate={{ y: "-100%" }}
              transition={{ 
                duration: 1.6, 
                delay: 1.2, 
                ease: [0.83, 0, 0.17, 1] 
              }}
            />
          </div>
        </h1>
        
        {/* Premium animated accent lines */}
        <motion.div
          className="absolute -left-5 -bottom-10 w-20 h-20 border border-accent/20 z-10"
          initial={{ opacity: 0, rotate: 10, scale: 0.9 }}
          animate={{ opacity: 0.6, rotate: 0, scale: 1 }}
          transition={{ duration: 1.5, delay: 1.8 }}
        />
        
        <motion.div
          className="absolute -right-3 top-1/2 w-10 h-10 rounded-full border border-accent/30 z-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: [0.6, 0.8, 0.6], scale: 1 }}
          transition={{ duration: 5, repeat: Infinity, repeatType: "mirror", delay: 2 }}
        />
      </div>

      {/* Enhanced subtitle with sophisticated reveal animation */}
      <motion.div 
        className="overflow-hidden relative z-10 mt-12 lg:mt-16"
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        transition={{ duration: 1, delay: 1.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.p
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.9, ease: [0.22, 1, 0.36, 1] }}
          className="text-xl md:text-2xl text-white/80 max-w-3xl font-sans font-light leading-relaxed"
        >
          {/* Character-by-character reveal for enhanced sophistication */}
          {(language === 'pt'
            ? 'Criamos ambientes que transcendem o ordinário, transformando experiências e elevando os sentidos através de peças artesanais meticulosamente elaboradas.'
            : 'Creamos ambientes que trascienden lo ordinario, transformando experiencias y elevando los sentidos a través de piezas artesanales meticulosamente elaboradas.'
          ).split('').map((char, i) => (
            <motion.span
              key={`char-${i}`}
              initial={{ opacity: 0, filter: "blur(2px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ 
                duration: 0.03,
                delay: 2 + Math.min(i * 0.01, 1.5),
                ease: "easeOut"
              }}
            >
              {char}
            </motion.span>
          ))}
        </motion.p>
      </motion.div>

      {/* Enhanced CTA section with premium interactions */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 2.5, ease: [0.32, 0.75, 0.36, 1] }}
        className="mt-12 md:mt-16 flex flex-col sm:flex-row space-y-6 sm:space-y-0 sm:space-x-8 relative"
      >
        {/* Ambient glow effect for CTAs */}
        <motion.div
          className="absolute -inset-10 rounded-full blur-[100px] -z-10"
          animate={{ 
            background: [
              "radial-gradient(circle at 30% 30%, rgba(211,161,126,0.1) 0%, transparent 70%)",
              "radial-gradient(circle at 70% 70%, rgba(211,161,126,0.15) 0%, transparent 70%)",
              "radial-gradient(circle at 30% 30%, rgba(211,161,126,0.1) 0%, transparent 70%)"
            ],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      
        {/* Premium primary button with advanced motion effects */}
        <a
          href="#portfolio"
          className="group relative inline-flex items-center overflow-hidden"
          onClick={(e) => {
            e.preventDefault();
            if (galleryRef.current) {
              galleryRef.current.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        >
          <motion.div
            className="relative z-10 bg-transparent border-2 border-accent px-9 py-5 text-white font-sans font-light tracking-wider overflow-hidden rounded-sm"
            whileHover={{ scale: 1.03, boxShadow: "0 10px 30px -10px rgba(211,161,126,0.4)" }}
            transition={{ duration: 0.4, ease: [0.32, 0.75, 0.36, 1] }}
          >
            <span className="relative z-10 group-hover:text-black transition-colors duration-500 text-lg">
              {language === 'pt' ? 'Explorar nossa coleção' : 'Explorar nuestra colección'}
            </span>

            {/* Enhanced fill effect with premium easing */}
            <motion.div
              className="absolute inset-0 bg-accent z-0"
              initial={{ scaleX: 0 }}
              whileHover={{ scaleX: 1 }}
              transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
              style={{ 
                transformOrigin: 'left',
                willChange: "transform"
              }}
            />
            
            {/* Light sweep effect */}
            <motion.div
              className="absolute inset-0 z-20 opacity-0 group-hover:opacity-100"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                backgroundSize: "200% 100%"
              }}
              animate={{ backgroundPosition: ["0% 0%", "200% 0%"] }}
              transition={{ duration: 1, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" }}
            />
          </motion.div>

          {/* Enhanced icon animation */}
          <div className="absolute right-8 opacity-0 group-hover:opacity-100 z-20 transition-opacity duration-300">
            <motion.div
              animate={{ 
                x: [0, 8, 0],
                scale: [1, 1.2, 1],
                transition: { 
                  repeat: Infinity, 
                  duration: 2,
                  ease: [0.32, 0.75, 0.36, 1] 
                }
              }}
            >
              <ArrowRight size={18} className="text-black filter drop-shadow(0 0 2px rgba(0,0,0,0.5))" />
            </motion.div>
          </div>
          
          {/* Premium interaction feedback */}
          <motion.div 
            className="absolute inset-0 rounded-sm z-0 opacity-0"
            whileHover={{
              opacity: 1,
              boxShadow: [
                "0 0 0 rgba(211,161,126,0)", 
                "0 0 20px rgba(211,161,126,0.4)"
              ],
              transition: { duration: 0.5 }
            }}
          />
        </a>

        {/* Enhanced secondary button */}
        <motion.a
          href="#contact"
          className="group inline-flex items-center space-x-3 text-white/80 hover:text-accent transition-colors duration-500"
          whileHover={{ x: 5 }}
          transition={{ duration: 0.4, ease: [0.32, 0.75, 0.36, 1] }}
          onClick={(e) => {
            e.preventDefault();
            if (contactRef.current) {
              contactRef.current.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        >
          {/* Premium icon background */}
          <motion.div
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center"
            whileHover={{ scale: 1.1, borderColor: 'rgba(211,161,126,0.3)', backgroundColor: 'rgba(211,161,126,0.1)' }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              animate={{ rotate: [0, 90, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", repeatType: "reverse" }}
            >
              <ChevronRight size={16} className="text-accent" />
            </motion.div>
          </motion.div>
          
          <span className="font-serif tracking-wide text-base relative">
            {language === 'pt' ? 'Agendar consulta' : 'Programar consulta'}
            <motion.div 
              className="absolute left-0 right-0 bottom-0 h-[1px] bg-accent origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
            />
          </span>
        </motion.a>
      </motion.div>
    </motion.div>
  </div>

  {/* Advanced scroll indicator with premium motion effects */}
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay: 3.3, ease: [0.32, 0.75, 0.36, 1] }}
    className="absolute bottom-12 left-0 right-0 flex justify-center z-30"
  >
    <button
      onClick={() => {
        if (galleryRef.current) {
          galleryRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }}
      className="flex flex-col items-center group"
      aria-label="Scroll para descobrir mais"
    >
      <motion.div
        className="relative mb-2 overflow-hidden"
        initial={{ opacity: 0.6 }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <span className="text-xs uppercase tracking-widest font-sans text-white/60 group-hover:text-white/90 transition-colors duration-500">
          {language === 'pt' ? 'Deslize para descobrir' : 'Desplácese para descubrir'}
        </span>
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[1px] bg-accent/40"
          initial={{ scaleX: 0, transformOrigin: "left" }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.5 }}
        />
      </motion.div>
      
      <div className="relative h-16 flex items-center overflow-hidden">
        {/* Enhanced scroll line with premium animation */}
        <div className="h-10 w-[1px] bg-gradient-to-b from-transparent via-white/40 to-white/10">
          <motion.div
            className="w-full"
            animate={{ 
              background: [
                "linear-gradient(to bottom, rgba(211,161,126,0), rgba(211,161,126,0.7), rgba(211,161,126,0))",
                "linear-gradient(to bottom, rgba(211,161,126,0.7), rgba(211,161,126,0), rgba(211,161,126,0))",
                "linear-gradient(to bottom, rgba(211,161,126,0), rgba(211,161,126,0.7), rgba(211,161,126,0))"
              ],
              y: ["-100%", "100%", "-100%"],
              height: ["40%", "30%", "40%"]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity,
              ease: [0.32, 0.75, 0.36, 1]
            }}
            style={{ 
              height: "50%",
              width: "100%",
              willChange: "transform, background"
            }}
          />
        </div>
        
        {/* Enhanced scroll indicator dot */}
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-7 h-7 flex items-center justify-center"
          animate={{ y: ["0%", "100%", "0%"] }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: [0.32, 0.75, 0.36, 1]
          }}
        >
          <motion.div
            className="w-2 h-2 rounded-full bg-accent"
            animate={!prefersReducedMotion ? { 
              scale: [1, 1.3, 1],
              boxShadow: [
                "0 0 0px 0px rgba(211,161,126,0.3)",
                "0 0 15px 2px rgba(211,161,126,0.6)",
                "0 0 0px 0px rgba(211,161,126,0.3)"
              ]
            } : {}}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      </div>
    </button>
  </motion.div>

  {/* Advanced scroll position indicator with premium design */}
  <div className="fixed bottom-12 right-12 z-40 pointer-events-none hidden md:block">
    <motion.div 
      className="relative h-24 w-px bg-white/10 overflow-hidden"
      style={{ opacity: useTransform(smoothHeroProgress, [0, 0.8], [1, 0]) }}
    >
      <motion.div
        className="absolute bottom-0 w-full bg-accent"
        style={{ 
          height: heroProgressHeight,
          scaleY: heroProgressHeight,
          transformOrigin: "bottom" 
        }}
      />
    </motion.div>
    
    <motion.div
      className="absolute bottom-[-2px] left-1/2 -translate-x-1/2 text-[10px] font-mono tracking-wider text-white/40 whitespace-nowrap"
      style={{ opacity: useTransform(smoothHeroProgress, [0, 0.8], [1, 0]) }}
    >
      <motion.span className="inline-block mr-1 text-accent">01</motion.span>
      <span>/</span>
      <span className="ml-1">05</span>
    </motion.div>
  </div>
  
  {/* Advanced responsive interfaces with sophisticated opacity management */}
  <motion.div 
    className="fixed top-[15%] left-6 z-40 flex flex-col space-y-3 items-center pointer-events-none hidden lg:flex"
    style={{ 
      opacity: useTransform(smoothHeroProgress, [0, 0.5], [1, 0]) 
    }}
  >
    {[0, 1, 2, 3, 4].map((index) => (
      <motion.div 
        key={`dot-nav-${index}`}
        className={`w-[3px] rounded-full ${index === 0 ? 'bg-accent h-10' : 'bg-white/20 h-4'}`}
        whileHover={{ scale: 1.2 }}
      />
    ))}
  </motion.div>
  
  {/* CSS definitions for visual effects */}
  <style>{`
    @keyframes gradientShift {
      0% { background-position: 0% 50% }
      50% { background-position: 100% 50% }
      100% { background-position: 0% 50% }
    }
    /* Lenis optimization - FIXED SETTINGS */
 {
  height: auto;
}

/* Improved scroll performance */
* {
  /* Prevent subpixel rendering issues */
  transform: translateZ(0);
}
    .gradient-text {
      background-size: 200% auto;
      background-clip: text;
      -webkit-background-clip: text;
      color: transparent;
      animation: gradientShift 8s ease infinite;
      will-change: background-position;
    }
    
    .perspective-1000 {
      perspective: 1000px;
    }
    
    .preserve-3d {
      transform-style: preserve-3d;
    }
     /* === BALANCED SMOOTH SCROLLING === */
html {
  scroll-behavior: auto; /* Ensure consistency across browsers */
}

html.lenis {
  height: auto;
}

/* Enable smooth scrolling with optimized values */
.lenis.lenis-smooth {
  /* Carefully tuned values for fluid scrolling */
  --lenis-lerp: 0.075; /* Sweet spot between smooth and responsive */
  --lenis-smooth-factor: 0.5;
  scroll-behavior: auto !important; /* Let Lenis control scrolling behavior */
  overflow: visible !important;
}

/* Fluid touch experience */
.lenis.lenis-smooth.lenis-scrolling {
  scroll-behavior: auto !important;
}

/* Wait for interactions before enabling effects */
.lenis.lenis-stopped {
  transition-duration: 0.4s;
  transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
}

/* Selective performance optimizations during fast scrolling only */
.lenis-scrolling .animated-bg,
.lenis-scrolling .parallax-element,
.lenis-scrolling .blur-element {
  will-change: transform;
  transition: none !important;
}

/* Maintain animation on important elements */
.lenis-scrolling .critical-animation {
  animation-play-state: running !important;
  transition: all 0.3s ease !important;
}

/* Remove the styles that completely disable animations during scroll */
/* We'll be more selective about what gets disabled */

/* Mobile and reduced motion optimization */
@media (max-width: 768px), (prefers-reduced-motion) {
  html.lenis {
    --lenis-lerp: 0.05; /* Slight smoothing on mobile */
    --lenis-smooth-factor: 0.3;
  }
}

/* Core stabilizers without breaking smoothness */
body, main, section {
  contain: paint;
  transform-style: preserve-3d;
  backface-visibility: hidden;
} 
  `}</style>
</motion.section>
          {/* Featured Projects Section */}
          <FeaturedProjects
            galleryRef={galleryRef}
            setCursorVariant={setCursorVariant}
        />
<motion.div
  className="relative mb-32 overflow-hidden rounded-3xl shadow-[0_35px_60px_-15px_rgba(0,0,0,0.5)] bg-gradient-to-br from-[#0C0A09]/80 to-[#171412]/90 backdrop-blur-md"
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  viewport={{ once: true, margin: "-50px" }}
  transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
>
  {/* Advanced textured background with subtle movement */}
  <div className="absolute inset-0 bg-[url('/images/elegant-texture.jpg')] opacity-8 mix-blend-overlay z-0"></div>
  
  {/* Dynamic particles system */}
  {!prefersReducedMotion && (
    <div className="absolute inset-0 overflow-hidden opacity-30 z-0">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute h-[2px] w-[2px] rounded-full bg-accent/80"
          initial={{ 
            x: `${Math.random() * 100}%`, 
            y: `${Math.random() * 100}%`, 
            scale: 0.5, 
            opacity: 0.3 
          }}
          animate={{ 
            scale: [0.5, Math.random() * 2 + 1, 0.5],
            opacity: [0.3, 0.7, 0.3],
            filter: ["blur(0px)", "blur(3px)", "blur(0px)"]
          }}
          transition={{ 
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  )}

  {/* Premium gradient light effects with optimized animation */}
  <motion.div
    className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-accent/5 to-transparent blur-[120px] z-0"
    animate={{
      scale: prefersReducedMotion ? 1 : [1, 1.1, 1],
      opacity: prefersReducedMotion ? 0.08 : [0.05, 0.08, 0.05]
    }}
    transition={{ duration: 15, repeat: Infinity, repeatType: "reverse" }}
  />
  
  <motion.div
    className="absolute -bottom-20 -left-20 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-accent/8 to-transparent blur-[100px] z-0"
    animate={prefersReducedMotion ? {} : {
      scale: [1.2, 1, 1.2],
      opacity: [0.08, 0.12, 0.08]
    }}
    transition={{ duration: 18, repeat: Infinity, repeatType: "reverse" }}
  />

  <div className="relative z-10 p-12 md:p-16 lg:p-20">
    {/* Improved header section with sophisticated reveal animations */}
    <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 lg:mb-24">
      <div>

<motion.div
  className="text-accent/90 uppercase tracking-[0.35em] text-xs font-light mb-6 relative inline-flex"
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.8 }}
>
  {/* Change from text-accent/90 to text-accent for better visibility */}
  <span className="text-accent font-medium">{language === 'pt' ? 'Materiais Selecionados' : 'Materiales Seleccionados'}</span>
  <motion.span 
    className="absolute bottom-0 left-0 h-[1px] bg-accent/40"
    initial={{ width: 0 }}
    whileInView={{ width: '100%' }}
    viewport={{ once: true }}
    transition={{ delay: 0.5, duration: 1.2 }}
  />
</motion.div>

<motion.div className="overflow-hidden">
  <motion.h2
    className="text-5xl md:text-6xl font-serif font-light leading-tight text-white"
    initial={{ y: 80 }}
    whileInView={{ y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
  >
    {/* Change to text-white for better visibility */}
    <span className="block text-white">{language === 'pt' ? 'Biblioteca de' : 'Biblioteca de'}</span>
    <span className="text-6xl md:text-7xl relative inline-block">
      <motion.span
        initial={{ filter: "blur(0px)" }}
        animate={{ filter: ["blur(0px)", "blur(2px)", "blur(0px)"] }}
        transition={{ duration: 8, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        className="bg-gradient-to-r from-white/95 via-accent/90 to-white/95 text-transparent bg-clip-text"
      >
        {language === 'pt' ? 'Materiais Nobres' : 'Materiales Nobles'}
      </motion.span>
      
      <motion.div
        className="absolute -bottom-4 left-0 h-[1.5px] bg-gradient-to-r from-accent via-accent/50 to-transparent"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: 0.4 }}
        style={{ transformOrigin: "left" }}
      />
    </span>
  </motion.h2>
</motion.div>
        
        <motion.div className="overflow-hidden">
          <motion.h2
            className="text-5xl md:text-6xl font-serif font-light leading-tight text-white"
            initial={{ y: 80 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="text-6xl md:text-7xl relative inline-block">
              <motion.span
                initial={{ filter: "blur(0px)" }}
                animate={{ filter: ["blur(0px)", "blur(2px)", "blur(0px)"] }}
                transition={{ duration: 8, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                className="bg-gradient-to-r from-white/95 via-accent/90 to-white/95 text-transparent bg-clip-text"
              >
              </motion.span>
              
              <motion.div
                className="absolute -bottom-4 left-0 h-[1.5px] bg-gradient-to-r from-accent via-accent/50 to-transparent"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.4 }}
                style={{ transformOrigin: "left" }}
              />
            </span>
          </motion.h2>
        </motion.div>
      </div>

      <motion.p
        className="text-white/70 md:max-w-md mt-10 md:mt-0 text-sm md:text-base leading-relaxed font-sans"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        {language === 'pt'
          ? 'Cada material é cuidadosamente selecionado e utilizado com precisão artesanal para criar móveis que transcendem gerações, combinando beleza atemporal e durabilidade excepcional.'
          : 'Cada material es cuidadosamente seleccionado y utilizado con precisión artesanal para crear muebles que trascienden generaciones, combinando belleza atemporal y durabilidad excepcional.'}
      </motion.p>
    </div>

    {/* Improved search & filter toolbar */}
    <div className="mb-12 lg:mb-16 flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
      {/* Enhanced material category tabs */}
      <motion.div
        className="flex space-x-2 overflow-x-auto hide-scrollbar pb-6 -mx-2 px-2 w-full lg:w-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {[
          { id: 'woods', icon: 'wood-grain', label: { pt: 'Madeiras', es: 'Maderas' } },
          { id: 'fabrics', icon: 'fabric', label: { pt: 'Tecidos', es: 'Tejidos' } },
          { id: 'metals', icon: 'metal', label: { pt: 'Metais', es: 'Metales' } },
          { id: 'stones', icon: 'stone', label: { pt: 'Pedras', es: 'Piedras' } },
          { id: 'glass', icon: 'glass', label: { pt: 'Vidros', es: 'Vidrios' } },
          { id: 'leathers', icon: 'leather', label: { pt: 'Couros', es: 'Cueros' } },
          { id: 'finishes', icon: 'finish', label: { pt: 'Acabamentos', es: 'Acabados' } },
        ].map((category, index) => (
          <motion.button
            key={category.id}
            className={`px-6 py-4 rounded-md whitespace-nowrap text-sm flex items-center space-x-3 group ${
              activeCategory === index
                ? 'bg-gradient-to-br from-accent to-accent/80 text-black shadow-lg shadow-accent/20 border-0'
                : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10 hover:border-accent/20'
            } transition-all duration-500`}
            onClick={() => setActiveCategory(index)}
            whileHover={{ y: -3, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.4, 
              delay: 0.1 + (index * 0.06),
              type: "spring",
              stiffness: 300,
              damping: 20
            }}
          >
            <motion.span 
              className={`w-5 h-5 flex items-center justify-center ${activeCategory === index ? 'text-black' : 'text-white/70 group-hover:text-accent/80'} transition-colors duration-300`}
              animate={activeCategory === index ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.5, repeat: 0 }}
            >
              <MaterialIcon type={category.icon} active={activeCategory === index} />
            </motion.span>
            <span className={`font-sans tracking-wide ${activeCategory === index ? 'font-medium' : ''}`}>
              {category.label[language === 'pt' ? 'pt' : 'es']}
            </span>
          </motion.button>
        ))}
      </motion.div>
      
      {/* Material search & view toggles */}
      <motion.div 
        className="flex gap-4 items-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <div className="relative">
          <input
            type="text"
            placeholder={language === 'pt' ? 'Buscar material...' : 'Buscar material...'}
            className="bg-white/5 border border-white/10 rounded-md py-3 pl-10 pr-4 text-white/80 placeholder:text-white/40 focus:outline-none focus:border-accent/30 focus:ring-1 focus:ring-accent/20 transition-all duration-300 w-48 md:w-64"
          />
          <svg 
            width="18" 
            height="18" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        
        {/* View toggle buttons */}
        <div className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-md">
          <button 
            className={`p-1.5 rounded ${currentFurniture === 0 ? 'bg-accent/20 text-accent' : 'text-white/50 hover:text-white/80'} transition duration-300`}
            onClick={() => setCurrentFurniture(0)}
            title={language === 'pt' ? "Mesa" : "Mesa"}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="8" width="16" height="2"></rect>
              <rect x="6" y="10" width="2" height="8"></rect>
              <rect x="16" y="10" width="2" height="8"></rect>
              <rect x="4" y="18" width="16" height="2"></rect>
            </svg>
          </button>
          
          <button 
            className={`p-1.5 rounded ${currentFurniture === 1 ? 'bg-accent/20 text-accent' : 'text-white/50 hover:text-white/80'} transition duration-300`}
            onClick={() => setCurrentFurniture(1)}
            title={language === 'pt' ? "Cadeira" : "Silla"}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 18v2M6 18v2M6 8V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2M6 8h12M6 8v10M18 8v10"></path>
              <path d="M10 12h4"></path>
            </svg>
          </button>
          
          <button 
            className={`p-1.5 rounded ${currentFurniture === 2 ? 'bg-accent/20 text-accent' : 'text-white/50 hover:text-white/80'} transition duration-300`}
            onClick={() => setCurrentFurniture(2)}
            title={language === 'pt' ? "Armário" : "Armario"}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="2" width="16" height="20" rx="2"></rect>
              <path d="M12 2v20"></path>
              <path d="M9 12h.01M15 12h.01"></path>
            </svg>
          </button>
          
          <span className="w-px h-6 bg-white/10 mx-1"></span>
          
          <button 
            className={`p-1.5 rounded ${autoRotate ? 'bg-accent/20 text-accent' : 'text-white/50 hover:text-white/80'} transition duration-300`}
            onClick={() => setAutoRotate(!autoRotate)}
            title={language === 'pt' ? "Rotação automática" : "Rotación automática"}
          >
            <motion.svg 
              animate={autoRotate ? { rotate: 360 } : {}}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
            >
              <path d="M21.5 2v6h-6M2.5 22v-6h6M21.5 8c-1.8-5.5-8.9-7.1-13.5-4-1.5 1-2.7 2.3-3.4 4M2.5 16c1.8 5.5 8.9 7.1 13.5 4 1.5-1 2.7-2.3 3.4-4"></path>
            </motion.svg>
          </button>
        </div>
      </motion.div>
    </div>

    {/* Improved 3D viewer and material selection grid */}
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      {/* Enhanced 3D viewer with improved fallbacks */}
      <div className="lg:col-span-7 order-1 lg:order-1">
        <div className="relative overflow-hidden rounded-xl border border-white/10 shadow-2xl h-[550px] bg-gradient-to-br from-black/80 to-black/60">
          {/* Loading state elegantly handled */}
          <motion.div 
            className="absolute inset-0 z-30 bg-black flex items-center justify-center"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0, display: 'none' }}
            transition={{ duration: 1, delay: 1 }}
          >
            <div className="flex flex-col items-center">
              <motion.div 
                className="w-20 h-20 border-2 border-t-accent border-r-accent border-b-transparent border-l-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <p className="mt-4 text-white/70 text-sm">
                {language === 'pt' ? 'Carregando material' : 'Cargando material'}
              </p>
            </div>
          </motion.div>
          
          {/* Elegant error boundary with premium fallback UI */}
          <ErrorBoundary fallback={
            <div className="h-full w-full flex flex-col items-center justify-center p-10 bg-gradient-to-br from-black/60 to-black/80">
              <div className="text-accent text-5xl mb-4">✨</div>
              <h3 className="text-white text-xl mb-4 font-serif">
                {language === 'pt' ? 'Visualização Premium' : 'Visualización Premium'}
              </h3>
              <p className="text-white/70 text-center max-w-md">
                {language === 'pt' 
                  ? 'Explore nossos materiais premium em nossa galeria física ou agende uma demonstração virtual personalizada.' 
                  : 'Explore nuestros materiales premium en nuestra galería física o programe una demostración virtual personalizada.'}
              </p>
              <button className="mt-6 px-5 py-2 bg-accent/80 hover:bg-accent text-black transition-colors duration-300 rounded-sm">
                {language === 'pt' ? 'Agendar demonstração' : 'Programar demostración'}  
              </button>
            </div>
          }>
            {/* Background mesh decoration */}
            <div className="absolute inset-0 bg-[url('/images/mesh-gradient.png')] opacity-10 bg-cover mix-blend-soft-light pointer-events-none z-0" />
            
            {/* Enhanced 3D Canvas with reduced re-renders */}
            <Canvas 
              shadows 
              dpr={[1, 2]} // Dynamic pixel ratio for better performance
              camera={{ position: [0, 0, 5], fov: 40 }}
              performance={{ min: 0.5 }} // Performance throttling for low-end devices
              onCreated={({ gl }) => {
                gl.setClearColor('#0a0a0a', 1);
                (gl as any).physicallyCorrectLights = true;

                // Context loss handling
                const handleContextLost = () => {
                  console.log('Contexto WebGL perdido, tentando reconectar...');
                  // Show fallback UI
                  document.querySelector('.webgl-error')?.classList.remove('hidden');
                };
                
                const handleContextRestored = () => {
                  console.log('Contexto WebGL restaurado');
                  document.querySelector('.webgl-error')?.classList.add('hidden');
                };
                
                gl.domElement.addEventListener('webglcontextlost', handleContextLost);
                gl.domElement.addEventListener('webglcontextrestored', handleContextRestored);
              }}
            >
              {/* Optimized lighting setup */}
              <ambientLight intensity={0.5} />
              <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1.8} castShadow shadow-mapSize={[1024, 1024]} />
              <directionalLight position={[-5, 5, -5]} intensity={0.7} />
              
              {/* Scene environment */}
              <React.Suspense fallback={null}>
                <ContactShadows
                  position={[0, -1.5, 0]}
                  opacity={0.7}
                  scale={10}
                  blur={2}
                  far={4}
                  resolution={256}
                />
              </React.Suspense>
              
              {/* Optimized controls */}
              <OrbitControls
                enableZoom={false}
                enablePan={false}
                maxPolarAngle={Math.PI / 2}
                minPolarAngle={Math.PI / 4}
                autoRotate={autoRotate}
                autoRotateSpeed={2}
                dampingFactor={0.1}
              />
              
              {/* Material showcase with error boundary */}
              <ErrorBoundary fallback={
                <mesh>
                  <sphereGeometry args={[1, 32, 32]} />
                  <meshStandardMaterial color={activeMaterial?.color || '#D3A17E'} />
                </mesh>
              }>
                <EnhancedMaterialShowcase
                  material={activeMaterial || { ...allMaterials.woods[0], furniture: '', properties: '' }}
                  currentFurniture={currentFurniture}
                />
              </ErrorBoundary>
              
              {/* Manual lighting setup for consistent look */}
              <hemisphereLight intensity={0.5} color="#ffffff" groundColor="#555555" />
              
              {/* Environment helper for reflections */}
              <React.Suspense fallback={null}>
                <Environment preset="studio" />
              </React.Suspense>
            </Canvas>
            
            {/* Contextual UI overlay with interactive elements */}
            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end z-10 pointer-events-none">
              <div className="bg-black/60 backdrop-blur-md rounded-md p-4 pointer-events-auto">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-5 h-5 rounded-full" 
                    style={{ background: activeMaterial?.color || '#D3A17E' }}
                  />
                  <span className="text-white text-sm font-medium">
                    {activeMaterial?.name || (language === 'pt' ? 'Selecione um material' : 'Seleccione un material')}
                  </span>
                </div>
              </div>
              <div className="pointer-events-auto flex items-center space-x-2 bg-black/60 backdrop-blur-md rounded-md py-2 px-3">
                <button 
                  onClick={() => setCurrentFurniture((prev) => (prev + 1) % furnitureLabels.length)}
                  className="text-white/70 hover:text-white transition-colors"
                  title={language === 'pt' ? 'Mudar visualização' : 'Cambiar visualización'}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                  </svg>
                </button>
                <span className="w-px h-4 bg-white/20"></span>
                <button 
                  onClick={() => setAutoRotate(!autoRotate)}
                  className={`text-white/70 hover:text-white transition-colors ${autoRotate ? 'text-accent' : ''}`}
                  title={autoRotate ? (language === 'pt' ? 'Pausar rotação' : 'Pausar rotación') : (language === 'pt' ? 'Iniciar rotação' : 'Iniciar rotación')}
                >
                  {autoRotate ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="6" y="4" width="4" height="16"></rect>
                      <rect x="14" y="4" width="4" height="16"></rect>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </ErrorBoundary>
          
          {/* WebGL Error message overlay */}
          <div className="webgl-error absolute inset-0 hidden bg-black/80 flex items-center justify-center z-40">
            <div className="text-center max-w-md p-8">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D3A17E" strokeWidth="1.5" className="mx-auto mb-4">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <h3 className="text-xl text-white font-serif mb-3">
                {language === 'pt' ? 'Visualização 3D indisponível' : 'Visualización 3D no disponible'}
              </h3>
              <p className="text-white/70">
                {language === 'pt'
                  ? 'Seu dispositivo não suporta a renderização 3D. Tente atualizar seu navegador ou visualize em outro dispositivo.'
                  : 'Su dispositivo no soporta la renderización 3D. Intente actualizar su navegador o visualice en otro dispositivo.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Improved material selection panel */}
      <div className="lg:col-span-5 order-2 lg:order-2">
        <div className="bg-black/40 backdrop-filter backdrop-blur-xl rounded-xl border border-white/10 h-full flex flex-col">
          {/* Header with category title and count */}
          <div className="flex justify-between items-center p-6 border-b border-white/5 bg-black/20">
            <div className="flex items-center gap-3">
              <motion.div 
                className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center"
                animate={{ 
                  boxShadow: ["0 0 0 rgba(211,161,126,0)", "0 0 15px rgba(211,161,126,0.3)", "0 0 0 rgba(211,161,126,0)"] 
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <MaterialIcon type={['wood-grain', 'fabric', 'metal', 'stone', 'glass', 'leather', 'finish'][activeCategory]} active={true} />
              </motion.div>
              <h3 className="text-white text-xl font-serif font-light">
                {activeCategory === 0 && (language === 'pt' ? 'Madeiras Premium' : 'Maderas Premium')}
                {activeCategory === 1 && (language === 'pt' ? 'Tecidos Exclusivos' : 'Tejidos Exclusivos')}
                {activeCategory === 2 && (language === 'pt' ? 'Metais Nobres' : 'Metales Nobles')}
                {activeCategory === 3 && (language === 'pt' ? 'Pedras Naturais' : 'Piedras Naturales')}
                {activeCategory === 4 && (language === 'pt' ? 'Vidros Especiais' : 'Vidrios Especiales')}
                {activeCategory === 5 && (language === 'pt' ? 'Couros Selecionados' : 'Cueros Seleccionados')}
                {activeCategory === 6 && (language === 'pt' ? 'Acabamentos Refinados' : 'Acabados Refinados')}
              </h3>
            </div>
            <div 
              className="text-accent/80 px-3 py-1 rounded-full border border-accent/20 text-xs font-medium flex items-center gap-1"
              title={language === 'pt' ? 'Quantidade disponível' : 'Cantidad disponible'}
            >
              <motion.span
                key={`count-${activeCategory}`}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.3 }}
              >
                {activeCategory === 0 && allMaterials.woods.length}
                {activeCategory === 1 && allMaterials.fabrics.length}
                {activeCategory === 2 && allMaterials.metals.length}
                {activeCategory === 3 && allMaterials.stones.length}
              </motion.span>
              <span>
                {language === 'pt' ? ' opções' : ' opciones'}
              </span>
            </div>
          </div>

          {/* Material grid with enhanced animation */}
          <div className="flex-grow overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={`category-${activeCategory}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="h-[400px] overflow-y-auto hide-scrollbar p-6"
              >
                <div className="grid grid-cols-2 gap-5 relative">
                  {/* Materials by category */}
                  {activeCategory === 0 && allMaterials.woods.map((material, idx) => (
                    <MaterialCard
                      key={material.id}
                      material={material}
                      isActive={activeMaterial?.id === material.id}
                      onSelect={() => setActiveMaterial({ ...material, furniture: material.furniture || null })}
                      index={idx}
                    />
                  ))}

                  {activeCategory === 1 && allMaterials.fabrics.map((material, idx) => (
                    <MaterialCard
                      key={material.id}
                      material={material}
                      isActive={activeMaterial?.id === material.id}
                      onSelect={() => setActiveMaterial({ ...material, furniture: material.furniture || null, properties: material.properties || null })}                      index={idx}
                      isFabric={true}
                    />
                  ))}

                  {activeCategory === 2 && allMaterials.metals.map((material, idx) => (
                    <MaterialCard
                      key={material.id}
                      material={material}
                      isActive={activeMaterial?.id === material.id}
                      onSelect={() => setActiveMaterial({ ...material, furniture: material.furniture || null, properties: material.properties || null })}                      index={idx}
                    />
                  ))}

                  {activeCategory === 3 && allMaterials.stones.map((material, idx) => (
                    <MaterialCard
                      key={material.id}
                      material={material}
                      isActive={activeMaterial?.id === material.id}
                      onSelect={() => setActiveMaterial({ ...material, properties: material.properties || null })}                      index={idx}
                    />
                  ))}
                  
                  {/* Empty state handling */}
                  {((activeCategory === 0 && allMaterials.woods.length === 0) ||
                    (activeCategory === 1 && allMaterials.fabrics.length === 0) ||
                    (activeCategory === 2 && allMaterials.metals.length === 0) ||
                    (activeCategory === 3 && allMaterials.stones.length === 0) ||
                    activeCategory > 3) && (
                    <div className="col-span-2 flex flex-col items-center justify-center py-12 text-center">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D3A17E" strokeWidth="1" className="mb-4 opacity-30">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M3 15h4"></path>
                        <path d="M17 15h4"></path>
                        <path d="M12 3v4"></path>
                        <path d="M12 17v4"></path>
                      </svg>
                      <p className="text-white/40 text-sm max-w-xs">
                        {language === 'pt'
                          ? 'Esta categoria está sendo atualizada. Entre em contato para consultar disponibilidade.'
                          : 'Esta categoría está siendo actualizada. Póngase en contacto para consultar disponibilidad.'}
                      </p>
                      <button className="mt-4 px-4 py-2 text-xs border border-accent/40 text-accent hover:bg-accent/10 transition-colors duration-300 rounded">
                        {language === 'pt' ? 'Fale com especialista' : 'Hablar con especialista'}
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Premium material detail panel */}
          <div className="border-t border-white/5 bg-black/30">
            <motion.div
              className="p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {activeMaterial ? (
                <motion.div 
                  key={activeMaterial.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-accent text-xs uppercase tracking-widest font-sans">
                      {activeMaterial.id}
                    </h4>
                    <motion.span 
                      className="text-white/60 text-xs px-2 py-1 rounded border border-white/10"
                      animate={{ 
                        backgroundColor: ["rgba(211,161,126,0)", "rgba(211,161,126,0.1)", "rgba(211,161,126,0)"] 
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {activeMaterial.origin}
                    </motion.span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Material specs with animated bars */}
                    <div>
                      <div className="space-y-5">
                        {[
                          { name: language === 'pt' ? 'Durabilidade' : 'Durabilidad', value: activeMaterial.durability },
                          { name: language === 'pt' ? 'Manutenção' : 'Mantenimiento', value: activeMaterial.maitenance },
                          { name: language === 'pt' ? 'Sustentabilidade' : 'Sostenibilidad', value: activeMaterial.sustainability }
                        ].map((stat, i) => (
                          <div key={i}>
                            <div className="flex justify-between text-xs mb-2 font-sans">
                              <span className="text-white/80">{stat.name}</span>
                              <div className="flex space-x-1.5">
                                {[1, 2, 3, 4, 5].map(dot => (
                                  <motion.div
                                    key={dot}
                                    className={`w-1.5 h-1.5 rounded-full ${dot <= (stat.value ?? 0) ? 'bg-accent' : 'bg-white/10'}`}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: dot <= (stat.value ?? 0) ? [1, 1.2, 1] : 1 }}
                                    transition={{ 
                                      delay: 0.3 + (i * 0.1) + (dot * 0.05), 
                                      duration: 0.4,
                                      repeat: dot <= (stat.value ?? 0) ? 1 : 0,
                                      repeatDelay: 2
                                    }}
                                  />
                                ))}
                              </div>
                            </div>
                            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${(stat.value / 5) * 100}%` }}
                                transition={{ duration: 0.7, delay: 0.2 + (i * 0.1) }}
                                style={{
                                  background: "linear-gradient(90deg, rgba(211,161,126,0.7) 0%, rgba(211,161,126,1) 50%, rgba(211,161,126,0.7) 100%)"
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Applications with sequential reveal */}
                    <div>
                      <h5 className="text-accent text-xs uppercase tracking-widest font-sans mb-4">
                        {language === 'pt' ? 'Aplicações Ideais' : 'Aplicaciones Ideales'}
                      </h5>
                      <ul className="space-y-3">
                        {(activeMaterial?.applications || [])?.map((app: { [key: string]: string }, i: number) => (
                          <motion.li
                            key={i}
                            className="flex items-start gap-3 group"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + (i * 0.1) }}
                            whileHover={{ x: 3 }}
                          >
                            <motion.div
                              className="w-1.5 h-1.5 rounded-full bg-accent mr-1 relative top-[0.4rem]"
                              whileHover={{ scale: 1.5 }}
                              animate={{ opacity: [0.7, 1, 0.7] }}
                              transition={{ 
                                duration: 2, 
                                repeat: Infinity,
                                repeatType: "mirror", 
                                delay: i * 0.2 
                              }}
                            />
                            <span className="text-white/80 text-sm font-sans group-hover:text-white transition-colors duration-300">
                              {app[language === 'pt' ? 'pt' : 'en']}
                            </span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  {/* Description snippet */}
                  <div className="mt-6 border-t border-white/5 pt-5">
                    <p className="text-white/70 text-sm italic font-serif">
                      "{activeMaterial.description?.[language === 'pt' ? 'pt' : 'es']}"
                    </p>
                  </div>
                </motion.div>
              ) : (
                <div className="text-center py-6 px-4">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-accent/30 mx-auto mb-3">
                    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
                  </svg>
                  <p className="text-white/40 font-sans italic text-sm">
                    {language === 'pt' ? 'Selecione um material para ver detalhes' : 'Seleccione un material para ver detalles'}
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>

    {/* Premium footer with certifications and CTA */}
    <motion.div
      className="mt-16 bg-gradient-to-r from-black/50 via-black/40 to-black/30 rounded-xl backdrop-filter backdrop-blur-xl flex flex-col sm:flex-row justify-between items-center border border-white/5 overflow-hidden"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: 0.4 }}
    >
      {/* Left section with rotating icon and text */}
      <div className="p-8 border-r border-white/5 flex-1">
        <h4 className="text-white text-lg font-serif font-light flex items-center group">
          <motion.div
            className="w-6 h-6 flex items-center justify-center mr-3 text-accent relative"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" className="opacity-70" />
              <motion.path
                d="M12 2a10 10 0 1 0 10 10"
                stroke="currentColor" 
                strokeWidth="1.5"
                strokeLinecap="round"
                animate={{ 
                  strokeDasharray: ["1, 30", "25, 6", "1, 30"],
                  strokeDashoffset: [0, -36, -72] 
                }}
                transition={{ 
                  duration: 6, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
              />
            </svg>
            
            {/* Pulsing glow effect */}
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{ 
                boxShadow: [
                  "0 0 0 0 rgba(211,161,126,0)",
                  "0 0 0 5px rgba(211,161,126,0.3)",
                  "0 0 0 0 rgba(211,161,126,0)"
                ]
              }}
              transition={{ duration: 2.5, repeat: Infinity }}
            />
          </motion.div>
          
          <span className="relative group-hover:text-accent transition-colors duration-500">
            {language === 'pt' ? 'Materiais Certificados' : 'Materiales Certificados'}
          </span>
          
          <motion.div
            className="absolute bottom-0 left-9 right-0 h-[1px] bg-gradient-to-r from-accent to-transparent origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
          />
        </h4>
        
        <p className="text-white/70 text-sm mt-4 max-w-xl font-sans leading-relaxed">
          {language === 'pt'
            ? 'Trabalhamos apenas com fornecedores certificados que garantem a origem sustentável, rastreabilidade completa e qualidade excepcional dos materiais que utilizamos em nossas criações.'
            : 'Trabajamos solo con proveedores certificados que garantizan el origen sostenible, trazabilidad completa y calidad excepcional de los materiales que utilizamos en nuestras creaciones.'}
        </p>
      </div>

      {/* Right section with certification logos and CTA button */}
      <div className="p-8 flex flex-col items-center sm:items-end">
        <div className="flex space-x-4 mb-6">
          {[
            { id: 'fsc', name: 'FSC Certified' },
            { id: 'greenguard', name: 'GREENGUARD' },
            { id: 'eco', name: 'ECO Certified' }
          ].map((cert, idx) => (
            <motion.div
              key={cert.id}
              className="group relative w-14 h-14 bg-white/5 rounded-full flex items-center justify-center border border-white/10"
              whileHover={{ 
                y: -5, 
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                transition: { type: "spring", stiffness: 300, damping: 15 }
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + (idx * 0.1) }}
            >
              {/* Premium tooltip */}
              <motion.div
                className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none"
                initial={{ y: 10 }}
                whileHover={{ y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {cert.name}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black/80"></div>
              </motion.div>
              
              {/* Certificate logo with hover effects */}
              <motion.img
                src={`/images/certifications/${cert.id}.svg`}
                alt={cert.name}
                className="w-8 h-8 object-contain opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              />
              
              {/* Highlight ring animation */}
              <motion.div
                className="absolute inset-0 rounded-full border border-accent/0 group-hover:border-accent/30"
                animate={idx === 0 ? { 
                  scale: [1, 1.05, 1],
                  borderColor: ["rgba(211,161,126,0)", "rgba(211,161,126,0.3)", "rgba(211,161,126,0)"]
                } : {}}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              />
            </motion.div>
          ))}
        </div>

        {/* Premium material consultation button */}
        <button
          className="group relative overflow-hidden bg-accent hover:bg-accent/95 px-6 py-3.5 text-black text-sm font-medium rounded-md transition-all duration-300 flex items-center space-x-2 shadow-lg shadow-accent/10"
          onClick={() => scrollToSection(contactRef)}
        >
          {/* Button label with hover state */}
          <span className="font-sans tracking-wide relative z-10 transition-transform duration-300 group-hover:translate-x-1">
            {language === 'pt' ? 'Consultar disponibilidade' : 'Consultar disponibilidad'}
          </span>
          
          {/* Animated icon */}
          <motion.div
            className="relative z-10"
            animate={{ x: [0, 3, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "loop" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14m-5 -5l5 5l-5 5" />
            </svg>
          </motion.div>
          
          {/* Shine effect on hover */}
          <motion.div 
            className="absolute inset-0 translate-x-full group-hover:translate-x-[-100%]"
            transition={{ duration: 0.7, ease: "easeInOut" }}
            style={{
              background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%)"
            }}
          />
        </button>
      </div>
    </motion.div>
  </div>
</motion.div>
<motion.section
  ref={processRef}
  className="py-32 md:py-80 bg-gradient-to-b from-[#0C0A09] via-[#12100E] to-[#171413] relative overflow-hidden isolation"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 1.2 }}
  style={{ 
    willChange: "transform",
    backfaceVisibility: "hidden"
  }}
>
  {/* Performance-optimized atmospheric background */}
  <div className="absolute inset-0 z-0">
    {/* Optimized background gradient with reduced animation complexity */}
    <div className="absolute inset-0 opacity-80 bg-[#0C0A09]"></div>
    
    <motion.div
      className="absolute inset-0 opacity-80"
      animate={{
        background: [
          "radial-gradient(circle at 30% 40%, rgba(25,23,20,0.9), rgba(12,10,9,1) 80%)",
          "radial-gradient(circle at 70% 60%, rgba(25,23,20,0.9), rgba(12,10,9,1) 80%)",
          "radial-gradient(circle at 30% 40%, rgba(25,23,20,0.9), rgba(12,10,9,1) 80%)"
        ]
      }}
      transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", repeatType: "mirror" }}
      style={{ willChange: "background" }}
    />

    {/* Static grid pattern for better performance */}
    <div
      className="absolute inset-0 opacity-10 pointer-events-none"
      style={{
        backgroundImage: 'url(/images/grid-pattern.svg)',
        backgroundSize: '60px',
      }}
    />

    {/* Performance-optimized particles - reduced quantity and conditionally rendered */}
    {!prefersReducedMotion && !isMobile && (
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(Math.min(15, window.innerWidth > 1600 ? 15 : 8))].map((_, i) => (
          <motion.div
            key={`process-particle-${i}`}
            className="absolute h-[1.5px] w-[1.5px] rounded-full bg-accent/80"
            initial={{ 
              x: `${Math.random() * 100}%`, 
              y: `${Math.random() * 100}%`, 
              scale: 0.3, 
              opacity: 0.2 
            }}
            animate={{ 
              scale: [0.3, Math.random() * 1.2 + 0.5, 0.3],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{ 
              duration: Math.random() * 15 + 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{ willChange: "transform, opacity" }}
          />
        ))}
      </div>
    )}

    {/* Optimized vertical timeline - static with reveal animation */}
    <motion.div 
      className="absolute top-[15%] left-1/2 transform -translate-x-1/2 h-[70%] w-[2px] z-10"
      style={{
        background: "linear-gradient(to bottom, transparent, rgba(211,161,126,0.7), transparent)",
        boxShadow: "0 0 20px rgba(211,161,126,0.3)",
        transformOrigin: "center top"
      }}
      initial={{ scaleY: 0, opacity: 0 }}
      whileInView={{ scaleY: 1, opacity: 1 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
    />
    
    {/* Simplified decorative elements - fewer and optimized */}
    <motion.div
      className="absolute rounded-full border border-accent/10"
      style={{
        height: `300px`,
        width: `300px`,
        top: `20%`,
        right: `5%`,
        opacity: 0.08
      }}
      initial={{ scale: 0.8, rotateX: 45, rotateY: 15 }}
      whileInView={{ scale: 1, rotateX: 0, rotateY: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
    />
    
    <motion.div
      className="absolute rounded-full border border-accent/10"
      style={{
        height: `320px`,
        width: `320px`,
        bottom: `15%`,
        left: `3%`,
        opacity: 0.12
      }}
      initial={{ scale: 0.8, rotateX: -30, rotateY: -20 }}
      whileInView={{ scale: 1, rotateX: 0, rotateY: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
    />
  </div>

  {/* Optimized accent lines - static base with animated gradient */}
  <div className="absolute top-0 left-0 w-[1px] h-full z-10">
    <div className="h-full w-full bg-gradient-to-b from-transparent via-accent/10 to-transparent"></div>
    <motion.div
      className="absolute top-0 h-[40%] w-full"
      style={{
        background: "linear-gradient(to bottom, transparent, rgba(211,161,126,0.8), transparent)",
        willChange: "transform"
      }}
      animate={{ 
        y: ["0%", "150%", "0%"]
      }}
      transition={{ 
        duration: 20, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }}
    />
  </div>

  <div className="absolute top-0 right-0 w-[1px] h-full z-10">
    <div className="h-full w-full bg-gradient-to-b from-transparent via-accent/10 to-transparent"></div>
    <motion.div
      className="absolute top-[60%] h-[40%] w-full"
      style={{
        background: "linear-gradient(to bottom, transparent, rgba(211,161,126,0.8), transparent)",
        willChange: "transform"
      }}
      animate={{ 
        y: ["0%", "-150%", "0%"]
      }}
      transition={{ 
        duration: 20, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }}
    />
  </div>

  {/* Main content container with optimized layout */}
  <div className="container mx-auto px-6 md:px-24 relative z-30">
    {/* Section header with enhanced reveal animations */}
    <div className="text-center max-w-4xl mx-auto mb-32 md:mb-40">

<motion.div
  className="text-accent/90 uppercase tracking-[0.35em] text-xs font-light mb-6 relative inline-flex"
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-10%" }}
  transition={{ duration: 0.8 }}
>
  {/* Change from text-accent/90 to text-accent for better visibility */}
  <span className="text-accent font-medium">{language === 'pt' ? 'Metodologia' : 'Metodología'}</span>
  <motion.span 
    className="absolute bottom-0 left-0 h-[1px] bg-accent/40"
    initial={{ width: 0 }}
    whileInView={{ width: '100%' }}
    viewport={{ once: true, margin: "-10%" }}
    transition={{ delay: 0.5, duration: 1.2 }}
  />
</motion.div>
      
      <motion.div className="overflow-hidden">
        <motion.h2
          className="text-6xl md:text-7xl font-serif font-light text-white mb-8"
          initial={{ y: 80 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="block">{language === 'pt' ? 'Nosso Processo' : 'Nuestro Proceso'}</span>
          <span className="relative inline-block mt-2">
            {!prefersReducedMotion ? (
              <motion.span
                initial={{ filter: "blur(0px)" }}
                animate={{ filter: ["blur(0px)", "blur(2px)", "blur(0px)"] }}
                transition={{ duration: 8, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                className="bg-gradient-to-r from-white/95 via-accent/90 to-white/95 text-transparent bg-clip-text"
              >
                {language === 'pt' ? 'Criativo' : 'Creativo'}
              </motion.span>
            ) : (
              <span className="text-accent">
                {language === 'pt' ? 'Criativo' : 'Creativo'}
              </span>
            )}
            
            <motion.div
              className="absolute -bottom-4 left-0 h-[2px] w-4/5 bg-gradient-to-r from-accent via-accent/50 to-transparent"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 1.2, delay: 0.4 }}
              style={{ transformOrigin: "left" }}
            />
          </span>
        </motion.h2>
      </motion.div>

      <motion.p
        className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto font-sans leading-relaxed"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        {language === 'pt'
          ? 'Da concepção à execução, cada etapa é tratada com extremo cuidado para garantir que cada peça expresse perfeitamente a visão do cliente e os valores da nossa marca.'
          : 'De la concepción a la ejecución, cada etapa se trata con sumo cuidado para garantizar que cada pieza exprese perfectamente la visión del cliente y los valores de nuestra marca.'}
      </motion.p>
    </div>

    {/* Performance-optimized timeline */}
    <div className="relative">
      {/* Mobile timeline indicator - static with minimal animations */}
      <div className="absolute left-[27px] top-10 bottom-10 w-[2px] bg-gradient-to-b from-transparent via-accent/30 to-transparent block md:hidden"></div>
      
      {/* Process steps with performance-optimized effects */}
      {[
        {
          number: '01',
          title: { pt: 'Consulta & Briefing', es: 'Consulta & Briefing' },
          description: { pt: 'Entendemos suas necessidades, preferências e visão para o projeto. Cada detalhe é documentado para garantir alinhamento perfeito entre expectativas e resultados.', es: 'Entendemos sus necesidades, preferencias y visión para el proyecto. Cada detalle es documentado para garantizar una alineación perfecta entre expectativas y resultados.' },
          icon: 'chat-bubble',
          image: '/images/process/consultation.jpg'
        },
        {
          number: '02',
          title: { pt: 'Design & Conceito', es: 'Diseño & Concepto' },
          description: { pt: 'Criamos esboços e visualizações 3D para materializar a proposta. Nossos designers apresentam múltiplas iterações até encontrarmos o equilíbrio perfeito entre função e estética.', es: 'Creamos bocetos y visualizaciones 3D para materializar la propuesta. Nuestros diseñadores presentan múltiples iteraciones hasta encontrar el equilibrio perfecto entre función y estética.' },
          icon: 'pen-tool',
          image: '/images/process/design.jpg'
        },
        {
          number: '03',
          title: { pt: 'Produção Artesanal', es: 'Producción Artesanal' },
          description: { pt: 'Nossas mãos experientes transformam os materiais selecionados em peças únicas. Cada artesão se especializa em técnicas específicas, preservando tradições centenárias e aplicando inovações contemporâneas.', es: 'Nuestras manos expertas transforman los materiales seleccionados en piezas únicas. Cada artesano se especializa en técnicas específicas, preservando tradiciones centenarias y aplicando innovaciones contemporáneas.' },
          icon: 'hammer',
          image: '/images/process/crafting.jpg'
        },
        {
          number: '04',
          title: { pt: 'Entrega & Instalação', es: 'Entrega & Instalación' },
          description: { pt: 'Garantimos que cada detalhe seja perfeito em seu espaço final. Nossa equipe cuida pessoalmente da entrega, instalação e ajustes finais para assegurar uma integração perfeita ao ambiente.', es: 'Garantizamos que cada detalle sea perfecto en su espacio final. Nuestro equipo se encarga personalmente de la entrega, instalación y ajustes finales para asegurar una integración perfecta al ambiente.' },
          icon: 'package',
          image: '/images/process/installation.jpg'
        }
      ].map((step, index) => (
        <motion.div
          key={index}
          className={`relative mb-32 md:mb-56 last:mb-16 ${index % 2 === 0 ? 'md:ml-0' : 'md:mr-0'}`}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 1, delay: 0.1 * index }}
        >
          {/* Performance-optimized connector line */}
          {index < 3 && (
            <div className="hidden md:block absolute z-10 top-1/2 left-1/2 w-[400px] h-[2px]">
              <motion.div 
                className="w-full h-full origin-center"
                style={{
                  background: activeProcessStep === index 
                    ? "linear-gradient(to right, rgba(211,161,126,0.8), transparent)" 
                    : "linear-gradient(to right, rgba(255,255,255,0.2), transparent)",
                  transform: `translateY(-50%) rotate(${index % 2 === 0 ? '30deg' : '-30deg'})`,
                  transformOrigin: index % 2 === 0 ? "center right" : "center left",
                }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: "-15%" }}
                transition={{ duration: 0.8 }}
              />
            </div>
          )}

          {/* Optimized layout for cards */}
          <div className={`flex flex-col md:flex-row ${index % 2 === 0 ? 'md:ml-auto' : 'md:mr-auto md:flex-row-reverse'} md:w-[85%]`}>
            {/* Mobile heading (optimized) */}
            <div className="flex md:hidden items-center mb-6">
              <motion.div
                className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-serif ${activeProcessStep === index ? 'bg-accent text-black' : 'bg-white/10 text-white/90'} transition-all duration-500 mr-5`}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 400, damping: 25, delay: 0.2 + (0.1 * index) }}
              >
                {step.number}
              </motion.div>
              <h3 className={`text-2xl font-serif font-light ${activeProcessStep === index ? 'text-accent' : 'text-white'}`}>
                {step.title[language === 'pt' ? 'pt' : 'es']}
              </h3>
            </div>

            {/* Premium card with performance optimizations */}
            <motion.div 
              className={`relative bg-black/20 backdrop-blur-sm border ${activeProcessStep === index ? 'border-accent/20' : 'border-white/5'} 
                rounded-xl p-8 md:p-10 overflow-hidden md:w-[550px] transition-colors duration-500 group transform-gpu`
              }
              whileHover={{ 
                y: -8,
                transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
              }}
            >
              {/* Optimized ambient lighting effect */}
              <div 
                className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-accent/5 blur-[80px] z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
              />

              {/* Optimized step number for desktop */}
              <div className="hidden md:block">
                <motion.div
                  className={`absolute ${index % 2 === 0 ? '-left-5' : '-right-5'} -top-5 w-16 h-16 rounded-full flex items-center justify-center text-xl font-serif ${activeProcessStep === index ? 'bg-accent text-black' : 'bg-white/10 text-white/90'} transition-colors duration-500 shadow-xl z-20`}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25, delay: 0.3 }}
                >
                  {step.number}
                </motion.div>
              </div>

              {/* Optimized icon */}
              <div className="mb-8 relative z-10">
                <div
                  className={`h-20 w-20 rounded-full ${activeProcessStep === index ? 'bg-accent/20' : 'bg-white/5'} 
                    flex items-center justify-center transition-all duration-500 relative overflow-hidden`
                  }
                >
                  {/* Optimized ripple effect */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    style={{ 
                      background: "radial-gradient(circle, rgba(211,161,126,0.3) 0%, transparent 70%)",
                      borderRadius: "50%",
                      transform: "scale(0)",
                    }}
                  />

                  <svg 
                    width="32" 
                    height="32" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke={activeProcessStep === index ? "#D4B798" : "rgba(255,255,255,0.7)"} 
                    strokeWidth="1.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className="relative z-10 transition-colors duration-300"
                  >
                    {step.icon === 'chat-bubble' && (
                      <>
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                      </>
                    )}
                    {step.icon === 'pen-tool' && (
                      <>
                        <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
                        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
                        <path d="M2 2l7.586 7.586"></path>
                        <circle cx="11" cy="11" r="2"></circle>
                      </>
                    )}
                    {step.icon === 'hammer' && (
                      <>
                        <path d="M15 12l-8.5 8.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L12 9"></path>
                        <path d="M17.64 15L22 10.64"></path>
                        <path d="m20.91 11.7-1.25-1.25c-.6-.6-.93-1.4-.93-2.25v-.86L16.01 4.6a5.56 5.56 0 0 0-3.94-1.64H9l.92.82A6.18 6.18 0 0 1 12 8.4v1.56l2 2h2.47l2.26 1.91"></path>
                      </>
                    )}
                    {step.icon === 'package' && (
                      <>
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                        <polyline points="3.29 7 12 12 20.71 7"></polyline>
                        <line x1="12" y1="22" x2="12" y2="12"></line>
                      </>
                    )}
                  </svg>
                </div>
              </div>

              {/* Optimized content */}
              <div className="relative z-10">
                <h3 className={`text-2xl md:text-3xl mb-6 font-serif font-light hidden md:block ${activeProcessStep === index ? 'text-accent' : 'text-white'} transition-colors duration-500`}>
                  {step.title[language === 'pt' ? 'pt' : 'es']}
                </h3>

                <p className="text-white/70 font-sans leading-relaxed md:text-lg">
                  {step.description[language === 'pt' ? 'pt' : 'es']}
                </p>
              </div>

              {/* Optimized active indicator - reduced animations */}
              {activeProcessStep === index && (
                <>
                  <div
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent origin-left scale-x-100 transition-transform duration-500"
                  />
                  
                  <div
                    className="absolute top-0 left-0 right-0 h-[2px] bg-accent origin-right scale-x-100 transition-transform duration-500 delay-100"
                  />
                </>
              )}

              {/* Static pattern background */}
              <div 
                className="absolute inset-0 opacity-5 pointer-events-none z-0" 
                style={{
                  backgroundImage: 'url(/images/pattern-dot.svg)',
                  backgroundSize: '24px',
                }}
              />
            </motion.div>

            {/* Optimized image card with reduced 3D effects */}
            <div className={`hidden md:block md:w-[450px] ${index % 2 === 0 ? 'md:mr-12' : 'md:ml-12'} relative`}>
              <motion.div
                className="relative h-full shadow-2xl transform-gpu"
                initial={{ opacity: 0, rotateY: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, rotateY: 0, scale: 1 }}
                viewport={{ once: true, margin: "-15%" }}
                transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{
                  scale: 1.02,
                  transition: { duration: 0.5 }
                }}
                style={{ willChange: "transform, opacity" }}
              >
                {/* Optimized image reveal */}
                <motion.div 
                  className="w-full h-full overflow-hidden rounded-lg border border-white/10"
                  initial={{ clipPath: 'inset(0 0 100% 0)' }}
                  whileInView={{ clipPath: 'inset(0 0 0% 0)' }}
                  viewport={{ once: true, margin: "-15%" }}
                  transition={{ duration: 1.2, delay: 0.2, ease: [0.25, 1, 0.5, 1] }}
                >
                  <img
                    src={step.image}
                    alt={step.title[language === 'pt' ? 'pt' : 'es']}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  
                  {/* Optimized image overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-70"></div>
                  <div className="absolute inset-0 bg-accent/10 mix-blend-overlay"></div>
                  
                  {/* Simplified active indicator */}
                  {activeProcessStep === index && (
                    <div 
                      className="absolute inset-0 border-2 border-accent/40 rounded-lg"
                    />
                  )}
                </motion.div>
                
                {/* Minimal decorative elements */}
                <div 
                  className="absolute -bottom-4 -left-4 w-20 h-20 border border-accent/30 rounded-md opacity-0 group-hover:opacity-40 transition-opacity duration-500"
                />
                
                <div
                  className="absolute -top-3 -right-3 w-12 h-12 rounded-full border border-accent/20 opacity-0 group-hover:opacity-30 transition-opacity duration-500"
                />
              </motion.div>
              
              {/* Static reflection */}
              <div
                className={`absolute -bottom-10 left-10 right-10 h-16 rounded-3xl opacity-${activeProcessStep === index ? '20' : '10'} blur-xl bg-gradient-to-b from-accent/30 to-transparent transition-opacity duration-500`}
                style={{
                  transform: 'rotateX(75deg) translateZ(-10px)',
                  transformOrigin: 'bottom'
                }}
              />
            </div>
          </div>
          
          {/* Mobile active indicator - optimized */}
          {activeProcessStep === index && (
            <div
              className="absolute left-[27px] top-7 z-20 w-5 h-5 rounded-full bg-accent border-4 border-[#0C0A09] md:hidden"
            />
          )}
        </motion.div>
      ))}
    </div>
    
    {/* Optimized navigation steps */}
    <motion.div 
      className="flex justify-center mt-20"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15%" }}
      transition={{ duration: 0.8 }}
    >
      <div className="inline-flex bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-2">
        {[0, 1, 2, 3].map(step => (
          <button
            key={`step-btn-${step}`}
            className={`relative px-6 py-3 mx-1 rounded-lg text-sm ${activeProcessStep === step ? 'text-black' : 'text-white/60 hover:text-white/90'} transition duration-300`}
            onClick={() => setActiveProcessStep(step)}
          >
            {/* Simplified button indicator */}
            {activeProcessStep === step && (
              <motion.div
                className="absolute inset-0 bg-accent rounded-lg"
                layoutId="activeStepButton"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            
            <span className="relative z-10 font-medium">
              {`0${step + 1}`}
            </span>
          </button>
        ))}
      </div>
    </motion.div>
    
    {/* Optimized CTA button */}
    <motion.div
      className="mt-24 text-center"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15%" }}
      transition={{ duration: 1 }}
    >
      <Link
        to="/processo"
        className="group inline-flex items-center justify-center relative overflow-hidden"
        onMouseEnter={() => handleCtaHover(true)}
        onMouseLeave={() => handleCtaHover(false)}
      >
        <motion.div
          className="relative z-10 bg-transparent border-2 border-accent px-10 py-4 rounded-sm overflow-hidden transform-gpu"
          whileHover={{
            scale: 1.05,
            transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
          }}
        >
          <span className="relative z-20 text-white group-hover:text-black transition-colors duration-500 font-sans tracking-wide">
            {language === 'pt' ? 'Explore nosso processo em detalhes' : 'Explore nuestro proceso en detalles'}
          </span>

          {/* Optimized fill effect */}
          <motion.div
            className="absolute inset-0 bg-accent z-10"
            initial={{ scaleX: 0 }}
            whileHover={{ scaleX: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: 'left', willChange: "transform" }}
          />
        </motion.div>

        {/* Optimized icon animation */}
        <motion.div
          className="ml-3 relative z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          animate={!prefersReducedMotion ? {
            x: [0, 5, 0],
            transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          } : {}}
          style={{ willChange: "transform" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black">
            <path d="M5 12h14"></path>
            <path d="m12 5 7 7-7 7"></path>
          </svg>
        </motion.div>
      </Link>
    </motion.div>
  </div>

  {/* Performance optimizations CSS */}
  <style>{`
    .transform-gpu {
      transform: translateZ(0);
      will-change: transform;
      backface-visibility: hidden;
    }
    
    @media (prefers-reduced-motion: reduce) {
      .animate-subtle {
        animation: none !important;
        transition-duration: 0.001ms !important;
      }
    }
  `}</style>
</motion.section>
      
{/* Ultra-Premium Cinematic Testimonials Experience */}
<motion.section
  className="py-40 md:py-80 overflow-hidden relative isolate"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
  aria-labelledby="testimonials-heading"
>
  {/* Multi-layered cinematic background system with depth and atmosphere */}
  <div className="absolute inset-0 -z-10 overflow-hidden">
    {/* Base layer - optimized for performance */}
    <div className="absolute inset-0 bg-gradient-to-b from-[#0A0806] via-[#120E0A] to-[#0A0806]"></div>
    
    {/* Advanced volumetric fog with dynamic light interaction */}
    <motion.div 
      className="absolute inset-0 opacity-50"
      animate={!prefersReducedMotion ? { 
        filter: ["blur(60px)", "blur(100px)", "blur(60px)"],
        opacity: [0.4, 0.6, 0.4]
      } : { opacity: 0.5, filter: "blur(80px)" }}
      transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", repeatType: "mirror" }}
      style={{
        background: "radial-gradient(ellipse at 30% 40%, rgba(211,161,126,0.18), rgba(10,8,6,0) 70%)",
        willChange: "filter, opacity"
      }}
    />
    
    {/* Secondary atmospheric layer with depth */}
    <motion.div 
      className="absolute inset-0 opacity-30"
      animate={!prefersReducedMotion ? { 
        background: [
          "radial-gradient(circle at 70% 60%, rgba(30,20,15,0.15), transparent 60%)",
          "radial-gradient(circle at 30% 40%, rgba(30,20,15,0.15), transparent 60%)",
          "radial-gradient(circle at 70% 60%, rgba(30,20,15,0.15), transparent 60%)"
        ]
      } : {}}
      transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", repeatType: "mirror" }}
    />
    
    {/* Advanced particle system with depth layers and realistic physics */}
    {!prefersReducedMotion && !isMobile && (
      <div className="absolute inset-0 mix-blend-screen pointer-events-none overflow-hidden">
        {/* Foreground particles */}
        {Array.from({length: 8}).map((_, i) => (
          <motion.div
            key={`foreground-particle-${i}`}
            className="absolute rounded-full z-20"
            initial={{
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
              opacity: 0,
              scale: 0
            }}
            animate={{
              opacity: [0, 0.7 * Math.random() + 0.2, 0],
              scale: [0, Math.random() * 0.5 + 0.2, 0],
              filter: ["blur(0px)", "blur(1px)", "blur(0px)"]
            }}
            transition={{
              duration: 8 + Math.random() * 7,
              repeat: Infinity,
              delay: Math.random() * 5,
              repeatDelay: Math.random() * 2,
              ease: "easeInOut"
            }}
            style={{
              width: `${3 + Math.random() * 4}px`,
              height: `${3 + Math.random() * 4}px`,
              background: 'radial-gradient(circle, rgba(211,161,126,1), rgba(211,161,126,0))',
              boxShadow: '0 0 15px 5px rgba(211,161,126,0.3)',
              willChange: "transform, opacity, filter"
            }}
          />
        ))}
        
        {/* Midground particles - larger, blurrier */}
        {Array.from({length: 12}).map((_, i) => (
          <motion.div
            key={`midground-particle-${i}`}
            className="absolute rounded-full z-10"
            initial={{
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
              opacity: 0,
              scale: 0
            }}
            animate={{
              opacity: [0, 0.4 * Math.random() + 0.1, 0],
              scale: [0, Math.random() * 0.8 + 0.3, 0],
              filter: ["blur(3px)", "blur(5px)", "blur(3px)"]
            }}
            transition={{
              duration: 15 + Math.random() * 20,
              repeat: Infinity,
              delay: Math.random() * 10,
              repeatDelay: Math.random() * 5,
              ease: "easeInOut"
            }}
            style={{
              width: `${5 + Math.random() * 6}px`,
              height: `${5 + Math.random() * 6}px`,
              background: 'radial-gradient(circle, rgba(211,161,126,1), rgba(211,161,126,0) 80%)',
              boxShadow: '0 0 25px 8px rgba(211,161,126,0.2)',
              willChange: "transform, opacity"
            }}
          />
        ))}
        
        {/* Background particles - largest, most blurred for depth */}
        {Array.from({length: 5}).map((_, i) => (
          <motion.div
            key={`background-particle-${i}`}
            className="absolute rounded-full z-0"
            initial={{
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
              opacity: 0,
              scale: 0
            }}
            animate={{
              opacity: [0, 0.2 * Math.random() + 0.05, 0],
              scale: [0, Math.random() * 1.5 + 1, 0],
              filter: ["blur(8px)", "blur(12px)", "blur(8px)"]
            }}
            transition={{
              duration: 25 + Math.random() * 20,
              repeat: Infinity,
              delay: Math.random() * 15,
              ease: "easeInOut"
            }}
            style={{
              width: `${15 + Math.random() * 10}px`,
              height: `${15 + Math.random() * 10}px`,
              background: 'radial-gradient(circle, rgba(211,161,126,0.5), rgba(211,161,126,0) 80%)',
              willChange: "transform, opacity"
            }}
          />
        ))}
      </div>
    )}
    
    {/* Golden ratio architectural grid system with dynamic lighting */}
    <div className="absolute inset-0 opacity-[0.03]">
      <div className="absolute top-[38.2%] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent/40 to-transparent"></div>
      <div className="absolute top-[61.8%] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent"></div>
      <motion.div 
        className="absolute left-[38.2%] top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-accent/40 to-transparent"
        animate={!prefersReducedMotion ? { 
          opacity: [0.4, 0.7, 0.4],
          filter: ["blur(0px)", "blur(1px)", "blur(0px)"]
        } : {}}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", repeatType: "mirror" }}
      />
      <motion.div 
        className="absolute left-[61.8%] top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-accent/30 to-transparent"
        animate={!prefersReducedMotion ? { 
          opacity: [0.3, 0.6, 0.3],
          filter: ["blur(0px)", "blur(1px)", "blur(0px)"]
        } : {}}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", repeatType: "mirror" }}
      />
    </div>
    
    {/* Advanced film grain with subtle motion */}
    <div 
      className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" 
      style={{ backgroundImage: 'url(/images/film-grain.webp)' }}
    ></div>
    
    {/* Dynamic atmospheric texture with parallax */}
    <motion.div
      className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
      style={{ 
        backgroundImage: 'url(/images/noise-texture.webp)', 
        backgroundSize: '400px',
        willChange: 'background-position'
      }}
      animate={!prefersReducedMotion ? { 
        backgroundPosition: ['0% 0%', '2% 1%', '0% 0%']
      } : {}}
      transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", repeatType: "mirror" }}
    />
    
    {/* Cinematic color grading overlay with subtle animation */}
    <motion.div
      className="absolute inset-0 mix-blend-multiply"
      style={{
        background: "linear-gradient(to bottom, rgba(25,18,15,0.3), rgba(18,12,10,0.4), rgba(25,18,15,0.3))"
      }}
      animate={!prefersReducedMotion ? { 
        opacity: [0.7, 0.8, 0.7]
      } : {}}
      transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", repeatType: "mirror" }}
    />
    
    {/* Dynamic light rays */}
    <motion.div 
      className="absolute top-0 left-[20%] w-[40vw] h-[100vh] opacity-10 hidden md:block" 
      style={{ 
        background: "linear-gradient(to bottom, transparent, rgba(211,161,126,0.15), transparent)",
        transform: "rotate(-45deg) translateY(-20vh)",
        filter: "blur(40px)"
      }}
      animate={!prefersReducedMotion ? {
        opacity: [0.05, 0.15, 0.05],
        filter: ["blur(30px)", "blur(50px)", "blur(30px)"]
      } : {}}
      transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
    />
    
    {/* Enhanced geometric elements */}
    <div className="absolute inset-0 z-0 opacity-30 mix-blend-overlay">
      <motion.div
        className="absolute right-[20%] top-[15%] w-[30vw] h-[30vw] max-w-[500px] max-h-[500px] rounded-full border border-accent/10"
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 0.2 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
        animate={!prefersReducedMotion ? {
          opacity: [0.15, 0.25, 0.15],
          filter: ["blur(0px)", "blur(2px)", "blur(0px)"]
        } : {}}
      />
      
      <motion.div
        className="absolute left-[15%] bottom-[20%] w-[40vw] h-[40vw] max-w-[600px] max-h-[600px]"
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 0.15 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        style={{
          borderLeft: '1px solid rgba(211,161,126,0.1)',
          borderBottom: '1px solid rgba(211,161,126,0.1)',
          borderRadius: '0 0 0 100%'
        }}
        animate={!prefersReducedMotion ? {
          opacity: [0.1, 0.2, 0.1],
          filter: ["blur(0px)", "blur(1px)", "blur(0px)"]
        } : {}}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", repeatType: "mirror" }}
      />
    </div>
  </div>

  {/* Ultra-premium content container with improved spacing and proportions */}
  <div className="container mx-auto px-6 md:px-16 relative z-10">
    {/* Enhanced header section with superior animation sequences */}
    <div className="max-w-4xl mx-auto mb-32 md:mb-48 relative">
      {/* Premium section indicator with advanced animations */}
      <motion.div
        className="relative inline-flex items-center mb-12"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Animated accent line with glow effect */}
        <motion.div 
          className="w-8 h-[1px] mr-4 relative overflow-hidden"
          initial={{ width: 0 }}
          whileInView={{ width: 32 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ delay: 0.3, duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-accent to-accent/80"></div>
          <motion.div 
            className="absolute inset-0"
            animate={!prefersReducedMotion ? {
              x: ["-100%", "100%", "-100%"],
              background: "linear-gradient(90deg, transparent, rgba(211,161,126,0.8), transparent)"
            } : {}}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 2 }}
          />
        </motion.div>
        

<div className="text-accent/90 uppercase tracking-[0.5em] text-xs font-light relative">
  {/* Add font-medium class and change to text-accent for better visibility */}
  <span className="text-accent font-medium">{language === 'pt' ? '04 — Reflexos de Excelência' : '04 — Reflejos de Excelencia'}</span>
  <motion.span 
    className="absolute bottom-[-4px] left-0 h-[1px] bg-gradient-to-r from-accent/40 to-transparent"
    initial={{ scaleX: 0 }}
    whileInView={{ scaleX: 1 }}
    viewport={{ once: true, margin: "-10%" }}
    transition={{ delay: 0.8, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
    style={{ transformOrigin: 'left' }}
  />
</div>
      </motion.div>
      


<motion.h2 
  className="text-5xl md:text-7xl xl:text-8xl font-serif font-light text-white leading-[1.1] tracking-tight"
  id="testimonials-heading"
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  viewport={{ once: true, margin: "-10%" }}
  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
>
  <div className="overflow-hidden">
    <motion.span
      className="inline-block"
      initial={{ y: 150 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 1.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Enhanced visibility with text-white and drop-shadow */}
      <span className="text-white font-medium drop-shadow-lg">
        {language === 'pt' ? 'Narrativas ' : 'Narrativas '}
      </span>
    </motion.span>
  </div>
  <div className="overflow-hidden mt-2 md:mt-3">
    <motion.span
      className="inline-block"
      initial={{ y: 150 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 1.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Enhanced visibility with text-white and drop-shadow */}
      <span className="text-white font-medium drop-shadow-lg">
        {language === 'pt' ? 'autênticas' : 'auténticas'}
      </span>
      
      {/* Keep the animated underline */}
      <motion.div
        className="absolute left-0 right-0 h-[3px] overflow-hidden"
        initial={{ scaleY: 0, y: 10 }}
        whileInView={{ scaleY: 1, y: 4 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.8, delay: 1.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="h-full w-full bg-gradient-to-r from-transparent via-accent to-transparent"></div>
        <motion.div
          className="absolute inset-0"
          animate={!prefersReducedMotion ? {
            x: ["-100%", "100%"],
            background: "linear-gradient(90deg, transparent, rgba(211,161,126,0.8), transparent)"
          } : {}}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", repeatDelay: 3 }}
        />
      </motion.div>
    </motion.span>
  </div>
</motion.h2>    
      {/* Enhanced description with superior typography and reveal animation */}
      <motion.p
        className="text-white/70 text-lg md:text-xl max-w-2xl mt-12 leading-relaxed font-light relative"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Character reveal animation for premium effect */}
        {(language === 'pt'
          ? 'Conheça a experiência de clientes cuja visão foi transformada em realidade através de nosso design exclusivo e artesanato excepcional.'
          : 'Conozca la experiencia de clientes cuya visión se transformó en realidad a través de nuestro diseño exclusivo y artesanía excepcional.'
        ).split('').map((char, i) => (
          <motion.span
            key={`char-${i}`}
            initial={{ opacity: 0, filter: "blur(2px)" }}
            whileInView={{ opacity: 1, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ 
              duration: 0.03, 
              delay: 1.2 + (i * 0.01),
              ease: "easeOut"
            }}
          >
            {char}
          </motion.span>
        ))}
        
        {/* Subtle accent line */}
        <motion.div
          className="absolute -bottom-8 left-0 h-[1px] bg-accent/20"
          initial={{ width: 0 }}
          whileInView={{ width: 80 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.8, delay: 2, ease: [0.16, 1, 0.3, 1] }}
        />
      </motion.p>
    </div>

    {/* Ultra-premium testimonial carousel with advanced 3D and lighting effects */}
    <div className="relative perspective-[2500px] mb-32 md:mb-48">
      {/* Premium 3D scene container with advanced lighting */}
      <motion.div
        className="absolute -inset-[40%] opacity-20 transform-gpu"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
        style={{
          background: "radial-gradient(ellipse at center, rgba(211,161,126,0.15), transparent 70%)",
          filter: "blur(100px)",
        }}
      />

      {/* Enhanced 3D positioning controller */}
      <motion.div
        className="relative transform-gpu"
        initial={{ opacity: 0, y: 80, rotateX: 15 }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Ultra-premium carousel with advanced hardware acceleration */}
        <div 
          className="flex flex-nowrap gap-10 md:gap-16 overflow-x-auto hide-scrollbar pb-24 snap-x snap-mandatory hardware-accelerated"
          onMouseEnter={() => handleDragHover?.(true)}
          onMouseLeave={() => handleDragHover?.(false)}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={`testimonial-${index}`}
              className="min-w-[min(400px,90vw)] md:min-w-[580px] snap-start group relative"
              initial={{ opacity: 0, scale: 0.9, x: 80, rotateY: 20, z: -50 }}
              whileInView={{ opacity: 1, scale: 1, x: 0, rotateY: 0, z: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                duration: 1.5, 
                delay: 0.2 * index,
                ease: [0.16, 1, 0.3, 1]
              }}
              whileHover={{ 
                y: -20,
                z: 30,
                transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
              }}
            >
              {/* Ultra-premium testimonial card with advanced glassmorphism and lighting */}
              <div className="relative bg-gradient-to-br from-white/[0.04] to-white/[0.01] backdrop-filter backdrop-blur-xl rounded-2xl transform-gpu transition-all duration-700 shadow-[0_20px_70px_-15px_rgba(0,0,0,0.5)] overflow-hidden border border-white/10 group-hover:border-white/20">
                {/* Advanced dynamic lighting borders with premium effects */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-20">
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent/70 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-accent/70 via-transparent to-accent/70"></div>
                  <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-accent/70 via-transparent to-transparent"></div>
                  <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-transparent to-accent/70"></div>
                  
                  {/* Corner lighting effects */}
                  <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-accent/10 to-transparent rounded-tl-2xl"></div>
                  <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-accent/10 to-transparent rounded-br-2xl"></div>
                </div>
                
                {/* Ultra-premium interior lighting with advanced animation */}
                <motion.div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 z-0 transition-opacity duration-700"
                  animate={!prefersReducedMotion ? {
                    background: [
                      "radial-gradient(circle at 30% 30%, rgba(211,161,126,0.08), transparent 60%)",
                      "radial-gradient(circle at 70% 70%, rgba(211,161,126,0.08), transparent 60%)",
                      "radial-gradient(circle at 30% 30%, rgba(211,161,126,0.08), transparent 60%)"
                    ]
                  } : {}}
                  transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", repeatType: "mirror" }}
                />
                
                {/* Advanced light sweep effect with premium timing */}
                <motion.div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 z-0 transition-opacity duration-700"
                  style={{
                    background: "linear-gradient(45deg, transparent, rgba(255,255,255,0.05), transparent)",
                    backgroundSize: "200% 200%",
                    willChange: "background-position"
                  }}
                  animate={!prefersReducedMotion ? {
                    backgroundPosition: ["0% 0%", "100% 100%"]
                  } : {}}
                  transition={{ duration: 4, repeat: Infinity, ease: [0.43, 0.13, 0.23, 0.96], repeatDelay: 1 }}
                />

                {/* Premium content area with optimized layout */}
                <div className="relative z-10 p-12 md:p-14">
                  {/* Enhanced quotation mark with premium animation */}
                  <motion.div 
                    className="absolute -top-8 -left-4 text-8xl md:text-9xl font-serif text-accent/10 select-none"
                    animate={!prefersReducedMotion ? { 
                      scale: [1, 1.05, 1],
                      opacity: [0.08, 0.14, 0.08],
                      x: [0, -5, 0],
                      filter: ["blur(0px)", "blur(1px)", "blur(0px)"]
                    } : {}}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", repeatType: "mirror" }}
                  >
                    "
                  </motion.div>
                  
                  {/* Ultra-premium testimonial text with optimized reveal animation */}
                  <motion.div
                    className="mb-16 min-h-[180px] relative"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                  >
                    <p className="text-white/90 text-lg md:text-xl font-serif italic leading-relaxed">
                      {/* Premium sentence-based reveal for superior reading experience */}
                      {testimonial.quote[language === 'pt' ? 'pt' : 'es']
                        .split('. ')
                        .map((sentence, i) => (
                          <motion.span
                            key={i} 
                            className="inline"
                            initial={{ opacity: 0, y: 15, filter: "blur(5px)" }}
                            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            viewport={{ once: true }}
                            transition={{ 
                              duration: 0.8, 
                              delay: 0.6 + (i * 0.2),
                              ease: [0.16, 1, 0.3, 1]
                            }}
                          >
                            {sentence}{i < testimonial.quote[language === 'pt' ? 'pt' : 'es'].split('. ').length - 1 ? '. ' : ''}
                          </motion.span>
                        ))}
                    </p>
                  </motion.div>
                  
                  {/* Enhanced decorative separator with premium animation */}
                  <motion.div 
                    className="relative h-[1px] w-20 my-10 overflow-hidden"
                    initial={{ width: 0 }}
                    whileInView={{ width: 80 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.9 + (index * 0.1), ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-accent/40 via-accent/60 to-accent/40"></div>
                    <motion.div 
                      className="absolute inset-0"
                      animate={!prefersReducedMotion ? {
                        x: ["-100%", "100%"],
                        background: "linear-gradient(90deg, transparent, rgba(211,161,126,0.8), transparent)"
                      } : {}}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", repeatDelay: 2 }}
                    />
                  </motion.div>
                  
                  {/* Ultra-premium client profile with enhanced animations */}
                  <motion.div 
                    className="flex items-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {/* Premium avatar treatment with advanced hover effects */}
                    <div className="relative mr-6">
                      <motion.div 
                        className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden transform-gpu"
                        initial={{ borderColor: "rgba(255,255,255,0.1)", boxShadow: "0 0 0 2px rgba(255,255,255,0.1)" }}
                        whileHover={{ 
                          scale: 1.05,
                          borderColor: "rgba(211,161,126,0.3)", 
                          boxShadow: "0 0 0 2px rgba(211,161,126,0.3), 0 10px 20px -5px rgba(0,0,0,0.3)"
                        }}
                        style={{ borderWidth: "2px", borderStyle: "solid" }}
                        transition={{ duration: 0.4 }}
                      >
                        <div className="relative w-full h-full">
                          <motion.div
                            className="w-full h-full overflow-hidden rounded-full"
                            initial={{ scale: 1.2 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
                          >
                            <motion.img 
                              src={testimonial.image}
                              alt={testimonial.name}
                              className="w-full h-full object-cover"
                              initial={{ filter: "saturate(0) brightness(0.8)" }}
                              whileInView={{ filter: "saturate(1) brightness(1)" }}
                              viewport={{ once: true }}
                              transition={{ duration: 2 }}
                              style={{ willChange: "filter" }}
                            />
                          </motion.div>
                          
                          {/* Premium light sweep effect on hover */}
                          <motion.div 
                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                            style={{ 
                              background: "linear-gradient(45deg, transparent, rgba(255,255,255,0.15), transparent)",
                              backgroundSize: "200% 200%",
                              willChange: "background-position"
                            }}
                            animate={!prefersReducedMotion ? {
                              backgroundPosition: ["0% 0%", "200% 200%"]
                            } : {}}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.5 }}
                          />
                        </div>
                      </motion.div>
                      
                      {/* Enhanced verification badge with premium animations */}
                      <motion.div
                        className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-accent shadow-lg shadow-accent/30 flex items-center justify-center"
                        initial={{ scale: 0, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ 
                          type: "spring",
                          stiffness: 400,
                          damping: 20,
                          delay: 1.3 + (index * 0.1)
                        }}
                        whileHover={{ scale: 1.1 }}
                      >
                        <motion.div
                          initial={{ scale: 0.8 }}
                          animate={{ scale: [0.8, 1, 0.8] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-black">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </motion.div>
                      </motion.div>
                    </div>
                    
                    {/* Enhanced client information with refined typography */}
                    <div className="transform-gpu">
                      <h4 className="text-white text-xl md:text-2xl font-serif mb-1 relative inline-flex flex-col overflow-hidden">
                        <motion.span
                          initial={{ y: 40 }}
                          whileInView={{ y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: 1.3, ease: [0.16, 1, 0.3, 1] }}
                        >
                          {testimonial.name}
                        </motion.span>
                      </h4>
                      <div className="text-white/50 text-sm flex items-center overflow-hidden">
                        <motion.div
                          className="flex items-center"
                          initial={{ y: 20, opacity: 0 }}
                          whileInView={{ y: 0, opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: 1.5, ease: [0.16, 1, 0.3, 1] }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mr-1.5">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                          </svg>
                          {testimonial.title}
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                </div>
                
                {/* Premium background pattern with subtle animation */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay">
                  <motion.div 
                    className="h-full w-full"
                    style={{ 
                      backgroundImage: 'url(/images/subtle-pattern.webp)',
                      backgroundSize: '300px',
                      willChange: 'background-position'
                    }}
                    animate={!prefersReducedMotion ? { 
                      backgroundPosition: ['0% 0%', '1% 1%', '0% 0%']
                    } : {}}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>
              </div>
              
              {/* Premium 3D reflection with advanced physical properties */}
              <motion.div
                className="absolute -bottom-16 left-8 right-8 h-28 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-700 transform-gpu"
                style={{
                  background: "linear-gradient(to bottom, rgba(211,161,126,0.3), transparent 70%)",
                  transform: "rotateX(85deg) scaleY(0.25)",
                  transformOrigin: "center bottom",
                  willChange: "opacity"
                }}
                animate={!prefersReducedMotion ? {
                  opacity: [0, 0.15, 0],
                  filter: ["blur(10px)", "blur(15px)", "blur(10px)"]
                } : {}}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", repeatType: "mirror" }}
              />
              
              {/* Interactive particles that appear on hover */}
              <div className="absolute inset-0 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                {!prefersReducedMotion && Array(8).fill(0).map((_, i) => (
                  <motion.div
                    key={`hover-particle-${index}-${i}`}
                    className="absolute rounded-full"
                    initial={{
                      x: 0,
                      y: 0,
                      opacity: 0
                    }}
                    animate={{
                      x: [0, (Math.random() - 0.5) * 80],
                      y: [0, (Math.random() - 0.5) * 80],
                      opacity: [0, 0.5, 0],
                      scale: [0, Math.random() * 0.3 + 0.1, 0]
                    }}
                    transition={{
                      duration: 2 + Math.random() * 2,
                      repeat: Infinity,
                      delay: Math.random() * 0.5,
                      repeatDelay: Math.random()
                    }}
                    style={{
                      left: `${20 + Math.random() * 60}%`,
                      top: `${20 + Math.random() * 60}%`,
                      width: `${2 + Math.random() * 2}px`,
                      height: `${2 + Math.random() * 2}px`,
                      background: 'radial-gradient(circle, rgba(211,161,126,1), rgba(211,161,126,0))',
                      boxShadow: '0 0 8px rgba(211,161,126,0.5)',
                      willChange: "transform, opacity"
                    }}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Ultra-premium navigation indicators with sophisticated interaction */}
        <div className="flex justify-center mt-12">
          <motion.div
            className="inline-flex items-center gap-2.5 py-3 px-5 bg-black/30 backdrop-filter backdrop-blur-xl rounded-full border border-white/5 shadow-lg shadow-black/20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            {testimonials.map((_, index) => (
              <motion.button
                key={`nav-dot-${index}`}
                className={`relative transition-all duration-500 ease-out rounded-full`}
                style={{
                  width: index === 0 ? 40 : 10,
                  height: 10,
                  backgroundColor: index === 0 ? 'rgba(211,161,126,1)' : 'rgba(255,255,255,0.2)'
                }}
                whileHover={{ 
                  scale: 1.2,
                  backgroundColor: index === 0 ? 'rgba(211,161,126,1)' : 'rgba(255,255,255,0.4)'
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.3 }}
                aria-label={`View testimonial ${index + 1}`}
              >
                {index === 0 && (
                  <motion.div 
                    className="absolute inset-0 rounded-full"
                    animate={{ 
                      boxShadow: ["0 0 0 0 rgba(211,161,126,0)", "0 0 0 4px rgba(211,161,126,0.3)", "0 0 0 0 rgba(211,161,126,0)"]
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                  />
                )}
              </motion.button>
            ))}
          </motion.div>
        </div>
        
        {/* Subtle drag indicator */}
        {!isMobile && (
          <motion.div
            className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-white/30 text-xs uppercase tracking-[0.2em] flex items-center gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.8 }}
          >
            <motion.div
              animate={{ x: [-3, 3, -3] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
              </svg>
            </motion.div>
            <span>Deslize</span>
          </motion.div>
        )}
      </motion.div>
    </div>
    
    {/* Ultra-premium Call to Action with innovative liquid effects */}
    <motion.div
      className="text-center"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        to="/depoimentos"
        className="group relative inline-flex items-center overflow-hidden"
        onMouseEnter={() => setCursorVariant ? setCursorVariant('link') : null}
        onMouseLeave={() => setCursorVariant ? setCursorVariant('default') : null}
        aria-label={language === 'pt' ? 'Ver todos os depoimentos' : 'Ver todos los testimonios'}
      >
        {/* Premium button container with enhanced effects */}
        <motion.div
          className="relative z-10 bg-transparent border-2 border-accent/90 px-14 py-5 text-white font-sans font-light tracking-wider overflow-hidden rounded-sm shadow-[0_10px_30px_-15px_rgba(211,161,126,0.3)]"
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0 15px 40px -15px rgba(211,161,126,0.4)"
          }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Premium label with color transition */}
          <span className="relative z-10 group-hover:text-black transition-colors duration-500 text-lg">
            {language === 'pt' ? 'Ver todos os depoimentos' : 'Ver todos los testimonios'}
          </span>
          
          {/* Advanced liquid fill effect */}
          <motion.div
            className="absolute inset-0 bg-accent z-0 rounded-sm"
            initial={{ y: "100%" }}
            whileHover={{ y: "0%" }}
            transition={{ 
              duration: 0.6, 
              ease: [0.43, 0.13, 0.23, 0.96]
            }}
            style={{ 
              transformOrigin: "center bottom",
              willChange: "transform" 
            }}
          />
          
          {/* Premium wave effect at fill boundary */}
          <motion.div 
            className="absolute left-0 right-0 h-6 z-0 opacity-0 group-hover:opacity-100"
            style={{
              top: 0,
              background: "url(/images/wave-pattern.svg)",
              backgroundSize: "40px 10px",
              backgroundRepeat: "repeat-x"
            }}
            animate={!prefersReducedMotion ? { 
              x: ["-100%", "0%"],
              y: ["100%", "0%"]
            } : {}}
            transition={{ duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }}
          />
          
          {/* Light shine effect */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 z-0 transition-opacity duration-500"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
              backgroundSize: "200% 100%",
              willChange: "background-position"
            }}
            animate={!prefersReducedMotion ? {
              backgroundPosition: ["0% 0%", "200% 0%"] 
            } : {}}
            transition={{ duration: 1.2, ease: "easeInOut", delay: 0.1, repeat: Infinity, repeatDelay: 2 }}
          />
        </motion.div>
        
        {/* Premium icon animation with enhanced timing */}
        <div className="absolute right-10 opacity-0 group-hover:opacity-100 z-20 transition-all duration-500">
          <motion.div
            animate={!prefersReducedMotion ? {
              x: [0, 8, 0],
              scale: [1, 1.2, 1],
              filter: ["drop-shadow(0 0 0 rgba(0,0,0,0))", "drop-shadow(0 0 5px rgba(0,0,0,0.3))", "drop-shadow(0 0 0 rgba(0,0,0,0))"]
            } : {}}
            transition={{ 
              repeat: Infinity, 
              duration: 2.5,
              ease: [0.76, 0, 0.24, 1] 
            }}
            style={{ willChange: "transform, filter" }}
          >
            <ArrowRight size={20} className="text-black" />
          </motion.div>
        </div>
        
        {/* Premium ripple effect on click */}
        <div className="absolute inset-0 overflow-hidden rounded-sm pointer-events-none">
          <motion.div 
            className="absolute bg-white/20 rounded-full"
            style={{
              width: 20,
              height: 20,
              x: "-50%",
              y: "-50%",
              top: "var(--y, 50%)",
              left: "var(--x, 50%)",
              willChange: "transform"
            }}
            variants={{
              idle: { scale: 0, opacity: 0 },
              active: { scale: 15, opacity: 0, transition: { duration: 1 } }
            }}
            initial="idle"
            whileTap="active"
            onTap={(event) => {
              const button = event.target as HTMLDivElement;
              const rect = button.getBoundingClientRect();
              button.style.setProperty('--x', `${event.clientX - rect.left}px`);
              button.style.setProperty('--y', `${event.clientY - rect.top}px`);
            }}
          />
        </div>
      </Link>
      
      {/* Premium indicator dots */}
      <motion.div
        className="flex justify-center gap-1.5 mt-6"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        {[0, 1, 2].map(i => (
          <motion.div
            key={`dot-${i}`}
            className={`w-1.5 h-1.5 rounded-full ${i === 1 ? 'bg-accent/80' : 'bg-white/20'}`}
            animate={i === 1 && !prefersReducedMotion ? {
              scale: [1, 1.5, 1],
              opacity: [0.8, 1, 0.8]
            } : {}}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", repeatType: "mirror" }}
          />
        ))}
      </motion.div>
    </motion.div>
  </div>

  {/* Enhanced ambient edge lighting with parallax depth */}
  <motion.div 
    className="absolute -bottom-40 left-0 right-0 h-80 z-0 opacity-20"
    style={{
      background: "radial-gradient(ellipse at center, rgba(211,161,126,0.3), transparent 70%)",
      filter: "blur(80px)"
    }}
    animate={!prefersReducedMotion ? {
      opacity: [0.15, 0.25, 0.15]
    } : {}}
    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", repeatType: "mirror" }}
  />

  {/* Premium light rays */}
  <div className="absolute left-0 inset-y-0 w-[2px] h-full z-10 overflow-hidden">
    <motion.div
      className="h-[40%] w-full rounded-full"
      style={{
        background: "linear-gradient(to bottom, transparent, rgba(211,161,126,0.9) 50%, transparent)",
        filter: "blur(1px)",
        willChange: "transform, opacity"
      }}
      animate={!prefersReducedMotion ? {
        y: ["-100%", "200%"],
        opacity: [0.2, 0.8, 0.2],
        filter: ["blur(2px)", "blur(0.5px)", "blur(2px)"]
      } : {}}
      transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
    />
  </div>
  
  <div className="absolute right-0 inset-y-0 w-[2px] h-full z-10 overflow-hidden">
    <motion.div
      className="h-[40%] w-full rounded-full"
      style={{
        background: "linear-gradient(to bottom, transparent, rgba(211,161,126,0.9) 50%, transparent)",
        filter: "blur(1px)",
        willChange: "transform, opacity"
      }}
      animate={!prefersReducedMotion ? {
        y: ["100%", "-100%"],
        opacity: [0.2, 0.8, 0.2],
        filter: ["blur(2px)", "blur(0.5px)", "blur(2px)"]
      } : {}}
      transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
    />
  </div>

  {/* Essential performance and accessibility optimizations */}
  <style>{`
   
  `}</style>
</motion.section>

        {/* Premium Contact Section */}
        <motion.section
          ref={contactRef}
          className="py-40 md:py-64 overflow-hidden relative bg-gradient-to-b from-[#181617] via-[#23201C] to-[#1a1713]"
          onViewportEnter={() => setIsInView({ ...isInView, contact: true })}
        >
          {/* Dynamic background with layered gradients */}
          <motion.div
            className="absolute inset-0 z-0"
            style={{
              background: 'radial-gradient(circle at 30% 40%, rgba(0,0,0,0.8), rgba(0,0,0,0.95))',
              y: useTransform(scrollY, [0, 1000], ['0%', '5%'])
            }}
          />

          <motion.div
            className="absolute inset-0 z-1 opacity-10"
            style={{
              backgroundImage: 'url(/images/texture-pattern.png)',
              backgroundSize: '200px',
              y: useTransform(scrollY, [0, 500], ['0%', '-5%'])
            }}
          />

          {/* Accent elements with parallax */}
          <motion.div
            className="absolute top-[10%] right-[5%] w-[300px] h-[300px] opacity-5 hidden lg:block"
            initial={{ opacity: 0, rotate: 25 }}
            whileInView={{ opacity: 0.05, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
            style={{
              y: useTransform(scrollY, [0, 500], ['0%', '-10%'])
            }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="50" cy="50" r="48" stroke="white" strokeWidth="0.2" fill="none" />
              <circle cx="50" cy="50" r="30" stroke="white" strokeWidth="0.1" fill="none" />
            </svg>
          </motion.div>

          <div className="container relative z-10 mx-auto px-6 md:px-20">
            <div className="grid grid-cols-12 gap-y-20 md:gap-x-20">
              {/* Form column */}
              <motion.div
                className="col-span-12 md:col-span-7"
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="bg-white/[0.07] backdrop-filter backdrop-blur-[8px] p-10 md:p-14 relative border border-white/10 rounded-2xl shadow-lg">
                  <div className="text-accent uppercase tracking-[0.25em] text-xs font-medium mb-6">
                    {language === 'pt' ? '05 — Contato' : '05 — Contacto'}
                  </div>

                  <h2 className="text-4xl md:text-5xl font-serif leading-[1.1] mb-8 tracking-tight text-white">
                    <div className="overflow-hidden">
                      <motion.div
                        initial={{ y: 80 }}
                        whileInView={{ y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                      >
                        {language === 'pt' ? 'Vamos conversar sobre' : 'Hablemos sobre'}
                      </motion.div>
                    </div>
                    <div className="overflow-hidden">
                      <motion.div
                        initial={{ y: 80 }}
                        whileInView={{ y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                      >
                        {language === 'pt' ? 'seu próximo projeto' : 'su próximo proyecto'}
                      </motion.div>
                    </div>
                  </h2>

                  <motion.div
                    className="h-[2.5px] w-32 bg-accent mb-12 rounded-full shadow-md"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    style={{ transformOrigin: "left" }}
                  />

                  {/* Premium Contact Form */}
                  <motion.form
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="space-y-8"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-white/70 text-sm block">
                          {language === 'pt' ? 'Nome' : 'Nombre'}
                        </label>
                        <input
                          type="text"
                          className="w-full bg-white/5 backdrop-blur-sm border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-accent/50 transition-colors duration-300"
                          placeholder={language === 'pt' ? 'Seu nome' : 'Su nombre'}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-white/70 text-sm block">
                          {language === 'pt' ? 'Email' : 'Email'}
                        </label>
                        <input
                          type="email"
                          className="w-full bg-white/5 backdrop-blur-sm border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-accent/50 transition-colors duration-300"
                          placeholder={language === 'pt' ? 'Seu email' : 'Su email'}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-white/70 text-sm block">
                        {language === 'pt' ? 'Assunto' : 'Asunto'}
                      </label>
                      <select className="w-full bg-white/5 backdrop-blur-sm border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-accent/50 transition-colors duration-300 appearance-none">
                        <option value="" className="bg-neutral-900">
                          {language === 'pt' ? 'Selecione um assunto' : 'Seleccione un asunto'}
                        </option>
                        <option value="projeto" className="bg-neutral-900">
                          {language === 'pt' ? 'Novo projeto' : 'Nuevo proyecto'}
                        </option>
                        <option value="orçamento" className="bg-neutral-900">
                          {language === 'pt' ? 'Solicitar orçamento' : 'Solicitar presupuesto'}
                        </option>
                        <option value="parceria" className="bg-neutral-900">
                          {language === 'pt' ? 'Parceria' : 'Asociación'}
                        </option>
                        <option value="outro" className="bg-neutral-900">
                          {language === 'pt' ? 'Outro assunto' : 'Otro asunto'}
                        </option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-white/70 text-sm block">
                        {language === 'pt' ? 'Mensagem' : 'Mensaje'}
                      </label>
                      <textarea
                        className="w-full bg-white/5 backdrop-blur-sm border border-white/10 text-white px-4 py-3 h-36 focus:outline-none focus:border-accent/50 transition-colors duration-300 resize-none"
                        placeholder={language === 'pt' ? 'Sua mensagem' : 'Su mensaje'}
                      ></textarea>
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        className="group inline-flex items-center justify-center overflow-hidden relative"
                        onMouseEnter={() => handleCtaHover(true)}
                        onMouseLeave={() => handleCtaHover(false)}
                      >
                        <motion.div
                          className="relative z-10 bg-[#D4B798] px-10 py-4 text-black font-medium tracking-wide overflow-hidden group-hover:text-black transition-colors duration-300"
                          whileHover={{
                            scale: 1.05,
                            transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
                          }}
                        >
                          <span className="relative z-20">
                            {language === 'pt' ? 'Enviar mensagem' : 'Enviar mensaje'}
                          </span>

                          {/* Radial expansion background effect */}
                          <motion.div
                            className="absolute inset-0 z-10 bg-white/20"
                            initial={{ scale: 0, opacity: 0 }}
                            whileHover={{
                              scale: 1.5,
                              opacity: 1,
                              transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
                            }}
                            style={{ borderRadius: "50%", transformOrigin: "center" }}
                          />

                          {/* Glow effect on hover */}
                          <motion.div
                            className="absolute inset-0 z-0"
                            initial={{ boxShadow: "0 0 0 rgba(212, 183, 152, 0)" }}
                            whileHover={{
                              boxShadow: "0 0 20px rgba(212, 183, 152, 0.6)"
                            }}
                            transition={{ duration: 0.3 }}
                          />
                        </motion.div>

                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <motion.div
                            animate={{ x: [0, 5, 0] }}
                            transition={{
                              repeat: Infinity,
                              duration: 1.5,
                              ease: "easeInOut"
                            }}
                          >
                            <ArrowRight size={16} className="text-black" />
                          </motion.div>
                        </div>
                      </button>
                    </div>
                  </motion.form>
                </div>
              </motion.div>

              {/* Info column */}
              <motion.div
                className="col-span-12 md:col-span-5"
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="h-full flex flex-col">
                  <div className="bg-white/[0.06] backdrop-filter backdrop-blur-[8px] p-10 md:p-14 border border-white/10 mb-8 rounded-2xl shadow-lg">
                    <h3 className="text-white font-medium text-lg mb-8">
                      {language === 'pt' ? 'Informações de contato' : 'Información de contacto'}
                    </h3>

                    <ul className="space-y-8">
                      <motion.li
                        className="flex items-start space-x-4"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                      >
                        <div className="mt-1 w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D4B798" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                          </svg>
                        </div>
                        <div>
                          <div className="text-white/50 text-sm mb-1">
                            {language === 'pt' ? 'Endereço' : 'Dirección'}
                          </div>
                          <div className="text-white leading-relaxed">
                            Rua Augusta, 1500<br />
                            São Paulo, SP, Brasil
                          </div>
                        </div>
                      </motion.li>

                      <motion.li
                        className="flex items-start space-x-4"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                      >
                        <div className="mt-1 w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D4B798" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                          </svg>
                        </div>
                        <div>
                          <div className="text-white/50 text-sm mb-1">
                            {language === 'pt' ? 'Telefone' : 'Teléfono'}
                          </div>
                          <div className="text-white">
                            +55 (11) 3456-7890
                          </div>
                        </div>
                      </motion.li>

                      <motion.li
                        className="flex items-start space-x-4"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                      >
                        <div className="mt-1 w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D4B798" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                            <polyline points="22,6 12,13 2,6"></polyline>
                          </svg>
                        </div>
                        <div>
                          <div className="text-white/50 text-sm mb-1">
                            Email
                          </div>
                          <div className="text-white">
                            contato@afettodesign.com
                          </div>
                        </div>
                      </motion.li>
                    </ul>
                  </div>

                  {/* Working hours */}
                  <div className="bg-white/[0.06] backdrop-filter backdrop-blur-[8px] p-10 md:p-14 border border-white/10 flex-grow rounded-2xl shadow-lg">
                    <h3 className="text-white font-medium text-lg mb-8">
                      {language === 'pt' ? 'Horário de atendimento' : 'Horario de atención'}
                    </h3>

                    <ul className="space-y-4">
                      <motion.li
                        className="flex justify-between text-white/80"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.7 }}
                      >
                        <span>{language === 'pt' ? 'Segunda - Sexta' : 'Lunes - Viernes'}</span>
                        <span>9:00 - 18:00</span>
                      </motion.li>
                      <motion.li
                        className="flex justify-between text-white/80"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.8 }}
                      >
                        <span>{language === 'pt' ? 'Sábado' : 'Sábado'}</span>
                        <span>10:00 - 15:00</span>
                      </motion.li>
                      <motion.li
                        className="flex justify-between text-white/80"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.9 }}
                      >
                        <span>{language === 'pt' ? 'Domingo' : 'Domingo'}</span>
                        <span>{language === 'pt' ? 'Fechado' : 'Cerrado'}</span>
                      </motion.li>
                    </ul>

                    <motion.div
                      className="mt-12"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 1 }}
                    >
                      <div className="text-white/50 text-sm mb-3">
                        {language === 'pt' ? 'Siga-nos nas redes sociais' : 'Síganos en las redes sociales'}
                      </div>
                      <div className="flex space-x-4">
                        {['instagram', 'facebook', 'pinterest', 'linkedin'].map((social, idx) => (
                          <motion.a
                            key={social}
                            href={`https://${social}.com`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-[#D4B798] hover:border-[#D4B798] transition-colors duration-300"
                            whileHover={{
                              scale: 1.2,
                              backgroundColor: 'rgba(212, 183, 152, 0.1)',
                              transition: { duration: 0.3 }
                            }}
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: 1 + (idx * 0.1) }}
                          >
                            <Icon name={social} size={16} />
                          </motion.a>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Subtle overlay pattern */}
          <div className="absolute inset-0 bg-black/40 z-1 pointer-events-none opacity-40 mix-blend-overlay rounded-t-3xl"
            style={{
              backgroundImage: 'url(/images/noise-pattern.png)',
              backgroundSize: '120px 120px'
            }}
          />
        </motion.section>

        {/* Elegant Footer with Parallax Effect */}
        <motion.footer
          className="relative bg-neutral-900 overflow-hidden rounded-t-3xl shadow-2xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Parallax background */}
          <motion.div
            className="absolute inset-0 z-0 opacity-20"
            style={{
              y: useTransform(scrollY, [0, 1000], ['0%', '10%'])
            }}
          >
            <img
              src="/images/footer-background.jpg"
              alt="Footer background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/70 to-transparent"></div>
          </motion.div>

          {/* Top border accent */}
          <div className="relative z-10 border-t-2 border-[#D4B798]/40 w-full"></div>

          {/* Main footer content */}
          <div className="container mx-auto px-6 md:px-20 relative z-10 py-20 md:py-28">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-14 md:gap-10">
              {/* Brand column */}
              <div className="md:col-span-4">
                <Link to="/" className="inline-block mb-6">
                  <div className="flex items-center">
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
                      <path
                        d="M30 12H60"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M30 18H50"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="ml-3 font-serif tracking-wider text-xl text-white">afetto</span>
                  </div>
                </Link>

                <p className="text-white/60 mb-8 leading-relaxed">
                  {language === 'pt'
                    ? 'Criando experiências de design excepcionais, onde cada peça conta uma história única de artesanato e inovação.'
                    : 'Creando experiencias de diseño excepcionales, donde cada pieza cuenta una historia única de artesanía e innovación.'}
                </p>

                {/* Social media links */}
                <div className="flex space-x-4">
                  {['instagram', 'facebook', 'pinterest', 'linkedin'].map((social) => (
                    <motion.a
                      key={social}
                      href={`https://${social}.com`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-[#D4B798] hover:border-[#D4B798] transition-colors duration-300"
                      whileHover={{
                        scale: 1.2,
                        backgroundColor: 'rgba(212, 183, 152, 0.1)',
                        transition: { duration: 0.3 }
                      }}
                    >
                      <Icon name={social} size={16} />
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* Navigation links */}
              <div className="md:col-span-2">
                <h3 className="text-white font-medium tracking-wider uppercase text-sm mb-6">{language === 'pt' ? 'Links' : 'Enlaces'}</h3>
                <ul className="space-y-4">
                  {[
                    { label: { pt: 'Início', es: 'Inicio' }, path: '/' },
                    { label: { pt: 'Projetos', es: 'Proyectos' }, path: '/portfolio' },
                    { label: { pt: 'Sobre', es: 'Sobre' }, path: '/sobre' },
                    { label: { pt: 'Processo', es: 'Proceso' }, path: '/processo' },
                    { label: { pt: 'Contato', es: 'Contacto' }, path: '/contato' }
                  ].map((link) => (
                    <li key={link.path}>
                      <Link
                        to={link.path}
                        className="text-white/60 hover:text-[#D4B798] transition-colors duration-300 group relative"
                      >
                        <span>{link.label[language]}</span>
                        <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#D4B798] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Latest projects */}
              <div className="md:col-span-3">
                <h3 className="text-white font-medium tracking-wider uppercase text-sm mb-6">{language === 'pt' ? 'Últimos Projetos' : 'Últimos Proyectos'}</h3>
                <div className="grid grid-cols-2 gap-3">
                  {featuredProjects.slice(0, 4).map((project) => (
                    <Link key={project.id} to={`/projeto/${project.slug}`} className="block overflow-hidden">
                      <motion.div
                        className="w-full aspect-square relative"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <Plus size={20} className="text-white" />
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Contact info */}
              <div className="md:col-span-3">
                <h3 className="text-white font-medium tracking-wider uppercase text-sm mb-6">{language === 'pt' ? 'Contato' : 'Contacto'}</h3>
                <ul className="space-y-4">
                  <li className="flex items-start space-x-3">
                    <div className="mt-1 text-[#D4B798]">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                    </div>
                    <span className="text-white/60">
                      Rua Augusta, 1500<br />
                      São Paulo, SP, Brasil
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="mt-1 text-[#D4B798]">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                    </div>
                    <span className="text-white/60">+55 (11) 3456-7890</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="mt-1 text-[#D4B798]">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                      </svg>
                    </div>
                    <span className="text-white/60">contato@afettodesign.com</span>
                  </li>
                </ul>

                {/* Newsletter subscription */}
                <div className="mt-8">
                  <h4 className="text-white text-sm mb-4">{language === 'pt' ? 'Assine nossa newsletter' : 'Suscríbase a nuestro boletín'}</h4>
                  <div className="flex">
                    <input
                      type="email"
                      placeholder={language === 'pt' ? 'Seu email' : 'Su email'}
                      className="bg-white/10 border border-white/20 text-white px-4 py-2 flex-grow focus:outline-none focus:border-[#D4B798]"
                    />
                    <button className="bg-[#D4B798] px-4 text-black font-medium hover:bg-[#D4B798]/90 transition-colors duration-300">
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Copyright section */}
            <div className="mt-20 pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
              <div className="text-white/40 text-sm mb-4 md:mb-0">
                © {new Date().getFullYear()} Afetto Design. {language === 'pt' ? 'Todos os direitos reservados.' : 'Todos los derechos reservados.'}
              </div>
              <div className="text-white/40 text-sm">
                <Link to="/privacidade" className="hover:text-[#D4B798] transition-colors duration-300 mr-6">
                  {language === 'pt' ? 'Política de Privacidade' : 'Política de Privacidad'}
                </Link>
                <Link to="/termos" className="hover:text-[#D4B798] transition-colors duration-300">
                  {language === 'pt' ? 'Termos de Uso' : 'Términos de Uso'}
                </Link>
              </div>
            </div>
          </div>
        </motion.footer>

        {/* Botão CTA Premium */}
        <Link
          to="/contato"
          className="group relative overflow-hidden inline-flex items-center justify-center"
          onMouseEnter={() => handleCtaHover(true)}
          onMouseLeave={() => handleCtaHover(false)}
        >
          <motion.div
            className="relative z-10 bg-accent px-10 py-4 text-black font-sans font-medium tracking-wider overflow-hidden"
            whileHover={{
              scale: 1.02,
              transition: { duration: 0.3 }
            }}
          >
            <span className="relative z-20">
              {language === 'pt' ? 'Comece seu projeto' : 'Comience su proyecto'}
            </span>

            {/* Efeito de brilho */}
            <motion.div
              className="absolute inset-0 z-10"
              initial={{ background: "linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.1) 50%, transparent 75%)", backgroundSize: "200% 200%", backgroundPosition: "0% 0%" }}
              whileHover={{
                backgroundPosition: "200% 200%"
              }}
              transition={{ duration: 1, repeat: Infinity }}
            />

            {/* Efeito de expansão radial */}
            <motion.div
              className="absolute inset-0 z-0 opacity-0 bg-white/20"
              initial={{ scale: 0, opacity: 0, x: "var(--x)", y: "var(--y)" }}
              whileHover={{
                scale: 4,
                opacity: 0.5,
              }}
              transition={{ duration: 0.4 }}
              style={{
                borderRadius: "50%",
                transformOrigin: "center",
                left: "calc(var(--x) - 50px)",
                top: "calc(var(--y) - 50px)",
                width: "100px",
                height: "100px"
              }}
            />
          </motion.div>

          {/* Ícone de seta com animação */}
          <motion.div
            className="absolute right-6 opacity-0 group-hover:opacity-100 z-20"
            initial={{ x: -10 }}
            whileHover={{ x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <ArrowRight size={16} className="text-black" />
            </motion.div>
          </motion.div>

          {/* Sombra */}
          <motion.div
            className="absolute inset-0 rounded-sm opacity-0 group-hover:opacity-100"
            initial={{ boxShadow: "0 0 0 rgba(211, 161, 126, 0)" }}
            whileHover={{
              boxShadow: "0 8px 30px rgba(211, 161, 126, 0.3)"
            }}
            transition={{ duration: 0.3 }}
          />
        </Link>
    </motion.div>
  );
}
export default Home;