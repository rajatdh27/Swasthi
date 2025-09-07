import { useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, useTexture } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

// Body part component with click detection
const BodyPart = ({ 
  position, 
  args, 
  color, 
  bodyPart, 
  isSelected, 
  isHovered, 
  onClick, 
  onPointerEnter, 
  onPointerLeave,
  level = 1 
}) => {
  const meshRef = useRef();
  
  // Calculate glow intensity based on level
  const glowIntensity = Math.min(level * 0.2, 1);
  const emissiveColor = isSelected 
    ? new THREE.Color(0x4f46e5).multiplyScalar(0.3)
    : isHovered 
    ? new THREE.Color(0x6366f1).multiplyScalar(0.2)
    : new THREE.Color(color).multiplyScalar(glowIntensity * 0.1);

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onClick(bodyPart);
      }}
      onPointerEnter={(e) => {
        e.stopPropagation();
        onPointerEnter(bodyPart);
      }}
      onPointerLeave={(e) => {
        e.stopPropagation();
        onPointerLeave();
      }}
    >
      <boxGeometry args={args} />
      <meshPhongMaterial 
        color={color}
        emissive={emissiveColor}
        shininess={30}
        transparent
        opacity={isHovered ? 0.9 : 0.8}
      />
    </mesh>
  );
};

// Main humanoid figure
const HumanoidFigure = ({ onBodyPartSelect, selectedPart, bodyPartLevels }) => {
  const [hoveredPart, setHoveredPart] = useState(null);

  const bodyParts = [
    // Head
    { name: 'head', position: [0, 3.5, 0], args: [0.8, 0.8, 0.8], color: '#fdbcb4' },
    
    // Torso
    { name: 'chest', position: [0, 2, 0], args: [1.4, 1.2, 0.8], color: '#e74c3c' },
    { name: 'abs', position: [0, 0.8, 0], args: [1.2, 1, 0.6], color: '#f39c12' },
    
    // Arms
    { name: 'left_shoulder', position: [-1.2, 2.8, 0], args: [0.6, 0.6, 0.6], color: '#3498db' },
    { name: 'right_shoulder', position: [1.2, 2.8, 0], args: [0.6, 0.6, 0.6], color: '#3498db' },
    { name: 'left_bicep', position: [-1.6, 1.8, 0], args: [0.5, 1, 0.5], color: '#2ecc71' },
    { name: 'right_bicep', position: [1.6, 1.8, 0], args: [0.5, 1, 0.5], color: '#2ecc71' },
    { name: 'left_forearm', position: [-1.8, 0.6, 0], args: [0.4, 0.8, 0.4], color: '#27ae60' },
    { name: 'right_forearm', position: [1.8, 0.6, 0], args: [0.4, 0.8, 0.4], color: '#27ae60' },
    
    // Legs
    { name: 'left_quad', position: [-0.5, -0.8, 0], args: [0.7, 1.4, 0.7], color: '#9b59b6' },
    { name: 'right_quad', position: [0.5, -0.8, 0], args: [0.7, 1.4, 0.7], color: '#9b59b6' },
    { name: 'left_calf', position: [-0.5, -2.6, 0], args: [0.5, 1.2, 0.5], color: '#8e44ad' },
    { name: 'right_calf', position: [0.5, -2.6, 0], args: [0.5, 1.2, 0.5], color: '#8e44ad' },
    
    // Back (visible when rotated)
    { name: 'back', position: [0, 1.5, -0.5], args: [1.4, 2, 0.4], color: '#e67e22' },
    { name: 'glutes', position: [0, -0.2, -0.3], args: [1.2, 0.8, 0.6], color: '#d35400' },
  ];

  const handleBodyPartClick = (partName) => {
    onBodyPartSelect(partName);
  };

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.6} />
      <pointLight position={[-10, -10, -10]} intensity={0.3} />
      
      {/* Body parts */}
      {bodyParts.map((part) => (
        <BodyPart
          key={part.name}
          position={part.position}
          args={part.args}
          color={part.color}
          bodyPart={part.name}
          isSelected={selectedPart === part.name}
          isHovered={hoveredPart === part.name}
          onClick={handleBodyPartClick}
          onPointerEnter={setHoveredPart}
          onPointerLeave={() => setHoveredPart(null)}
          level={bodyPartLevels[part.name] || 1}
        />
      ))}
      
      {/* Ground plane */}
      <mesh position={[0, -4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[3, 32]} />
        <meshPhongMaterial color="#34495e" transparent opacity={0.3} />
      </mesh>
      
      {/* Body part labels */}
      {hoveredPart && (
        <Text
          position={[0, 4.5, 0]}
          fontSize={0.3}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {hoveredPart.replace('_', ' ').toUpperCase()}
        </Text>
      )}
    </>
  );
};

const BodyModel3D = ({ 
  onBodyPartSelect, 
  selectedPart = null, 
  bodyPartLevels = {},
  className = "" 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading time for 3D assets
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center bg-gray-900 dark:bg-gray-800 rounded-xl ${className}`}>
        <motion.div
          className="text-center text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading 3D Model...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div 
      className={`bg-gradient-to-b from-gray-900 to-gray-800 dark:from-black dark:to-gray-900 rounded-xl overflow-hidden ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="h-full w-full">
        <Canvas 
          camera={{ position: [0, 0, 8], fov: 50 }}
          style={{ background: 'transparent' }}
        >
          <HumanoidFigure 
            onBodyPartSelect={onBodyPartSelect}
            selectedPart={selectedPart}
            bodyPartLevels={bodyPartLevels}
          />
          <OrbitControls 
            enablePan={false} 
            enableZoom={true}
            minDistance={5}
            maxDistance={12}
            maxPolarAngle={Math.PI}
            minPolarAngle={0}
          />
        </Canvas>
      </div>
      
      {/* Control hints */}
      <div className="absolute bottom-4 left-4 text-white text-xs bg-black/50 px-2 py-1 rounded">
        Click & Drag to Rotate • Scroll to Zoom
      </div>
      
      {/* Selected part indicator */}
      {selectedPart && (
        <motion.div 
          className="absolute top-4 right-4 bg-indigo-600/90 text-white px-3 py-2 rounded-lg"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="text-sm font-medium">
            {selectedPart.replace('_', ' ').toUpperCase()}
          </div>
          <div className="text-xs opacity-80">
            Level {bodyPartLevels[selectedPart] || 1}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default BodyModel3D;