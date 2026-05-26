import React, { useRef } from 'react';
import { shaderMaterial } from '@react-three/drei';
import { extend, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const CustomLiquidMaterial = shaderMaterial(
  {
    uTime: 0,
    uLiquidLevel: 0.0,    // Controlled by selection state
    uMixRatio: 0.0,       // Controls blending between base and milk
    uBaseColor: new THREE.Color('#3c2212'), // Dark Coffee default
    uMilkColor: new THREE.Color('#fcfaf2'), // Creamy Oat Milk default
  },
  // Vertex Shader
  `
    uniform float uTime;
    uniform float uLiquidLevel;
    varying vec2 vUv;
    varying vec3 vPosition;

    void main() {
      vUv = uv;
      vec3 pos = position;
      
      // Generate slight surface ripples if liquid is present near the top edge
      if(pos.y > (uLiquidLevel - 0.1) && uLiquidLevel > 0.01) {
        pos.y += sin(pos.x * 10.0 + uTime * 2.0) * 0.02 * sin(pos.z * 10.0 + uTime * 2.0);
      }
      
      vPosition = pos;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  // Fragment Shader
  `
    uniform vec3 uBaseColor;
    uniform vec3 uMilkColor;
    uniform float uLiquidLevel;
    uniform float uMixRatio;
    varying vec3 vPosition;
    varying vec2 vUv;

    void main() {
      // Discard pixels above current fluid fill height (minus a small offset for the origin)
      if (vPosition.y > uLiquidLevel) {
        discard;
      }

      // Calculate dynamic procedural layering mixing
      // Lower Y keeps more base color, higher Y blends the milk smoothly
      float layerFactor = smoothstep(-0.5, uLiquidLevel, vPosition.y);
      float finalBlend = layerFactor * uMixRatio;

      vec3 finalColor = mix(uBaseColor, uMilkColor, finalBlend);
      
      // Look-based glass edge darkening for fluid depth simulation
      gl_FragColor = vec4(finalColor, 0.95);
    }
  `
);

extend({ CustomLiquidMaterial });

export default function Liquid({ base, milk }) {
  const materialRef = useRef();

  // Map state to shader inputs
  const targetLevel = base !== 'None' ? (milk !== 'None' ? 0.8 : 0.5) : 0.0;
  const targetMix = milk !== 'None' ? 0.7 : 0.0;

  // Determine base color based on user selection
  const baseColorMap = {
    'Espresso': '#3b1f13',
    'Cold Brew': '#261103',
    'Matcha': '#7e9c5e',
    'Chai': '#8f5e36',
    'None': '#ffffff'
  };

  const currentBaseColor = baseColorMap[base] || '#3b1f13';

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uTime = state.clock.getElapsedTime();
      
      // Animate properties towards target parameters smoothly over frames
      materialRef.current.uLiquidLevel = THREE.MathUtils.lerp(materialRef.current.uLiquidLevel, targetLevel, 0.05);
      materialRef.current.uMixRatio = THREE.MathUtils.lerp(materialRef.current.uMixRatio, targetMix, 0.03);
      
      // Interpolate colors
      const targetColor = new THREE.Color(currentBaseColor);
      materialRef.current.uBaseColor.lerp(targetColor, 0.05);
    }
  });

  return (
    <mesh position={[0, -0.4, 0]}>
      {/* Cylinder representing internal liquid boundaries */}
      <cylinderGeometry args={[0.38, 0.38, 1.1, 32]} />
      <customLiquidMaterial ref={materialRef} transparent depthWrite={true} />
    </mesh>
  );
}
