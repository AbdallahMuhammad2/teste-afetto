import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useWindowSize } from 'react-use';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float time;
  uniform vec2 resolution;
  uniform vec2 mouse;
  varying vec2 vUv;

  void main() {
    vec2 st = gl_FragCoord.xy/resolution.xy;
    vec2 mousePos = mouse.xy/resolution.xy;
    
    float dist = distance(st, mousePos);
    float ripple = sin(dist * 30.0 - time * 2.0) * 0.5 + 0.5;
    ripple *= smoothstep(0.5, 0.0, dist);
    
    vec3 color = mix(
      vec3(0.95, 0.95, 0.95),
      vec3(0.98, 0.98, 0.98),
      ripple
    );
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

const BackgroundShader: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width, height } = useWindowSize();
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Setup
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    
    renderer.setSize(width, height);
    containerRef.current.appendChild(renderer.domElement);
    
    // Create shader material
    const uniforms = {
      time: { value: 0 },
      resolution: { value: new THREE.Vector2(width, height) },
      mouse: { value: new THREE.Vector2(0.5, 0.5) }
    };
    
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true
    });
    
    // Create mesh
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    
    // Animation
    let animationFrameId: number;
    const animate = () => {
      uniforms.time.value += 0.01;
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();
    
    // Mouse movement
    const handleMouseMove = (event: MouseEvent) => {
      uniforms.mouse.value.x = event.clientX;
      uniforms.mouse.value.y = height - event.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);
    
    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [width, height]);
  
  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  );
};

export default BackgroundShader;