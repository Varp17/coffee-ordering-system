import React from 'react';
import Liquid from './LiquidMaterial';

export default function GlassContainer({ drinkState }) {
  // Pass base and milk state to Liquid shader
  return (
    <group>
      {/* The Physical Glass Container */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 1.2, 32]} />
        <meshPhysicalMaterial 
          transmission={0.95} 
          roughness={0.05} 
          thickness={0.2} 
          transparent 
          opacity={0.3}
          color="#ffffff"
        />
      </mesh>
      
      {/* Integrated Live Fluid Engine */}
      <Liquid base={drinkState.base} milk={drinkState.milk} />
    </group>
  );
}
