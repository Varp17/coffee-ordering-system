import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { OrbitControls, Stage } from '@react-three/drei';
import GlassContainer from './GlassContainer';
import IceManager from './IceManager';
import { motion } from 'framer-motion';

/**
 * LiquidCup
 * A WebGL R3F 3D visualizer for the coffee drink builder.
 */
const LiquidCup = ({ base, milk, addOns, size = 'M' }) => {
  const hasIce = addOns.some(a => a.toLowerCase().includes('ice'));

  const drinkState = {
    base,
    milk,
    hasIce
  };

  // Determine heights and scales based on size selections
  const cupScale = size === 'S' ? 0.8 : size === 'M' ? 0.95 : 1.1;

  return (
    <div style={{ width: '100%', height: '400px', position: 'relative' }}>
      <motion.div 
        animate={{ scale: cupScale }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        style={{ width: '100%', height: '100%' }}
      >
        <Canvas camera={{ position: [0, 2, 4], fov: 45 }}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[5, 8, 5]} intensity={1.5} castShadow />
          <Stage environment="city" intensity={0.6} adjustCamera={false}>
            <Physics gravity={[0, -9.81, 0]}>
              <GlassContainer drinkState={drinkState} />
              <IceManager spawn={hasIce} />
            </Physics>
          </Stage>
          {/* Restrict orbit to prevent looking under the cup */}
          <OrbitControls 
            enableZoom={false} 
            minPolarAngle={Math.PI / 3} 
            maxPolarAngle={Math.PI / 2} 
            enablePan={false}
          />
        </Canvas>
      </motion.div>
    </div>
  );
};

export default LiquidCup;
