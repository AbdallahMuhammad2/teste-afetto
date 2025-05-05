import React, { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import { Text3D, useTexture, OrbitControls, useGLTF, Center } from '@react-three/drei';
import * as THREE from 'three';
import { useSpring, animated } from '@react-spring/three';
import { motion, MotionValue } from 'framer-motion';

// Create custom shader material
const NoiseShaderMaterial = {
  uniforms: {
    time: { value: 0 },
    tex: { value: null },
    scrollY: { value: 0 },
    resolution: { value: new THREE.Vector2(1, 1) },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float time;
    uniform float scrollY;
    uniform vec2 resolution;
    uniform sampler2D tex;
    varying vec2 vUv;

    // Simple pseudo-random function
    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
    }

    void main() {
      // Basic UV distortion based on scroll and time
      vec2 uv = vUv;
      uv += sin(time + uv.y*8.)*0.01 * (1.0 - min(scrollY*0.5, 0.5));
      
      // RGB split
      float amount = 0.005 * (1.0 - min(scrollY*0.5, 0.5));
      vec4 r = texture2D(tex, uv + vec2(amount, 0.0));
      vec4 g = texture2D(tex, uv);
      vec4 b = texture2D(tex, uv - vec2(amount, 0.0));
      
      // Simple noise
      float noise = random(uv * 1000.0 + time) * 0.05;
      
      // Final color with RGB split
      vec4 finalColor = vec4(r.r, g.g, b.b, 1.0);
      finalColor.rgb += vec3(noise) - 0.025;
      
      gl_FragColor = finalColor;
    }
  `
};

// Fallback image when resources fail to load
const FallbackPlane = () => {
  const { viewport } = useThree();
  const texture = new THREE.TextureLoader().load('/images/fallback-hero.jpg', 
    undefined, 
    undefined, 
    (error) => {
      console.log('Error loading texture, using color instead');
    }
  );
  
  const scale: [number, number, number] = [viewport.width, viewport.height, 1];
  
  return (
    <mesh scale={scale}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial 
        color={texture.image ? 'white' : '#1a1713'} 
        map={texture.image ? texture : null} 
      />
    </mesh>
  );
};

// Video plane with shader effects
interface VideoPlaneProps {
  scrollY: {
    get: () => number;
  };
}

const VideoPlane = ({ scrollY }: VideoPlaneProps) => {
  const meshRef = useRef<THREE.Mesh | null>(null);
  const shaderRef = useRef();
  const { viewport } = useThree();
  const [hasError, setHasError] = useState(false);
  
  // Create material with our shader
  const [shaderMaterial] = useState(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        tex: { value: null },
        scrollY: { value: 0 },
        resolution: { value: new THREE.Vector2(viewport.width, viewport.height) },
      },
      vertexShader: NoiseShaderMaterial.vertexShader,
      fragmentShader: NoiseShaderMaterial.fragmentShader,
    });
  });
  
  // Try to load video texture
  useEffect(() => {
    try {
      const video = document.createElement('video');
      video.src = '/videos/luxury-atelier.mp4';
      video.crossOrigin = 'Anonymous';
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      
      // Handle video load error
      video.onerror = () => {
        console.log('Video failed to load, using fallback');
        setHasError(true);
      };
      
      // Handle successful video load
      video.oncanplay = () => {
        const texture = new THREE.VideoTexture(video);
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        
        shaderMaterial.uniforms.tex.value = texture;
        video.play().catch(err => {
          console.log('Video play failed:', err);
          setHasError(true);
        });
      };
      
      // Clean up
      return () => {
        video.pause();
        video.remove();
        if (shaderMaterial.uniforms.tex.value) {
          shaderMaterial.uniforms.tex.value.dispose();
        }
      };
    } catch (error) {
      console.error('Error setting up video:', error);
      setHasError(true);
    }
  }, [shaderMaterial]);
  
  // Update shader uniforms on each frame
  useFrame(({ clock }) => {
    if (shaderRef.current) {
      shaderMaterial.uniforms.time.value = clock.getElapsedTime();
      shaderMaterial.uniforms.scrollY.value = scrollY.get();
    }
  });
  
  if (hasError) {
    return <FallbackPlane />;
  }
  
  return (
    <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <primitive ref={shaderRef} object={shaderMaterial} />
    </mesh>
  );
};

// Define the props interface for SimpleText
interface SimpleTextProps {
  text?: string;
  scrollY: {
    get: () => number;
  };
}

// Simplified Text component that doesn't require font loading
const SimpleText = ({ text = "Objetos com significado", scrollY }: SimpleTextProps) => {
  const textRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();
  
  // Scale text based on viewport
  const textScale = Math.min(viewport.width * 0.05, 0.8);
  
  // Animate based on scroll
  useFrame(() => {
    if (textRef.current) {
      textRef.current.position.y = scrollY.get() * -0.01;
    }
  });
  
  // Spring animation for appearance
  const [spring, api] = useSpring(() => ({
    position: [0, 0, 1],
    scale: [0, 0, 0],
    rotation: [-Math.PI / 4, 0, 0],
    config: { mass: 2, tension: 150, friction: 50 },
  }));
  
  useEffect(() => {
    // Start animation after component is mounted
    api.start({
      position: [0, 0, 1],
      scale: [textScale, textScale, 0.1],
      rotation: [0, 0, 0],
      delay: 500,
    });
  }, [api, textScale]);
  
  return (
    <animated.mesh
      ref={textRef}
      position={spring.position.to(p => p)}
      scale={spring.scale.to(s => s)}
      rotation={spring.rotation as any}
    >
      <Center>
        <mesh>
          <Text3D font="/fonts/Roboto-Regular.ttf" size={1} height={0.1} curveSegments={32} bevelEnabled bevelSize={0.01} bevelThickness={0.01} >
            {text}
            <meshStandardMaterial color="#ffffff" />
          </Text3D>
        </mesh>
      </Center>
    </animated.mesh>
  );
};

// Main HeroCanvas component
interface HeroCanvasProps {
  scrollYProgress: MotionValue<number>;
}

const HeroCanvas = ({ scrollYProgress }: HeroCanvasProps) => {
  const [loaded, setLoaded] = useState(false);
  const scrollY = useRef(0);
  
  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange(v => {
      scrollY.current = v * 1000;
    });
    return () => unsubscribe();
  }, [scrollYProgress]);
  
  // Fallback with framer-motion
  const fallback = (
    <motion.div 
      className="absolute inset-0 bg-cover bg-center"
      style={{ backgroundColor: '#1a1713' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    />
  );
  
  return (
    <>
      {!loaded && fallback}
      <Canvas
        frameloop="always"
        camera={{ position: [0, 0, 5], fov: 45 }}
        onCreated={() => setLoaded(true)}
        className="absolute inset-0 w-full h-full"
        dpr={[1, 2]} // Performance optimization
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={1} />
        <Suspense fallback={null}>
          <VideoPlane scrollY={{ get: () => scrollY.current }} />
        </Suspense>
        <Suspense fallback={null}>
          {/* Replace Text3D with simple text for now */}
          <SimpleText text="Objetos com" scrollY={{ get: () => scrollY.current }} />
        </Suspense>
      </Canvas>
    </>
  );
};

export default HeroCanvas;