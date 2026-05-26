import React from 'react';
import { RigidBody, CuboidCollider } from '@react-three/rapier';

function IceCube({ position }) {
  return (
    <RigidBody 
      position={position} 
      colliders="cuboid" 
      restitution={0.1} // Prevents unnatural hyper-bouncing
      friction={0.3}
    >
      <mesh castShadow>
        <boxGeometry args={[0.15, 0.15, 0.15]} />
        <meshPhysicalMaterial 
          transmission={0.9} 
          roughness={0.1} 
          thickness={0.5} 
          color="#ffffff" 
          clearcoat={1.0}
        />
      </mesh>
    </RigidBody>
  );
}

export default function IceManager({ spawn }) {
  if (!spawn) return null;

  // Pre-configured offsets to drop items sequentially without clipping
  const positions = [
    [0.05, 0.8, 0.0],
    [-0.08, 1.1, 0.05],
    [0.02, 1.4, -0.06],
    [-0.05, 1.7, -0.05]
  ];

  return (
    <group>
      {positions.map((pos, index) => (
        <IceCube key={index} position={pos} />
      ))}
      
      {/* Invisible Catch Colliders mirroring internal glass limits */}
      {/* Floor */}
      <CuboidCollider position={[0, -0.5, 0]} args={[0.4, 0.05, 0.4]} /> 
      {/* Left Wall */}
      <CuboidCollider position={[-0.45, 0, 0]} args={[0.05, 0.6, 0.4]} /> 
      {/* Right Wall */}
      <CuboidCollider position={[0.45, 0, 0]} args={[0.05, 0.6, 0.4]} />  
      {/* Front Wall */}
      <CuboidCollider position={[0, 0, 0.45]} args={[0.4, 0.6, 0.05]} />  
      {/* Back Wall */}
      <CuboidCollider position={[0, 0, -0.45]} args={[0.4, 0.6, 0.05]} />  
    </group>
  );
}
