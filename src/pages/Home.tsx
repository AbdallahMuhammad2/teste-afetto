import React, { useContext, useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  motion, useScroll, useTransform, AnimatePresence, useSpring,
  MotionValue, useMotionValueEvent
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
import HeroCanvas from '../components/HeroCanvas';
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
const MaterialCard = ({ material, isActive, onSelect, index, isFabric = false }) => {
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
    furniture: string;
    properties: string;
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

  // Lenis smooth scroll integration
  const lenis = useLenis();

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

  // Scroll to section with smooth animation
  const scrollToSection = useCallback((sectionRef: React.RefObject<HTMLDivElement>) => {
    if (sectionRef.current && lenis) {
      lenis.scrollTo(sectionRef.current, {
        duration: 1.2,
        easing: (t: number) => {
          return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        },
      });
    }
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
  {/* ErrorBoundary para HeroCanvas com fallback elegante */}
  <ErrorBoundary fallback={
    <div className="absolute inset-0 bg-gradient-to-r from-[#0A0806]/95 via-[#171412]/80 to-[#0B0905]/90 flex items-center justify-center">
      <div className="text-white/80 font-serif text-5xl">Objetos com significado</div>
    </div>
  }>
    <HeroCanvas scrollYProgress={heroScrollProgress} />
  </ErrorBoundary>
  
  {/* Background cinematográfico com múltiplas camadas */}
  <div className="absolute inset-0 z-0">
    <motion.div
      className="absolute inset-0"
      initial={{ scale: 1.05, filter: 'brightness(0.7)' }}
      animate={{
        scale: 1,
        filter: 'brightness(0.85)',
        transition: { duration: 5, ease: [0.22, 1, 0.36, 1] }
      }}
    >
      {/* Vídeo de fundo otimizado com preload e múltiplos formatos */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onLoadedData={handleVideoLoaded}
        className="w-full h-full object-cover"
        style={{ 
          filter: `saturate(${useTransform(heroScrollProgress, [0, 0.6], [1, 1.4]).get()})` 
        }}
      >
        <source src="/videos/luxury-atelier.webm" type="video/webm" />
        <source src="/videos/luxury-atelier.mp4" type="video/mp4" />
      </video>

      {/* Sistema de camadas de gradiente premium */}
      <div className="absolute inset-0 z-10">
        {/* Gradiente principal refinado */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0806]/95 via-[#171412]/80 to-[#0B0905]/90"></div>
        
        {/* Vinheta dinâmica que responde ao scroll */}
        <motion.div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.8) 80%)',
            opacity: useTransform(heroScrollProgress, [0, 0.3], [0.7, 0.9])
          }}
        />

        {/* Texture overlay com movimento sutil */}
        <motion.div
          className="absolute inset-0 opacity-[0.14] mix-blend-overlay"
          style={{ 
            backgroundImage: 'url(/images/noise-texture.png)', 
            backgroundSize: '200px' 
          }}
          animate={{ 
            backgroundPosition: ['0% 0%', '100% 100%'] 
          }}
          transition={{ 
            duration: 120, 
            ease: "linear", 
            repeat: Infinity, 
            repeatType: "mirror" 
          }}
        />
      </div>

      {/* Sistema de partículas premium e otimizado com Instances */}
      {!prefersReducedMotion && !isMobile && (
        <motion.div className="absolute inset-0 z-20 overflow-hidden">
          {Array(25).fill(0).map((_, i) => (
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
                opacity: [0, 0.4, 0],
                scale: [0, 1, 0],
                filter: [
                  'blur(2px) brightness(1)',
                  'blur(1px) brightness(1.5)',
                  'blur(2px) brightness(1)'
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
                background: 'radial-gradient(circle, rgba(211,161,126,0.8) 0%, rgba(211,161,126,0) 70%)',
              }}
            />
          ))}
        </motion.div>
      )}
    </motion.div>
  </div>

  {/* Grade arquitetônica com proporção áurea */}
  <div className="absolute inset-0 z-10 opacity-[0.03] pointer-events-none">
    <div className="grid grid-cols-12 h-full w-full">
      {Array(12).fill(0).map((_, i) => (
        <div key={`grid-col-${i}`} className="h-full border-l border-white/50 last:border-r"></div>
      ))}
      <div className="absolute top-[38.2%] left-0 right-0 h-[1px] bg-white/30"></div>
      <div className="absolute top-[61.8%] left-0 right-0 h-[1px] bg-white/20"></div>
    </div>
  </div>

  {/* Elementos geométricos decorativos com animações dinâmicas */}
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

  {/* Linhas de acento verticais com animação refinada */}
  <motion.div
    className="absolute top-[15vh] left-[10%] w-px h-[35vh] z-20"
    initial={{ scaleY: 0 }}
    animate={{ scaleY: 1 }}
    transition={{ duration: 1.8, delay: 0.8, ease: [0.32, 0.75, 0.36, 1] }}
    style={{
      transformOrigin: 'top',
      background: 'linear-gradient(to bottom, transparent, rgba(211, 161, 126, 0.7), transparent)'
    }}
  />

  <motion.div
    className="absolute bottom-[15vh] right-[10%] w-px h-[35vh] z-20"
    initial={{ scaleY: 0 }}
    animate={{ scaleY: 1 }}
    transition={{ duration: 1.8, delay: 1.2, ease: [0.32, 0.75, 0.36, 1] }}
    style={{
      transformOrigin: 'bottom',
      background: 'linear-gradient(to top, transparent, rgba(211, 161, 126, 0.7), transparent)'
    }}
  />

  {/* Conteúdo principal centralizado com layout refinado */}
  <div className="relative z-30 container mx-auto px-8 md:px-24 h-full flex items-center">
    <motion.div
      className="max-w-6xl"
      style={{ y: heroTitleY }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.3, duration: 1 } }}
    >
      {/* Tag introdutória com linha animada aprimorada */}
      <motion.p
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.6, ease: [0.32, 0.75, 0.36, 1] }}
        className="font-sans font-light text-accent tracking-[0.4em] uppercase text-sm mb-10 relative"
      >
        <span className="relative">
          {language === 'pt' ? 'Ateliê de Design & Artesanato' : 'Atelier de Diseño & Artesanía'}
          <motion.span
            className="absolute -bottom-3 left-0 h-[1px] w-full bg-accent/40"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, delay: 1.2 }}
            style={{ transformOrigin: 'left' }}
          />
        </span>
      </motion.p>

      {/* Título principal com animação sofisticada por palavra */}
      <h1 className="font-serif font-light text-7xl md:text-8xl lg:text-9xl xl:text-[12rem] leading-[1.02] tracking-[-0.03em] text-white/95 relative">
        {/* Primeira linha */}
        <div className="overflow-hidden">
          <motion.div
            initial={{ y: 150 }}
            animate={{ y: 0 }}
            transition={{ duration: 1.8, delay: 0.8, ease: [0.32, 0.75, 0.36, 1] }}
            className="relative"
            // Efeito sutil de "vida" após 7s de inatividade
            whileInView={(_, { getTransform }) => {
              // Cronometro para animação de "vida"
              setTimeout(() => {
                animate(getTransform(), {
                  x: [-4, 4, -3, 2, 0],
                  transition: { 
                    duration: 3,
                    ease: [0.32, 0.75, 0.36, 1],
                    times: [0, 0.2, 0.5, 0.8, 1] 
                  }
                });
              }, 7000);
            }}
          >
            {language === 'pt' ? 'Objetos com' : 'Objetos con'}
          </motion.div>
        </div>

        {/* Segunda linha com efeito de gradiente dinâmico */}
        <div className="overflow-hidden mt-1 md:mt-2">
          <motion.div
            initial={{ y: 150 }}
            animate={{ y: 0 }}
            transition={{ duration: 1.8, delay: 1.1, ease: [0.32, 0.75, 0.36, 1] }}
            className="relative"
            // Efeito sutil de "vida" após 10s de inatividade
            whileInView={(_, { getTransform }) => {
              // Cronometro para animação de "vida"
              setTimeout(() => {
                animate(getTransform(), {
                  x: [4, -3, 2, -1, 0],
                  transition: { 
                    duration: 3,
                    ease: [0.32, 0.75, 0.36, 1],
                    times: [0, 0.3, 0.6, 0.9, 1] 
                  }
                });
              }, 10000);
            }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white/95 to-white/80">
              {language === 'pt' ? 'significado' : 'significado'}
            </span>
          </motion.div>
        </div>
      </h1>

      {/* Subtítulo com animação refinada */}
      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 1.8, ease: [0.32, 0.75, 0.36, 1] }}
        className="text-xl md:text-2xl text-white/80 max-w-3xl font-sans font-light leading-relaxed mt-12 lg:mt-16"
      >
        {language === 'pt'
          ? 'Criamos ambientes que transcendem o ordinário, transformando experiências e elevando os sentidos através de peças artesanais meticulosamente elaboradas.'
          : 'Creamos ambientes que trascienden lo ordinario, transformando experiencias y elevando los sentidos a través de piezas artesanales meticulosamente elaboradas.'}
      </motion.p>

      {/* Grupo de CTA com design e interações premium */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 2.2, ease: [0.32, 0.75, 0.36, 1] }}
        className="mt-12 md:mt-16 flex flex-col sm:flex-row space-y-6 sm:space-y-0 sm:space-x-6"
      >
        {/* Botão primário com efeito de preenchimento avançado */}
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
            className="relative z-10 bg-transparent border-2 border-accent px-8 py-4 text-white font-sans font-light tracking-wider overflow-hidden"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3, ease: [0.32, 0.75, 0.36, 1] }}
          >
            <span className="relative z-10 group-hover:text-black transition-colors duration-500">
              {language === 'pt' ? 'Explorar nossa coleção' : 'Explorar nuestra colección'}
            </span>

            {/* Efeito de preenchimento com easing personalizado */}
            <motion.div
              className="absolute inset-0 bg-accent z-0"
              initial={{ scaleX: 0 }}
              whileHover={{ scaleX: 1 }}
              transition={{ duration: 0.4, ease: [0.32, 0.75, 0.36, 1] }}
              style={{ transformOrigin: 'left' }}
            />
          </motion.div>

          {/* Ícone com animação refinada */}
          <motion.div
            className="absolute right-6 opacity-0 group-hover:opacity-100 z-20"
            initial={{ x: -10 }}
            whileHover={{ x: 0 }}
            transition={{ duration: 0.3, ease: [0.32, 0.75, 0.36, 1] }}
          >
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ 
                repeat: Infinity, 
                duration: 1.5,
                ease: [0.32, 0.75, 0.36, 1] 
              }}
            >
              <ArrowRight size={16} className="text-black" />
            </motion.div>
          </motion.div>
        </a>

        {/* Botão secundário com estilo alternativo e animação aprimorada */}
        <motion.a
          href="#contact"
          className="group inline-flex items-center space-x-2 text-white/80 hover:text-accent transition-colors duration-300"
          whileHover={{ x: 5 }}
          transition={{ duration: 0.3, ease: [0.32, 0.75, 0.36, 1] }}
          onClick={(e) => {
            e.preventDefault();
            if (contactRef.current) {
              contactRef.current.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        >
          <span className="font-serif tracking-wide text-base">
            {language === 'pt' ? 'Agendar consulta' : 'Programar consulta'}
          </span>
          <motion.div
            animate={{
              x: [0, 5, 0],
              transition: { repeat: Infinity, duration: 2, ease: [0.32, 0.75, 0.36, 1] }
            }}
          >
            <ChevronRight size={18} />
          </motion.div>
        </motion.a>
      </motion.div>
    </motion.div>
  </div>

  {/* Indicador de scroll com animação de pulso */}
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay: 3, ease: [0.32, 0.75, 0.36, 1] }}
    className="absolute bottom-12 left-0 right-0 flex justify-center z-30"
  >
    <button
      onClick={() => {
        if (galleryRef.current) {
          galleryRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }}
      className="flex flex-col items-center text-white/60 hover:text-white/90 transition-colors duration-300 group"
      aria-label="Scroll para descobrir mais"
    >
      <span className="text-xs uppercase tracking-widest mb-4 font-sans">
        {language === 'pt' ? 'Deslize para descobrir' : 'Desplácese para descubrir'}
      </span>
      <div className="h-14 w-px bg-gradient-to-b from-transparent via-white/30 to-transparent relative">
        <motion.div
          className="absolute top-0 w-1.5 h-1.5 rounded-full bg-accent left-1/2 -translate-x-1/2"
          animate={{
            y: [0, 24, 0],
            boxShadow: [
              '0 0 0 rgba(211, 161, 126, 0)',
              '0 0 10px rgba(211, 161, 126, 0.7)',
              '0 0 0 rgba(211, 161, 126, 0)'
            ]
          }}
          transition={{
            repeat: Infinity,
            duration: 2.5,
            ease: [0.32, 0.75, 0.36, 1]
          }}
        />
      </div>
    </button>
  </motion.div>

  {/* Contador de scroll com design premium */}
  <motion.div
    className="hidden md:block absolute bottom-12 right-12 z-30 text-white/30 text-xs font-mono"
    style={{ opacity: useTransform(smoothHeroProgress, [0, 0.8], [1, 0]) }}
  >
    <motion.span className="inline-block">
      00
    </motion.span>
    <span className="mx-1">/</span>
    <motion.div
      className="inline-block"
      style={{ opacity: heroProgressHeight }}
    >
      01
    </motion.div>
  </motion.div>
</motion.section>
          {/* Featured Projects Section */}
          <FeaturedProjects
            galleryRef={galleryRef}
            setCursorVariant={setCursorVariant}
        />

        <motion.div
          className="relative mb-32 overflow-hidden rounded-2xl shadow-2xl bg-[#0C0A09]/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
        >
          {/* Textura de fundo refinada */}
          <div className="absolute inset-0 bg-[url('/images/elegant-texture.jpg')] opacity-10 mix-blend-overlay z-0"></div>

          {/* Elementos gradientes dinâmicos */}
          <motion.div
            className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-accent/5 blur-[120px] z-0"
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

          <div className="relative z-10 p-12 md:p-16 lg:p-20">
            {/* Cabeçalho da seção */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-20">
              <div>
                <motion.div
                  className="text-accent uppercase tracking-[0.35em] text-xs font-light mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  {language === 'pt' ? 'Materiais Selecionados' : 'Materiales Seleccionados'}
                </motion.div>
                <motion.h2
                  className="text-5xl md:text-6xl font-serif font-light leading-tight text-white"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.1 }}
                >
                  <span className="block">{language === 'pt' ? 'Biblioteca de' : 'Biblioteca de'}</span>
                  <span className="text-6xl md:text-7xl relative">
                    {language === 'pt' ? 'Materiais Nobres' : 'Materiales Nobles'}
                    <motion.div
                      className="absolute -bottom-4 left-0 h-[1.5px] w-40 bg-gradient-to-r from-accent via-accent/50 to-transparent"
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, delay: 0.4 }}
                      style={{ transformOrigin: "left" }}
                    />
                  </span>
                </motion.h2>
              </div>

              <motion.p
                className="text-white/70 md:max-w-md mt-10 md:mt-0 text-sm md:text-base leading-relaxed font-sans"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                {language === 'pt'
                  ? 'Cada material é cuidadosamente selecionado e utilizado com precisão artesanal para criar móveis que transcendem gerações, combinando beleza atemporal e durabilidade excepcional.'
                  : 'Cada material es cuidadosamente seleccionado y utilizado con precisión artesanal para crear muebles que trascienden generaciones, combinando belleza atemporal y durabilidad excepcional.'}
              </motion.p>
            </div>

            {/* Abas de categoria de material com estilo premium */}
            <div className="mb-16">
              <motion.div
                className="flex space-x-4 overflow-x-auto hide-scrollbar pb-6 -mx-2 px-2"
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
                    className={`px-6 py-4 rounded-full whitespace-nowrap text-sm flex items-center space-x-3 ${activeCategory === index
                      ? 'bg-accent text-black font-normal shadow-lg shadow-accent/20'
                      : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/5'
                      } transition-all duration-300`}
                    onClick={() => setActiveCategory(index)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 + (index * 0.08) }}
                  >
                    <span className="w-4 h-4 flex items-center justify-center">
                      <MaterialIcon type={category.icon} active={activeCategory === index} />
                    </span>
                    <span className="font-sans tracking-wide">{category.label[language === 'pt' ? 'pt' : 'es']}</span>
                  </motion.button>
                ))}
              </motion.div>
            </div>

            {/* Layout aprimorado: grade de materiais e visualização 3D */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Visualização 3D - 7 colunas em desktop */}
              <div className="lg:col-span-7 order-1 lg:order-1">
                <motion.div
                  className="bg-black/40 rounded-xl overflow-hidden backdrop-blur-md border border-white/10 h-[550px] relative"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  <Canvas shadows camera={{ position: [0, 0, 5], fov: 40 }}>
                    <ambientLight intensity={0.5} />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1.8} castShadow />
                    <directionalLight position={[-5, 5, -5]} intensity={0.7} />
                    <ContactShadows
                      position={[0, -1.5, 0]}
                      opacity={0.7}
                      scale={10}
                      blur={2}
                      far={4}
                    />
                    <OrbitControls
                      enableZoom={false}
                      enablePan={false}
                      maxPolarAngle={Math.PI / 2}
                      minPolarAngle={Math.PI / 4}
                      autoRotate={autoRotate}
                      autoRotateSpeed={2}
                    />
                    <EnhancedMaterialShowcase
                      material={activeMaterial || allMaterials.woods[0]}
                      currentFurniture={currentFurniture}
                    />
                    <Environment preset="apartment" />
                  </Canvas>

                  {/* Controles de visualização premium */}
                  <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-4 z-10">
                    <motion.div
                      className="bg-black/70 backdrop-blur-xl px-6 py-3 rounded-full flex items-center space-x-5 border border-white/5"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <motion.button
                        className="bg-white/10 hover:bg-accent hover:text-black text-white/90 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
                        onClick={() => setAutoRotate(!autoRotate)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {autoRotate ? (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <rect x="6" y="4" width="4" height="16"></rect>
                            <rect x="14" y="4" width="4" height="16"></rect>
                          </svg>
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                            <path d="M11 8l6 4-6 4V8z"></path>
                          </svg>
                        )}
                      </motion.button>

                      <div className="h-6 w-px bg-white/10"></div>

                      <div className="flex space-x-3">
                        {furnitureLabels.map((item, idx) => (
                          <motion.button
                            key={idx}
                            onClick={() => setCurrentFurniture(idx)}
                            className={`px-4 py-2 rounded-full text-xs flex items-center space-x-2 transition-all duration-300 ${currentFurniture === idx
                                ? 'bg-accent text-black font-medium shadow-md shadow-accent/10'
                                : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
                              }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.7 + (idx * 0.1) }}
                          >
                            <span className="font-sans tracking-wide">{item[language === 'pt' ? 'pt' : 'en']}</span>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  </div>

                  {/* Sobreposição de título de material */}
                  <div className="absolute top-8 left-8 right-8 flex justify-between z-10">
                    <motion.div
                      className="bg-black/60 backdrop-blur-xl px-5 py-3 rounded-full border border-white/5"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <h3 className="text-white font-serif font-light text-lg">
                        {activeMaterial?.name || (language === 'pt' ? 'Selecione um material' : 'Seleccione un material')}
                      </h3>
                    </motion.div>

                    {activeMaterial && (
                      <motion.div
                        className="bg-accent text-black px-5 py-3 rounded-full flex items-center space-x-2 shadow-lg shadow-accent/20"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <span className="text-sm font-sans font-medium">{language === 'pt' ? 'Visualizando' : 'Visualizando'}</span>
                        <motion.div
                          className="w-2 h-2 bg-black/70 rounded-full"
                          animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.5, 1, 0.5]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity
                          }}
                        />
                      </motion.div>
                    )}
                  </div>
                </motion.div>

                {/* Descrição do material */}
                {activeMaterial && (
                  <motion.div
                    className="mt-5 bg-black/30 backdrop-blur-md p-6 rounded-lg border border-white/5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <p className="text-white/80 text-sm leading-relaxed font-sans">
                      {activeMaterial.description[language === 'pt' ? 'pt' : 'es']}
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Grade de materiais - 5 colunas em desktop */}
              <div className="lg:col-span-5 order-2 lg:order-2">
                <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 border border-white/5 h-full">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-white text-xl font-serif font-light">
                      {activeCategory === 0 && (language === 'pt' ? 'Madeiras Premium' : 'Maderas Premium')}
                      {activeCategory === 1 && (language === 'pt' ? 'Tecidos Exclusivos' : 'Tejidos Exclusivos')}
                      {activeCategory === 2 && (language === 'pt' ? 'Metais Nobres' : 'Metales Nobles')}
                      {activeCategory === 3 && (language === 'pt' ? 'Pedras Naturais' : 'Piedras Naturales')}
                      {activeCategory === 4 && (language === 'pt' ? 'Vidros Especiais' : 'Vidrios Especiales')}
                      {activeCategory === 5 && (language === 'pt' ? 'Couros Selecionados' : 'Cueros Seleccionados')}
                      {activeCategory === 6 && (language === 'pt' ? 'Acabamentos Refinados' : 'Acabados Refinados')}
                    </h3>
                    <span className="text-accent/90 text-xs px-4 py-1.5 rounded-full border border-accent/20 font-sans">
                      {activeCategory === 0 && allMaterials.woods.length}
                      {activeCategory === 1 && allMaterials.fabrics.length}
                      {activeCategory === 2 && allMaterials.metals.length}
                      {activeCategory === 3 && allMaterials.stones.length}
                      {language === 'pt' ? ' opções' : ' opciones'}
                    </span>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`category-${activeCategory}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="h-[400px] overflow-y-auto hide-scrollbar pr-2"
                    >
                      {/* Grid de cartões de material */}
                      <div className="grid grid-cols-2 gap-4">
                        {/* Materiais de madeira */}
                        {activeCategory === 0 && allMaterials.woods.map((material, idx) => (
                          <MaterialCard
                            key={material.id}
                            material={material}
                            isActive={activeMaterial?.id === material.id}
                            onSelect={() => setActiveMaterial({ ...material, furniture: material.furniture || null, properties: material.properties || null })}
                            index={idx}
                          />
                        ))}

                        {/* Materiais de tecido */}
                        {activeCategory === 1 && allMaterials.fabrics.map((material, idx) => (
                          <MaterialCard
                            key={material.id}
                            material={material}
                            isActive={activeMaterial?.id === material.id}
                            onSelect={() => setActiveMaterial(material)}
                            index={idx}
                            isFabric={true}
                          />
                        ))}

                        {/* Materiais de metal */}
                        {activeCategory === 2 && allMaterials.metals.map((material, idx) => (
                          <MaterialCard
                            key={material.id}
                            material={material}
                            isActive={activeMaterial?.id === material.id}
                            onSelect={() => setActiveMaterial(material)}
                            index={idx}
                          />
                        ))}

                        {/* Materiais de pedra */}
                        {activeCategory === 3 && allMaterials.stones.map((material, idx) => (
                          <MaterialCard
                            key={material.id}
                            material={material}
                            isActive={activeMaterial?.id === material.id}
                            onSelect={() => setActiveMaterial(material)}
                            index={idx}
                          />
                        ))}
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {/* Seção de informações do material */}
                  <motion.div
                    className="mt-8 pt-8 border-t border-white/5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {activeMaterial ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <div className="flex items-baseline justify-between mb-4">
                            <h4 className="text-accent text-xs uppercase tracking-widest font-sans">
                              {language === 'pt' ? 'Especificações' : 'Especificaciones'}
                            </h4>
                            <span className="text-white/40 text-xs font-sans">{activeMaterial.origin}</span>
                          </div>

                          <div className="space-y-5 mt-6">
                            {[
                              { name: language === 'pt' ? 'Durabilidade' : 'Durabilidad', value: activeMaterial.durability },
                              { name: language === 'pt' ? 'Manutenção' : 'Mantenimiento', value: activeMaterial.maintenance },
                              { name: language === 'pt' ? 'Sustentabilidade' : 'Sostenibilidad', value: activeMaterial.sustainability }
                            ].map((stat, i) => (
                              <div key={i}>
                                <div className="flex justify-between text-xs mb-2 font-sans">
                                  <span className="text-white/80">{stat.name}</span>
                                  <div className="flex space-x-1.5">
                                    {[1, 2, 3, 4, 5].map(dot => (
                                      <motion.div
                                        key={dot}
                                        className={`w-1.5 h-1.5 rounded-full ${dot <= stat.value ? 'bg-accent' : 'bg-white/10'}`}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.5 + (i * 0.1) + (dot * 0.05) }}
                                      />
                                    ))}
                                  </div>
                                </div>
                                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
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

                        <div>
                          <h4 className="text-accent text-xs uppercase tracking-widest font-sans mb-4">
                            {language === 'pt' ? 'Aplicações Ideais' : 'Aplicaciones Ideales'}
                          </h4>
                          <ul className="mt-4 space-y-3">
                            {activeMaterial.applications.map((app, i) => (
                              <motion.li
                                key={i}
                                className="flex items-center text-white/80 text-sm font-sans"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + (i * 0.1) }}
                              >
                                <motion.div
                                  className="w-1.5 h-1.5 rounded-full bg-accent mr-3"
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ delay: 0.4 + (i * 0.1) }}
                                />
                                {app[language === 'pt' ? 'pt' : 'en']}
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-white/60 py-6 font-sans italic">
                        {language === 'pt' ? 'Selecione um material para ver detalhes' : 'Seleccione un material para ver detalles'}
                      </div>
                    )}
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Barra de ação aprimorada */}
            <motion.div
              className="mt-16 bg-gradient-to-r from-black/50 via-black/40 to-black/30 rounded-lg backdrop-blur-xl flex flex-col sm:flex-row justify-between items-center border border-white/5 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="p-8 border-r border-white/5 flex-1">
                <h4 className="text-white text-lg font-serif font-light flex items-center">
                  <motion.div
                    className="w-5 h-5 flex items-center justify-center mr-3 text-accent"
                    animate={{ rotate: [0, 180] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 22C6.5 22 2 17.5 2 12S6.5 2 12 2s10 4.5 10-10-4.5 10-10 10z"></path>
                      <path d="M12 18c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6-6-2.7 6-6 6z"></path>
                      <path d="M12 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"></path>
                    </svg>
                  </motion.div>
                  {language === 'pt' ? 'Materiais Certificados' : 'Materiales Certificados'}
                </h4>
                <p className="text-white/70 text-sm mt-3 max-w-xl font-sans leading-relaxed">
                  {language === 'pt'
                    ? 'Trabalhamos apenas com fornecedores certificados que garantem a origem sustentável e a qualidade excepcional dos materiais.'
                    : 'Trabajamos solo con proveedores certificados que garantizan el origen sostenible y la calidad excepcional de los materiales.'}
                </p>
              </div>

              <div className="p-8 flex flex-col items-center sm:items-end">
                <div className="flex space-x-4 mb-6">
                  {[
                    { id: 'fsc', name: 'FSC Certified' },
                    { id: 'greenguard', name: 'GREENGUARD' },
                    { id: 'eco', name: 'ECO Certified' }
                  ].map((cert, idx) => (
                    <motion.div
                      key={cert.id}
                      className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center border border-white/10"
                      whileHover={{ y: -5, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + (idx * 0.1) }}
                    >
                      <img
                        src={`/images/certifications/${cert.id}.svg`}
                        alt={cert.name}
                        className="w-8 h-8 object-contain opacity-70"
                      />
                    </motion.div>
                  ))}
                </div>

                <button
                  className="bg-accent hover:bg-accent/90 px-6 py-3.5 text-black text-sm font-medium rounded-full transition-colors duration-300 flex items-center space-x-2 group shadow-lg shadow-accent/10"
                  onClick={() => scrollToSection(contactRef)}
                >
                  <span className="font-sans tracking-wide">{language === 'pt' ? 'Consultar disponibilidade' : 'Consultar disponibilidad'}</span>
                  <motion.div
                    className="transition-transform group-hover:translate-x-1"
                    animate={{ x: [0, 3, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatType: "loop" }}
                  >
                    <ChevronRight size={14} />
                  </motion.div>
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
        <motion.section
          ref={processRef}
          className="py-40 md:py-60 bg-gradient-to-b from-[#0C0A09] to-[#171413] relative overflow-hidden"
        >
          {/* Elementos de background aprimorados */}
          <motion.div
            className="absolute inset-0 opacity-5 pointer-events-none"
            style={{
              backgroundImage: 'url(/images/grid-pattern.svg)',
              backgroundSize: '50px',
            }}
          />

          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-accent/30 to-transparent opacity-50"></div>
          <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-transparent via-accent/30 to-transparent opacity-50"></div>

          {/* Elementos circulares ornamentais */}
          <motion.div
            className="absolute -top-32 -right-32 w-64 h-64 border border-accent/10 rounded-full opacity-20"
            initial={{ scale: 0.8, rotate: 45 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
          />

          <motion.div
            className="absolute -bottom-40 -left-40 w-80 h-80 border border-accent/10 rounded-full opacity-20"
            initial={{ scale: 0.8, rotate: -45 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
          />

          <div className="container mx-auto px-6 md:px-24 relative z-10">
            {/* Cabeçalho da seção */}
            <div className="text-center max-w-4xl mx-auto mb-24">
              <motion.div
                className="text-accent uppercase tracking-[0.35em] text-xs font-light mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                {language === 'pt' ? 'Metodologia' : 'Metodología'}
              </motion.div>

              <motion.h2
                className="text-5xl md:text-6xl font-serif font-light text-white mb-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
              >
                {language === 'pt' ? 'Nosso Processo Criativo' : 'Nuestro Proceso Creativo'}
              </motion.h2>

              <motion.div
                className="h-[1.5px] w-20 bg-accent mx-auto mb-12"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.4 }}
              />

              <motion.p
                className="text-white/70 text-lg max-w-2xl mx-auto font-sans leading-relaxed"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {language === 'pt'
                  ? 'Da concepção à execução, cada etapa é tratada com extremo cuidado para garantir que cada peça expresse perfeitamente a visão do cliente e os valores da nossa marca.'
                  : 'De la concepción a la ejecución, cada etapa se trata con sumo cuidado para garantizar que cada pieza exprese perfectamente la visión del cliente y los valores de nuestra marca.'}
              </motion.p>
            </div>

            {/* Etapas do processo aprimoradas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              {[
                {
                  number: '01',
                  title: { pt: 'Consulta & Briefing', es: 'Consulta & Briefing' },
                  description: { pt: 'Entendemos suas necessidades, preferências e visão para o projeto.', es: 'Entendemos sus necesidades, preferencias y visión para el proyecto.' },
                  icon: 'chat-bubble'
                },
                {
                  number: '02',
                  title: { pt: 'Design & Conceito', es: 'Diseño & Concepto' },
                  description: { pt: 'Criamos esboços e visualizações 3D para materializar a proposta.', es: 'Creamos bocetos y visualizaciones 3D para materializar la propuesta.' },
                  icon: 'pen-tool'
                },
                {
                  number: '03',
                  title: { pt: 'Produção Artesanal', es: 'Producción Artesanal' },
                  description: { pt: 'Nossas mãos experientes transformam os materiais selecionados em peças únicas.', es: 'Nuestras manos expertas transforman los materiales seleccionados en piezas únicas.' },
                  icon: 'hammer'
                },
                {
                  number: '04',
                  title: { pt: 'Entrega & Instalação', es: 'Entrega & Instalación' },
                  description: { pt: 'Garantimos que cada detalhe seja perfeito em seu espaço final.', es: 'Garantizamos que cada detalle sea perfecto en su espacio final.' },
                  icon: 'package'
                }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  className={`relative p-8 ${activeProcessStep === index ? 'bg-accent/5 border border-accent/20' : 'bg-white/5 border border-white/5'} rounded-xl backdrop-blur-sm transition-all duration-500`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.1 * index }}
                >
                  {/* Número da etapa */}
                  <motion.div
                    className={`absolute -top-5 -right-5 w-14 h-14 rounded-full flex items-center justify-center text-lg font-serif ${activeProcessStep === index ? 'bg-accent text-black' : 'bg-white/10 text-white/90'} transition-all duration-500`}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25, delay: 0.2 + (0.1 * index) }}
                  >
                    {step.number}
                  </motion.div>

                  {/* Ícone */}
                  <div className={`h-16 w-16 rounded-full ${activeProcessStep === index ? 'bg-accent/20' : 'bg-white/5'} flex items-center justify-center mb-6 transition-all duration-500`}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={activeProcessStep === index ? "#D4B798" : "rgba(255,255,255,0.7)"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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

                  {/* Título e descrição */}
                  <h3 className={`text-xl mb-4 font-serif font-light ${activeProcessStep === index ? 'text-accent' : 'text-white'} transition-colors duration-500`}>
                    {step.title[language === 'pt' ? 'pt' : 'es']}
                  </h3>

                  <p className="text-white/70 font-sans leading-relaxed">
                    {step.description[language === 'pt' ? 'pt' : 'es']}
                  </p>

                  {/* Indicador ativo */}
                  {activeProcessStep === index && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.5 }}
                      style={{ transformOrigin: 'left' }}
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      
    {/* Seção Nossa História com Design Imersivo */}
<motion.section
  ref={aboutRef}
  className="py-48 md:py-80 overflow-hidden relative"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
>
  {/* Camadas de background com efeito paralaxe profundo */}
  <div className="absolute inset-0 z-0">
    {/* Fundo base com desfoque cinético */}
    <motion.div
      className="absolute inset-0 bg-black"
      style={{ 
        y: useTransform(smoothAboutProgress, [0, 1], ['-10%', '10%']),
        scale: useTransform(smoothAboutProgress, [0, 1], [1.1, 1])
      }}
    >
      <div className="absolute inset-0 bg-black/60 mix-blend-soft-light z-10"></div>
      <motion.div
        className="absolute inset-0 z-20"
        animate={{ 
          filter: ["blur(0px)", "blur(15px)", "blur(0px)"]
        }}
        transition={{ 
          duration: 20, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      >
        <img
          src="/images/atelier-background.jpg"
          alt="Atelier background"
          className="w-full h-full object-cover"
        />
      </motion.div>
    </motion.div>
    
    {/* Sobreposição de texturas fluidas */}
    <motion.div
      className="absolute inset-0 opacity-20 mix-blend-overlay"
      style={{ 
        backgroundImage: 'url(/images/texture-pattern.png)', 
        y: useTransform(smoothAboutProgress, [0, 1], ['0%', '10%']),
      }}
    />
    
    {/* Máscara gradiente líquida animada */}
    <motion.div
      className="absolute inset-0"
      animate={{ 
        background: [
          "radial-gradient(circle at 30% 40%, rgba(20,18,15,0.3), rgba(10,8,6,0.9))",
          "radial-gradient(circle at 70% 60%, rgba(20,18,15,0.3), rgba(10,8,6,0.9))",
          "radial-gradient(circle at 30% 40%, rgba(20,18,15,0.3), rgba(10,8,6,0.9))"
        ]
      }}
      transition={{ 
        duration: 20, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }}
    />
    
    {/* Sistema de partículas douradas */}
    {!prefersReducedMotion && !isMobile && (
      <div className="absolute inset-0 z-10 overflow-hidden">
        {Array.from({length: 20}).map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute rounded-full"
            initial={{
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
              opacity: 0,
              scale: 0
            }}
            animate={{
              opacity: [0, 0.6, 0],
              scale: [0, 1, 0],
              filter: ["blur(4px)", "blur(2px)", "blur(4px)"]
            }}
            transition={{
              duration: 8 + Math.random() * 12,
              ease: "easeInOut",
              repeat: Infinity,
              delay: Math.random() * 10,
            }}
            style={{
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
              background: 'radial-gradient(circle, rgba(211,161,126,1) 0%, rgba(211,161,126,0) 70%)',
            }}
          />
        ))}
      </div>
    )}
    
    {/* Elementos geométricos flutuantes */}
    <div className="absolute inset-0 z-0 pointer-events-none">
      <motion.div
        className="absolute top-[20%] right-[10%] w-60 h-60 border border-accent/10 rounded-full"
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 0.15 }}
        viewport={{ once: true }}
        transition={{ duration: 2 }}
        style={{
          y: useTransform(smoothAboutProgress, [0, 1], ['0%', '20%']),
        }}
      />
      <motion.div
        className="absolute bottom-[10%] left-[5%] w-80 h-80 border border-accent/20 rounded-full"
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 0.1 }}
        viewport={{ once: true }}
        transition={{ duration: 2, delay: 0.3 }}
        style={{
          y: useTransform(smoothAboutProgress, [0, 1], ['20%', '0%']),
        }}
      />
    </div>
  </div>

  {/* Conteúdo principal com efeito 3D */}
  <div className="container mx-auto px-6 md:px-12 relative z-20 h-full">
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-16 lg:gap-y-0 lg:gap-x-12 items-center h-full">
      {/* Coluna de imagem cinemática com camadas 3D */}
      <motion.div
        className="col-span-1 lg:col-span-6 h-full relative perspective-1000"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Frame principal da imagem com camadas */}
        <div className="relative h-full w-full preserve-3d transform-gpu shadow-[0_35px_60px_-15px_rgba(0,0,0,0.8)]">
          {/* Camada posterior decorativa */}
          <motion.div
            className="absolute -top-8 -left-8 w-full h-full border-2 border-accent/20"
            initial={{ opacity: 0, x: -20, y: -20 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{
              transform: 'translateZ(-20px)', 
              filter: 'blur(1px)',
              transformStyle: 'preserve-3d'
            }}
          />

          {/* Container de imagem principal com efeitos */}
          <motion.div
            className="relative z-10 w-full h-full overflow-hidden"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.5 }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Imagem com animação de revelação */}
            <motion.div 
              className="absolute inset-0"
              initial={{ height: '100%' }}
              whileInView={{ height: '0%' }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: 0.2, ease: [0.83, 0, 0.17, 1] }}
              style={{ 
                background: '#0A0806',
                transformOrigin: 'top'
              }}
            />
            
            {/* Máscara de revelação visualmente impressionante */}
            <motion.div
              initial={{ clipPath: 'inset(0 0 100% 0)' }}
              whileInView={{ clipPath: 'inset(0 0 0% 0)' }}
              viewport={{ once: true }}
              transition={{ duration: 1.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="w-full h-full"
            >
              <motion.img
                src="/images/craftsman-working.jpg"
                alt="Craftsman at work"
                className="w-full h-full object-cover"
                initial={{ scale: 1.2, filter: 'saturate(0) brightness(0.8)' }}
                whileInView={{ scale: 1, filter: 'saturate(1) brightness(1)' }}
                viewport={{ once: true }}
                transition={{ duration: 3, ease: [0.22, 1, 0.36, 1] }}
              />
            </motion.div>
            
            {/* Overlay de textura sutil */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent mix-blend-overlay"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 1 }}
            />
            
            {/* Vinheta artística */}
            <div className="absolute inset-0 bg-radial-vignette pointer-events-none"></div>
          </motion.div>

          {/* Selo flutuante premium */}
          <motion.div
            className="absolute -bottom-10 -right-10 w-28 h-28 bg-accent/10 backdrop-blur-md flex items-center justify-center z-20 shadow-xl"
            initial={{ opacity: 0, scale: 0.8, rotate: 15 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 1, ease: [0.22, 1, 0.36, 1] }}
            style={{ transform: 'translateZ(30px)' }}
            whileHover={{ 
              scale: 1.1, 
              boxShadow: '0 0 30px rgba(211, 161, 126, 0.3)',
              transition: { duration: 0.5 }
            }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="w-full h-full flex items-center justify-center relative"
            >
              <svg viewBox="0 0 100 100" width="100%" height="100%">
                <path
                  d="M 50 0 A 50 50 0 1 1 49.9 0"
                  fill="none"
                  stroke="rgba(211, 161, 126, 0.8)"
                  strokeWidth="0.5"
                />
                <text
                  x="50%"
                  y="50%"
                  fontSize="7"
                  fill="rgba(211, 161, 126, 0.9)"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{ fontFamily: 'serif', letterSpacing: '1px' }}
                >
                  <textPath href="#textPath">
                    DESDE 1997 • DESDE 1997 • DESDE 1997 •
                  </textPath>
                </text>
                <path
                  id="textPath"
                  d="M 50 15 A 35 35 0 1 1 49.9 15"
                  fill="none"
                  strokeWidth="0"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.span 
                  className="text-accent font-serif text-xl"
                  animate={{ 
                    textShadow: [
                      "0 0 0px rgba(211,161,126,0)", 
                      "0 0 10px rgba(211,161,126,0.7)", 
                      "0 0 0px rgba(211,161,126,0)"
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  {language === 'pt' ? '26' : '26'}
                </motion.span>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Elemento decorativo frontal flutuante */}
          <motion.div 
            className="absolute -top-4 -right-4 w-12 h-12 border border-accent"
            initial={{ opacity: 0, x: 20, y: 20 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.8 }}
            style={{ transform: 'translateZ(40px)' }}
          />
        </div>
      </motion.div>

      {/* Coluna de conteúdo textual com camadas de vidro */}
      <motion.div
        className="col-span-1 lg:col-span-6"
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Card de conteúdo premium com glassmorphism aprimorado */}
        <div className="relative transform-gpu">
          {/* Efeito de luz abstrato */}
          <motion.div
            className="absolute -left-20 -top-20 w-40 h-40 rounded-full bg-accent/20 blur-[100px] mix-blend-screen"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Card principal com efeito de vidro premium */}
          <div className="bg-black/40 backdrop-filter backdrop-blur-2xl relative z-10 p-12 lg:p-16 border border-white/10 rounded-xl shadow-[0_35px_70px_-15px_rgba(0,0,0,0.5)] overflow-hidden">
            {/* Efeito interno de brilho */}
            <motion.div 
              className="absolute inset-0 opacity-20 bg-gradient-to-tr from-transparent via-accent/30 to-transparent z-0"
              animate={{ 
                backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"]
              }}
              transition={{ duration: 8, repeat: Infinity }}
              style={{ backgroundSize: "200% 200%" }}
            />

            {/* Numeração elegante da seção */}
            <motion.div
              className="text-accent/80 uppercase tracking-[0.5em] text-xs font-light mb-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {language === 'pt' ? '03 — Nossa História' : '03 — Nuestra Historia'}
            </motion.div>

            {/* Título principal com animação de revelação por palavra */}
            <h2 className="text-4xl md:text-6xl xl:text-7xl font-serif leading-tight mb-10 text-white relative">
              <div className="overflow-hidden">
                <motion.div
                  initial={{ y: 100 }}
                  whileInView={{ y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  {language === 'pt' ? 'Tradição e' : 'Tradición y'}
                </motion.div>
              </div>
              <div className="overflow-hidden">
                <motion.div
                  initial={{ y: 100 }}
                  whileInView={{ y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className="relative">
                    {language === 'pt' ? 'artesanato' : 'artesanía'}
                    {/* Linha decorativa animada sob o título */}
                    <motion.div 
                      className="absolute -bottom-4 left-0 h-[2px] bg-gradient-to-r from-accent via-accent/50 to-transparent"
                      initial={{ width: 0 }}
                      whileInView={{ width: '90%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </span>
                </motion.div>
              </div>
            </h2>

            {/* Descrição principal com animação de revelação por parágrafo */}
            <motion.div
              className="relative mb-14 overflow-hidden"
              initial={{ opacity: 0, height: 0 }}
              whileInView={{ opacity: 1, height: 'auto' }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-white/80 text-xl leading-relaxed mb-7 font-light">
                {language === 'pt'
                  ? 'Por mais de duas décadas, aperfeiçoamos a arte de criar mobiliário que harmoniza métodos tradicionais com design contemporâneo.'
                  : 'Por más de dos décadas, hemos perfeccionado el arte de crear mobiliario que armoniza métodos tradicionales con diseño contemporáneo.'}
              </p>
              
              <p className="text-white/70 leading-relaxed">
                {language === 'pt'
                  ? 'Cada peça que sai do nosso ateliê traz consigo nossa filosofia: objetos que não apenas ocupam espaços, mas contam histórias, evocam emoções e transformam ambientes com sua presença singular.'
                  : 'Cada pieza que sale de nuestro taller trae consigo nuestra filosofía: objetos que no solo ocupan espacios, sino que cuentan historias, evocan emociones y transforman ambientes con su presencia singular.'}
              </p>
            </motion.div>

            {/* Lista de valores com ícones animados */}
            <motion.div
              className="grid grid-cols-2 gap-8 mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 1.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {[
                {
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
                    </svg>
                  ),
                  title: language === 'pt' ? 'Materiais Nobres' : 'Materiales Nobles'
                },
                {
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 8v8m-4-4h8" />
                    </svg>
                  ),
                  title: language === 'pt' ? 'Design Original' : 'Diseño Original'
                },
                {
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                    </svg>
                  ),
                  title: language === 'pt' ? 'Artesanato Superior' : 'Artesanía Superior'
                },
                {
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  ),
                  title: language === 'pt' ? 'Durabilidade' : 'Durabilidad'
                }
              ].map((item, idx) => (
                <motion.div 
                  key={idx}
                  className="flex items-start space-x-3"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 1.5 + (idx * 0.1) }}
                  whileHover={{ 
                    x: 5, 
                    transition: { duration: 0.3 } 
                  }}
                >
                  <motion.div 
                    className="mt-1 text-accent w-8 h-8 flex items-center justify-center rounded-full bg-accent/10"
                    whileHover={{ 
                      scale: 1.1,
                      backgroundColor: "rgba(211,161,126,0.2)" 
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {item.icon}
                  </motion.div>
                  <span className="text-white text-base">{item.title}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA com efeitos visuais avançados */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 1.8 }}
              className="relative"
            >
              <Link
                to="/sobre"
                className="group inline-flex items-center justify-center overflow-hidden relative"
                onMouseEnter={() => handleCtaHover(true)}
                onMouseLeave={() => handleCtaHover(false)}
              >
                <motion.div
                  className="relative z-10 bg-transparent border-2 border-accent px-10 py-4 overflow-hidden rounded-sm"
                  whileHover={{
                    scale: 1.03,
                    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
                  }}
                >
                  <span className="relative z-20 text-white group-hover:text-black transition-colors duration-500">
                    {language === 'pt' ? 'Conheça nossa história completa' : 'Conozca nuestra historia completa'}
                  </span>

                  {/* Efeito de preenchimento */}
                  <motion.div
                    className="absolute inset-0 bg-accent z-10"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    style={{ transformOrigin: 'left' }}
                  />

                  {/* Destaque de brilho */}
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 z-0"
                    initial={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)", backgroundSize: "200% 100%", backgroundPosition: "100% 0%" }}
                    whileHover={{
                      backgroundPosition: "0% 0%",
                      transition: { duration: 1, ease: [0.22, 1, 0.36, 1] }
                    }}
                  />
                </motion.div>

                {/* Ícone com animação avançada */}
                <div className="absolute right-8 opacity-0 group-hover:opacity-100 z-20 transition-opacity duration-300">
                  <motion.div
                    animate={{ x: [0, 5, 0], scale: [1, 1.2, 1] }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 2,
                      ease: [0.22, 1, 0.36, 1] 
                    }}
                  >
                    <ArrowRight size={16} className="text-black" />
                  </motion.div>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  </div>

  {/* Decoração lateral com linhas de luz animadas */}
  <div className="absolute left-0 inset-y-0 w-px h-full z-10">
    <motion.div
      className="h-full w-full"
      style={{
        background: "linear-gradient(to bottom, transparent, rgba(211,161,126,0.8), transparent)",
        scaleY: useTransform(smoothAboutProgress, [0, 0.5, 1], [0, 1, 0]),
        opacity: useTransform(smoothAboutProgress, [0, 0.5, 1], [0, 1, 0]),
      }}
    />
  </div>
  
  <div className="absolute right-0 inset-y-0 w-px h-full z-10">
    <motion.div
      className="h-full w-full"
      style={{
        background: "linear-gradient(to bottom, transparent, rgba(211,161,126,0.8), transparent)",
        scaleY: useTransform(smoothAboutProgress, [0, 0.5, 1], [0, 1, 0]),
        opacity: useTransform(smoothAboutProgress, [0, 0.5, 1], [0, 1, 0]),
      }}
    />
  </div>

  {/* Estilos necessários para adicionar ao CSS global */}
  <style>{`
    .bg-radial-vignette {
      background: radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.3) 100%);
    }
    
    .preserve-3d {
      transform-style: preserve-3d;
    }
    
    .perspective-1000 {
      perspective: 1000px;
    }
    
    .perspective-3000 {
      perspective: 3000px;
    }
  `}</style>
</motion.section>

      {/* Seção de Depoimentos Imersiva */}
<motion.section
  className="py-32 md:py-60 overflow-hidden relative"
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  viewport={{ once: true }}
  transition={{ duration: 1.2 }}
>
  {/* Background surreal com camadas de vidro e gradientes em movimento */}
  <div className="absolute inset-0 -z-10 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-[#0B0905] via-[#171412] to-[#0F0C09]"></div>
    
    {/* Névoa animada de fundo */}
    <motion.div 
      className="absolute inset-0 opacity-40"
      animate={{ 
        filter: ["blur(30px)", "blur(50px)", "blur(30px)"],
        opacity: [0.4, 0.6, 0.4]
      }}
      transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      style={{
        background: "radial-gradient(circle at 30% 50%, rgba(211,161,126,0.3), rgba(20,18,15,0.1) 60%)"
      }}
    />
    
    {/* Esferas flutuantes tridimensionais */}
    <div className="absolute inset-0 overflow-hidden">
      {Array.from({length: 8}).map((_, i) => (
        <motion.div
          key={`sphere-${i}`}
          className="absolute rounded-full blur-md"
          initial={{
            x: `${Math.random() * 100}%`,
            y: `${Math.random() * 100}%`,
            scale: Math.random() * 0.8 + 0.2,
            opacity: Math.random() * 0.3 + 0.1
          }}
          animate={{
            x: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
            y: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
            opacity: [0.1, 0.3, 0.1],
            scale: [
              Math.random() * 0.8 + 0.2, 
              Math.random() * 1.2 + 0.6, 
              Math.random() * 0.8 + 0.2
            ],
          }}
          transition={{
            duration: 20 + Math.random() * 30,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse",
          }}
          style={{
            width: `${50 + Math.random() * 200}px`,
            height: `${50 + Math.random() * 200}px`,
            background: `radial-gradient(circle, rgba(211,161,126,${0.2 + Math.random() * 0.3}) 0%, rgba(211,161,126,0) 70%)`,
          }}
        />
      ))}
    </div>
    
    {/* Malha tridimensional futurística */}
    <div className="absolute inset-0 opacity-10">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(211,161,126,0.5)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  </div>

  {/* Conteúdo principal da seção */}
  <div className="container mx-auto px-6 md:px-12 relative z-10">
    {/* Cabeçalho da seção com animação de entrada em camadas */}
    <div className="max-w-xl mb-24 md:mb-32 relative">
      <motion.div
        className="text-accent uppercase tracking-[0.35em] text-xs font-light mb-8"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
      >
        {language === 'pt' ? '04 — Reflexos de Excelência' : '04 — Reflejos de Excelencia'}
      </motion.div>
      
      <div className="overflow-hidden relative">
        <motion.h2
          className="text-5xl md:text-7xl xl:text-8xl font-serif font-light text-white mb-6"
          initial={{ y: 150 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.span
            animate={{ 
              color: ["#ffffff", "#D3A17E", "#ffffff"],
              textShadow: [
                "0 0 15px rgba(211,161,126,0)", 
                "0 0 25px rgba(211,161,126,0.5)", 
                "0 0 15px rgba(211,161,126,0)"
              ]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          >
            {language === 'pt' ? 'Narrativas' : 'Narrativas'}
          </motion.span>{" "}
          <br />
          {language === 'pt' ? 'autênticas' : 'auténticas'}
        </motion.h2>

        {/* Linha animada que se expande */}
        <motion.div
          className="absolute -bottom-2 left-0 h-[1px] bg-gradient-to-r from-accent via-accent/50 to-transparent"
          initial={{ width: 0 }}
          whileInView={{ width: "70%" }}
          viewport={{ once: true }}
          transition={{ duration: 1.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>

    {/* Carrossel de depoimentos com efeito 3D profundo */}
    <div className="perspective-3000">
      <motion.div
        className="relative"
        initial={{ rotateX: 15, y: 100, opacity: 0 }}
        whileInView={{ rotateX: 0, y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Container de cartões em carrossel horizontal */}
        <div className="flex flex-nowrap space-x-8 overflow-x-auto hide-scrollbar pb-12 snap-x snap-mandatory">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="min-w-[350px] md:min-w-[500px] snap-start relative group"
              initial={{ opacity: 0, scale: 0.9, x: 50 }}
              whileInView={{ opacity: 1, scale: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 1.2, delay: 0.2 * index }}
              whileHover={{ 
                y: -15, 
                transition: { duration: 0.5 } 
              }}
            >
              {/* Cartão com depoimento e efeito de vidro premium */}
              <div className="relative rounded-lg overflow-hidden transform-gpu transition-all duration-700">
                {/* Fundo em vidro com reflexo dinâmico */}
                <div className="absolute inset-0 bg-white/[0.01] backdrop-blur-md border border-white/5 rounded-lg z-0 overflow-hidden">
                  <motion.div 
                    className="absolute inset-0 opacity-20"
                    style={{
                      background: "linear-gradient(120deg, transparent, rgba(255,255,255,0.2), transparent)",
                      backgroundSize: "200% 200%"
                    }}
                    animate={{
                      backgroundPosition: ["0% 0%", "100% 100%"]
                    }}
                    transition={{ 
                      duration: 3,
                      ease: "easeInOut",
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  />
                </div>

                {/* Conteúdo do cartão */}
                <div className="relative z-10 p-10 md:p-12">
                  {/* Ícone de aspas cinético */}
                  <motion.div 
                    className="absolute -top-4 -left-4 text-8xl font-serif text-accent/10 select-none"
                    animate={{ 
                      rotate: [-2, 2, -2],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{ 
                      duration: 8, 
                      repeat: Infinity, 
                      ease: "easeInOut" 
                    }}
                  >
                    "
                  </motion.div>
                  
                  {/* Texto do depoimento com efeito de revelação por palavras */}
                  <p className="text-white/90 text-lg md:text-xl mb-10 font-serif italic leading-relaxed">
                    {testimonial.quote[language].split(' ').map((word, i) => (
                      <motion.span
                        key={i} 
                        className="inline-block mr-1"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ 
                          duration: 0.6, 
                          delay: 0.5 + (i * 0.02),
                          ease: [0.22, 1, 0.36, 1]
                        }}
                      >
                        {word}
                      </motion.span>
                    ))}
                  </p>
                  
                  {/* Informações do cliente com efeitos elegantes */}
                  <div className="flex items-center mt-8">
                    {/* Moldura para foto com efeito de brilho */}
                    <div className="relative mr-6">
                      <motion.div 
                        className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden ring-2 ring-accent/20"
                        whileHover={{ 
                          scale: 1.05,
                          boxShadow: "0 0 20px rgba(211,161,126,0.4)" 
                        }}
                      >
                        <img 
                          src={testimonial.image} 
                          alt={testimonial.name}
                          className="w-full h-full object-cover" 
                        />
                        
                        {/* Brilho sofisticado sobre a imagem */}
                        <motion.div 
                          className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent"
                          animate={{
                            backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
                          }}
                          transition={{ 
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                          style={{ backgroundSize: "200% 200%" }}
                        />
                      </motion.div>
                      
                      {/* Indicador de status premium */}
                      <motion.div
                        className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-accent flex items-center justify-center"
                        animate={{ 
                          boxShadow: [
                            "0 0 0 rgba(211,161,126,0.2)",
                            "0 0 10px rgba(211,161,126,0.6)",
                            "0 0 0 rgba(211,161,126,0.2)"
                          ]
                        }}
                        transition={{ 
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <span className="text-black text-xs">✓</span>
                      </motion.div>
                    </div>
                    
                    {/* Nome e localização */}
                    <div>
                      <motion.h4
                        className="text-white text-xl font-serif mb-1"
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                      >
                        {testimonial.name}
                      </motion.h4>
                      <motion.div
                        className="text-white/50 text-sm flex items-center"
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.9 }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mr-1.5">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        {testimonial.title}
                      </motion.div>
                    </div>
                  </div>
                </div>
                
                {/* Efeitos de borda premium */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent/30 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-accent/30 via-transparent to-accent/30"></div>
                <div className="absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-accent/30 via-transparent to-transparent"></div>
                <div className="absolute top-0 right-0 h-full w-1 bg-gradient-to-b from-transparent via-transparent to-accent/30"></div>
              </div>

              {/* Reflexo 3D sob o cartão */}
              <motion.div
                className="absolute -bottom-10 left-4 right-4 h-20 rounded-lg opacity-0 group-hover:opacity-30 blur-md transition-opacity duration-700"
                style={{
                  background: "linear-gradient(to bottom, rgba(211,161,126,0.3), transparent)",
                  transform: "rotateX(60deg) scaleY(0.5)"
                }}
              />
            </motion.div>
          ))}
        </div>
        
        {/* Indicadores de scroll horizontal */}
        <div className="flex justify-center mt-12">
          <motion.div
            className="flex space-x-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            {testimonials.map((_, index) => (
              <motion.button
                key={index}
                className={`w-12 h-1 rounded-full ${index === 0 ? 'bg-accent' : 'bg-white/20'}`}
                whileHover={{ scale: 1.2, backgroundColor: 'rgba(211,161,126,0.8)' }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </motion.div>
        </div>
      </motion.div>
    </div>
    
    {/* Chamada à ação flutuante */}
    <motion.div
      className="mt-24 text-center"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1, delay: 1.2 }}
    >
      <Link
        to="/depoimentos"
        className="inline-flex items-center group relative overflow-hidden px-12 py-5"
      >
        <motion.span
          className="relative z-10 text-white group-hover:text-black transition-colors duration-500 font-medium text-lg"
          animate={{ textShadow: ["0 0 10px rgba(255,255,255,0)", "0 0 20px rgba(255,255,255,0.2)", "0 0 10px rgba(255,255,255,0)"] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          {language === 'pt' ? 'Ver todos os depoimentos' : 'Ver todos los testimonios'}
        </motion.span>
        
        {/* Fundo animado do botão */}
        <motion.div
          className="absolute inset-0 bg-accent/0 border border-accent/50 rounded-lg z-0"
          initial={{ scale: 1 }}
          whileHover={{ 
            scale: 1.05,
            backgroundColor: "rgba(211,161,126,1)",
            boxShadow: "0 0 30px rgba(211,161,126,0.5)",
            transition: { duration: 0.4 }
          }}
        />
        
        {/* Efeito de onda líquida no hover */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1 bg-accent/50 rounded-b-lg origin-left"
          whileHover={{ 
            scaleX: [1, 0.7, 0.9, 1],
            scaleY: [1, 2, 3, 1],
            opacity: [0.5, 0.8, 0.5],
            transition: { duration: 2, repeat: Infinity }
          }}
        />
        
        {/* Ícone com animação avançada */}
        <motion.div
          className="ml-3 relative z-10"
          animate={{ 
            x: [0, 5, 0],
            transition: { 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut" 
            }
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent group-hover:text-black transition-colors duration-500">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </motion.div>
      </Link>
    </motion.div>
  </div>
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