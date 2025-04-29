import React, { useRef, useMemo, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import { 
  Environment, 
  PerspectiveCamera, 
  useTexture, 
  Stats,
  MeshDistortMaterial,
  OrbitControls
} from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { createNoise3D } from 'simplex-noise';

// Custom hook for parallax effect based on mouse movement
export const useHeroParallax = () => {
  const mousePosition = useRef({ x: 0, y: 0 });
  const targetPosition = useRef({ x: 0, y: 0 });
  
  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      // Normalize mouse position to range -1 to 1
      mousePosition.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1
      };
    };
    
    window.addEventListener('mousemove', updateMousePosition);
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);
  
  const getParallaxPosition = () => {
    // Smooth lerp from current to target position
    targetPosition.current.x += (mousePosition.current.x - targetPosition.current.x) * 0.05;
    targetPosition.current.y += (mousePosition.current.y - targetPosition.current.y) * 0.05;
    
    return targetPosition.current;
  };
  
  return getParallaxPosition;
};

// Loading screen component
const LoadingScreen = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-carbon/80 text-white">
    <div className="flex flex-col items-center">
      <div className="w-12 h-12 border-2 border-t-accent border-r-accent/30 border-b-accent/10 border-l-accent/50 rounded-full animate-spin mb-4"></div>
      <p className="text-sm uppercase tracking-wider">Loading experience</p>
    </div>
  </div>
);

// Animated wave mesh using simplex noise
const WavePlane = ({ accentColor }: { accentColor: THREE.Color }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const noiseRef = useRef(createNoise3D());
  const { clock } = useThree();
  
  // Create plane geometry with high segment count
  const geometry = useMemo(() => new THREE.PlaneGeometry(10, 10, 100, 100), []);
  
  // Animate vertices with simplex noise
  useFrame(() => {
    if (!meshRef.current) return;
    
    const time = clock.getElapsedTime() * 0.2;
    const positions = (geometry.attributes.position as THREE.BufferAttribute).array;
    
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      
      // Apply simplex noise to z-position
      const z = noiseRef.current(x * 0.1, y * 0.1, time) * 0.5;
      positions[i + 2] = z;
    }
    
    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals();
    
    // Subtle rotation
    meshRef.current.rotation.z = Math.sin(time * 0.05) * 0.02;
  });
  
  return (
    <mesh ref={meshRef} rotation={[-Math.PI * 0.2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <primitive object={geometry} attach="geometry" />
      <meshPhysicalMaterial 
        color={accentColor}
        metalness={0.8}
        roughness={0.15}
        envMapIntensity={1.1}
        clearcoat={0.5}
        clearcoatRoughness={0.2}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

// Camera controller using parallax effect
const CameraController = () => {
  const { camera } = useThree();
  const getParallaxPosition = useHeroParallax();
  
  // Initial camera position
  useEffect(() => {
    camera.position.set(0, 0, 4);
    camera.lookAt(0, 0, 0);
  }, [camera]);
  
  // Update camera based on mouse movement
  useFrame(() => {
    const { x, y } = getParallaxPosition();
    camera.position.x = x * 0.3;
    camera.position.y = y * 0.3;
    camera.lookAt(0, 0, 0);
  });
  
  return null;
};

// Post-processing effects
const PostProcessing = ({ bloom = 0.6, aberration = 0.005 }) => (
  <EffectComposer>
    <Bloom 
      intensity={bloom} 
      luminanceThreshold={0.2}
      luminanceSmoothing={0.9}
      height={300}
    />
    <ChromaticAberration
      offset={[aberration, aberration]}
      blendFunction={BlendFunction.NORMAL}
      radialModulation={false}
      modulationOffset={0}
    />
  </EffectComposer>
);

// Ambient particles for depth
const AmbientParticles = ({ count = 100 }) => {
  const { size, viewport } = useThree();
  const aspect = size.width / viewport.width;
  
  // Generate particles
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() * 2 - 1) * 8;
      const y = (Math.random() * 2 - 1) * 8;
      const z = (Math.random() * 2 - 1) * 8;
      const scale = Math.random() * 0.05 + 0.025;
      temp.push({ x, y, z, scale });
    }
    return temp;
  }, [count]);
  
  return (
    <group>
      {particles.map((particle, i) => (
        <mesh key={i} position={[particle.x, particle.y, particle.z]} scale={particle.scale}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial color="#ffffff" opacity={0.3} transparent />
        </mesh>
      ))}
    </group>
  );
};

interface HeroCanvasProps {
  accentColor?: string;
  bloomIntensity?: number; 
  aberrationStrength?: number;
  className?: string;
  showStats?: boolean;
}

const HeroCanvas: React.FC<HeroCanvasProps> = ({
  accentColor = '#de6d47',
  bloomIntensity = 0.6,
  aberrationStrength = 0.005,
  className = 'w-full h-full absolute inset-0',
  showStats = false
}) => {
  // Convert hex string to THREE.Color
  const color = useMemo(() => new THREE.Color(accentColor), [accentColor]);
  
  return (
    <div className={className}>
      <Canvas dpr={[1, 2]}>
        <Suspense fallback={<LoadingScreen />}>
          <color attach="background" args={['#010101']} />
          
          {/* Environment - using a simple scene rather than HDRI to avoid errors */}
          <ambientLight intensity={0.3} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
          <pointLight position={[-5, -5, -5]} intensity={0.5} />
          
          {/* Wave plane */}
          <WavePlane accentColor={color} />
          
          {/* Ambient particles */}
          <AmbientParticles />
          
          {/* Camera controller with parallax */}
          <CameraController />
          
          {/* Post-processing */}
          <PostProcessing bloom={bloomIntensity} aberration={aberrationStrength} />
          
          {/* Debug stats */}
          {showStats && <Stats />}
        </Suspense>
      </Canvas>
    </div>
  );
};

export default HeroCanvas;