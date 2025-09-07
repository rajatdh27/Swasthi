import { useRef, useState, Suspense } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';

// Create realistic anatomical muscle shapes using THREE.js geometry
const createAnatomicalGeometry = (muscleType) => {
  switch (muscleType) {
    case 'pectoralis':
      // Create realistic fan-shaped pectoral muscles
      const pectoralGeometry = new THREE.SphereGeometry(0.25, 16, 16);
      
      // Modify vertices to create fan shape - wider at shoulders, narrow at sternum
      const positions = pectoralGeometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        const y = positions[i + 1];
        const z = positions[i + 2];
        
        // Create fan effect - stretch horizontally, compress depth
        positions[i] = x * (1.8 + Math.abs(y) * 0.3); // Wider at top
        positions[i + 1] = y * 0.8; // Flatten vertically
        positions[i + 2] = z * 0.4 + Math.abs(x) * 0.2; // Curve forward at edges
      }
      
      pectoralGeometry.attributes.position.needsUpdate = true;
      pectoralGeometry.computeVertexNormals();
      return pectoralGeometry;

    case 'deltoid':
      // Shoulder cap - modified sphere
      const deltoidGeometry = new THREE.SphereGeometry(0.16, 16, 16);
      // Flatten bottom
      const deltoidPositions = deltoidGeometry.attributes.position.array;
      for (let i = 0; i < deltoidPositions.length; i += 3) {
        const y = deltoidPositions[i + 1];
        if (y < -0.05) {
          deltoidPositions[i + 1] = -0.05; // Flatten bottom
        }
      }
      deltoidGeometry.attributes.position.needsUpdate = true;
      return deltoidGeometry;

    case 'bicep':
      // Teardrop bicep shape
      const bicepShape = new THREE.Shape();
      bicepShape.moveTo(0, -0.3);
      bicepShape.bezierCurveTo(-0.08, -0.2, -0.1, 0, -0.05, 0.3);
      bicepShape.bezierCurveTo(-0.02, 0.35, 0.02, 0.35, 0.05, 0.3);
      bicepShape.bezierCurveTo(0.1, 0, 0.08, -0.2, 0, -0.3);
      return new THREE.ExtrudeGeometry(bicepShape, { depth: 0.12, bevelEnabled: true, bevelSize: 0.01 });

    case 'tricep':
      // Horseshoe tricep
      const tricepShape = new THREE.Shape();
      tricepShape.moveTo(-0.06, -0.25);
      tricepShape.lineTo(-0.08, 0.15);
      tricepShape.bezierCurveTo(-0.08, 0.25, 0.08, 0.25, 0.08, 0.15);
      tricepShape.lineTo(0.06, -0.25);
      tricepShape.bezierCurveTo(0.03, -0.3, -0.03, -0.3, -0.06, -0.25);
      return new THREE.ExtrudeGeometry(tricepShape, { depth: 0.1, bevelEnabled: true, bevelSize: 0.01 });

    case 'latissimus':
      // Wing-shaped lats
      const latShape = new THREE.Shape();
      latShape.moveTo(0, 0);
      latShape.bezierCurveTo(-0.3, 0.1, -0.4, 0.3, -0.3, 0.4);
      latShape.bezierCurveTo(-0.1, 0.45, 0.1, 0.45, 0.3, 0.4);
      latShape.bezierCurveTo(0.4, 0.3, 0.3, 0.1, 0, 0);
      return new THREE.ExtrudeGeometry(latShape, { depth: 0.08, bevelEnabled: true, bevelSize: 0.02 });

    case 'quadriceps':
      // Large teardrop thigh
      const quadShape = new THREE.Shape();
      quadShape.moveTo(0, -0.4);
      quadShape.bezierCurveTo(-0.12, -0.3, -0.14, 0, -0.1, 0.3);
      quadShape.bezierCurveTo(-0.05, 0.4, 0.05, 0.4, 0.1, 0.3);
      quadShape.bezierCurveTo(0.14, 0, 0.12, -0.3, 0, -0.4);
      return new THREE.ExtrudeGeometry(quadShape, { depth: 0.2, bevelEnabled: true, bevelSize: 0.02 });

    case 'hamstring':
      // Back thigh muscle
      const hamShape = new THREE.Shape();
      hamShape.moveTo(0, -0.35);
      hamShape.bezierCurveTo(-0.1, -0.25, -0.11, 0, -0.08, 0.25);
      hamShape.bezierCurveTo(-0.04, 0.35, 0.04, 0.35, 0.08, 0.25);
      hamShape.bezierCurveTo(0.11, 0, 0.1, -0.25, 0, -0.35);
      return new THREE.ExtrudeGeometry(hamShape, { depth: 0.18, bevelEnabled: true, bevelSize: 0.02 });

    case 'calf':
      // Diamond calf
      const calfShape = new THREE.Shape();
      calfShape.moveTo(0, -0.25);
      calfShape.bezierCurveTo(-0.08, -0.1, -0.1, 0.1, -0.06, 0.25);
      calfShape.bezierCurveTo(-0.02, 0.3, 0.02, 0.3, 0.06, 0.25);
      calfShape.bezierCurveTo(0.1, 0.1, 0.08, -0.1, 0, -0.25);
      return new THREE.ExtrudeGeometry(calfShape, { depth: 0.12, bevelEnabled: true, bevelSize: 0.01 });

    case 'abs':
      // Individual ab segment
      const absGeometry = new THREE.BoxGeometry(0.08, 0.12, 0.06);
      // Round the corners
      absGeometry.parameters = { ...absGeometry.parameters };
      return absGeometry;

    case 'trapezius':
      // Upper back trapezius
      const trapShape = new THREE.Shape();
      trapShape.moveTo(0, 0);
      trapShape.bezierCurveTo(-0.2, 0.05, -0.25, 0.15, -0.2, 0.25);
      trapShape.lineTo(0, 0.3);
      trapShape.lineTo(0.2, 0.25);
      trapShape.bezierCurveTo(0.25, 0.15, 0.2, 0.05, 0, 0);
      return new THREE.ExtrudeGeometry(trapShape, { depth: 0.06, bevelEnabled: true, bevelSize: 0.01 });

    case 'glutes':
      // Rounded glute
      const gluteGeometry = new THREE.SphereGeometry(0.18, 16, 16);
      gluteGeometry.scale(1.4, 0.8, 1.2);
      return gluteGeometry;

    default:
      return new THREE.CapsuleGeometry(0.08, 0.25, 8, 16);
  }
};

// Anatomically correct muscle component
const AnatomicalMuscle = ({ position, rotation = [0, 0, 0], scale = [1, 1, 1], onClick, bodyPart, isSelected, muscleName, muscleType }) => {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef();
  
  // Get the anatomical geometry for this muscle
  const geometry = createAnatomicalGeometry(muscleType);
  
  // Skin-like material with anatomical highlighting
  const getMaterial = () => {
    if (isSelected) {
      return new THREE.MeshStandardMaterial({
        color: '#DC2626',
        emissive: '#7F1D1D',
        emissiveIntensity: 0.3,
        roughness: 0.6,
        metalness: 0.1
      });
    }
    if (hovered) {
      return new THREE.MeshStandardMaterial({
        color: '#F87171',
        emissive: '#DC2626',
        emissiveIntensity: 0.1,
        roughness: 0.6,
        metalness: 0.1
      });
    }
    return new THREE.MeshStandardMaterial({
      color: '#F3F4F6',
      roughness: 0.8,
      metalness: 0.05
    });
  };
  
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh
        ref={meshRef}
        geometry={geometry}
        material={getMaterial()}
        onClick={(e) => {
          e.stopPropagation();
          onClick(bodyPart);
        }}
        onPointerEnter={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerLeave={(e) => {
          e.stopPropagation();
          setHovered(false);
        }}
        castShadow
        receiveShadow
      />
      
      {/* Muscle definition lines */}
      {(hovered || isSelected) && (
        <mesh geometry={geometry} scale={[1.002, 1.002, 1.002]}>
          <meshBasicMaterial 
            color={isSelected ? '#7F1D1D' : '#6B7280'}
            transparent
            opacity={0.4}
            wireframe={true}
          />
        </mesh>
      )}
      
      {/* Floating label */}
      {isSelected && (
        <Html center>
          <div className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold pointer-events-none">
            {muscleName.toUpperCase()}
          </div>
        </Html>
      )}
    </group>
  );
};

// Realistic human body builder
const RealisticMuscle = ({ position, rotation = [0, 0, 0], scale = [1, 1, 1], onClick, bodyPart, isSelected, muscleName, muscleShape }) => {
  const [hovered, setHovered] = useState(false);
  
  // Create anatomically correct muscle shapes
  const createMuscleGeometry = () => {
    switch(muscleShape) {
      case 'pectoralis':
        // Fan-shaped chest muscle
        const pectoralGeometry = new THREE.ConeGeometry(0.3, 0.15, 16);
        pectoralGeometry.rotateZ(Math.PI / 2);
        pectoralGeometry.scale(1.5, 0.8, 0.6);
        return pectoralGeometry;
        
      case 'deltoid':
        // Rounded shoulder cap with anatomical shape
        const deltoidGeometry = new THREE.SphereGeometry(0.18, 16, 16);
        deltoidGeometry.scale(1.3, 0.9, 1.1);
        return deltoidGeometry;
        
      case 'bicep':
        // Teardrop-shaped bicep
        const bicepGeometry = new THREE.CapsuleGeometry(0.09, 0.35, 8, 16);
        bicepGeometry.scale(1.2, 1, 0.9);
        return bicepGeometry;
        
      case 'tricep':
        // Horseshoe-shaped tricep
        const tricepGeometry = new THREE.CapsuleGeometry(0.08, 0.32, 8, 16);
        tricepGeometry.scale(0.9, 1, 1.1);
        return tricepGeometry;
        
      case 'latissimus':
        // Wing-shaped back muscle
        const latGeometry = new THREE.BoxGeometry(0.8, 0.6, 0.12);
        latGeometry.scale(1, 1.2, 1);
        // Create wing shape by tapering
        const latPositions = latGeometry.attributes.position.array;
        for (let i = 0; i < latPositions.length; i += 3) {
          const y = latPositions[i + 1];
          const scaleFactor = 1 - Math.abs(y) * 0.3;
          latPositions[i] *= scaleFactor; // taper on x-axis
        }
        latGeometry.attributes.position.needsUpdate = true;
        return latGeometry;
        
      case 'quadriceps':
        // Large teardrop thigh muscle
        const quadGeometry = new THREE.CapsuleGeometry(0.14, 0.55, 8, 16);
        quadGeometry.scale(1.1, 1, 0.95);
        return quadGeometry;
        
      case 'hamstring':
        // Back thigh muscle
        const hamGeometry = new THREE.CapsuleGeometry(0.12, 0.5, 8, 16);
        hamGeometry.scale(0.9, 1, 1);
        return hamGeometry;
        
      case 'calf':
        // Diamond-shaped calf
        const calfGeometry = new THREE.CapsuleGeometry(0.1, 0.4, 8, 16);
        calfGeometry.scale(1.2, 1.3, 1);
        return calfGeometry;
        
      case 'abs':
        // Segmented abs
        const absGeometry = new THREE.BoxGeometry(0.25, 0.15, 0.08);
        return absGeometry;
        
      case 'glutes':
        // Rounded glute muscle
        const gluteGeometry = new THREE.SphereGeometry(0.2, 16, 16);
        gluteGeometry.scale(1.8, 0.8, 1.2);
        return gluteGeometry;
        
      default:
        return new THREE.CapsuleGeometry(0.08, 0.3, 8, 16);
    }
  };

  // Skin-like material with muscle definition
  const getMaterialProps = () => {
    if (isSelected) {
      return {
        color: '#DC2626',
        emissive: '#991B1B',
        emissiveIntensity: 0.15,
        roughness: 0.6,
        metalness: 0.1
      };
    }
    if (hovered) {
      return {
        color: '#F87171',
        emissive: '#DC2626',
        emissiveIntensity: 0.08,
        roughness: 0.6,
        metalness: 0.1
      };
    }
    return {
      color: '#F3F4F6',
      emissive: '#000000',
      emissiveIntensity: 0,
      roughness: 0.7,
      metalness: 0.05
    };
  };
  
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          onClick(bodyPart);
        }}
        onPointerEnter={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerLeave={(e) => {
          e.stopPropagation();
          setHovered(false);
        }}
        castShadow
        receiveShadow
      >
        <primitive object={createMuscleGeometry()} />
        <meshStandardMaterial {...getMaterialProps()} />
      </mesh>
      
      {/* Muscle separation lines */}
      {(hovered || isSelected) && (
        <mesh scale={[1.005, 1.005, 1.005]}>
          <primitive object={createMuscleGeometry()} />
          <meshBasicMaterial 
            color={isSelected ? '#7F1D1D' : '#374151'}
            transparent
            opacity={0.4}
            wireframe={true}
          />
        </mesh>
      )}
    </group>
  );
};

// Detailed vascular system - medical textbook style
const DetailedVascularSystem = () => {
  return (
    <group>
      {/* Central aorta */}
      <mesh position={[0, 1.5, -0.05]}>
        <cylinderGeometry args={[0.025, 0.015, 2.5, 8]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      
      {/* Subclavian arteries to arms */}
      <mesh position={[-0.3, 2.1, -0.02]} rotation={[0, 0, Math.PI/6]}>
        <cylinderGeometry args={[0.015, 0.01, 0.6, 6]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      <mesh position={[0.3, 2.1, -0.02]} rotation={[0, 0, -Math.PI/6]}>
        <cylinderGeometry args={[0.015, 0.01, 0.6, 6]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      
      {/* Brachial arteries */}
      <mesh position={[-0.6, 1.4, 0]} rotation={[0, 0, Math.PI/12]}>
        <cylinderGeometry args={[0.01, 0.008, 0.8, 6]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      <mesh position={[0.6, 1.4, 0]} rotation={[0, 0, -Math.PI/12]}>
        <cylinderGeometry args={[0.01, 0.008, 0.8, 6]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      
      {/* Radial/ulnar arteries in forearms */}
      <mesh position={[-0.75, 0.6, 0.08]}>
        <cylinderGeometry args={[0.006, 0.005, 0.6, 6]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      <mesh position={[-0.75, 0.6, -0.08]}>
        <cylinderGeometry args={[0.006, 0.005, 0.6, 6]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      <mesh position={[0.75, 0.6, 0.08]}>
        <cylinderGeometry args={[0.006, 0.005, 0.6, 6]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      <mesh position={[0.75, 0.6, -0.08]}>
        <cylinderGeometry args={[0.006, 0.005, 0.6, 6]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      
      {/* Common iliac arteries */}
      <mesh position={[-0.15, 0.5, -0.02]} rotation={[0, 0, Math.PI/8]}>
        <cylinderGeometry args={[0.018, 0.015, 0.4, 6]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      <mesh position={[0.15, 0.5, -0.02]} rotation={[0, 0, -Math.PI/8]}>
        <cylinderGeometry args={[0.018, 0.015, 0.4, 6]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      
      {/* Femoral arteries */}
      <mesh position={[-0.22, -0.2, 0.05]}>
        <cylinderGeometry args={[0.012, 0.01, 1.4, 6]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      <mesh position={[0.22, -0.2, 0.05]}>
        <cylinderGeometry args={[0.012, 0.01, 1.4, 6]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      
      {/* Popliteal and tibial arteries */}
      <mesh position={[-0.22, -1.3, 0.02]}>
        <cylinderGeometry args={[0.008, 0.006, 0.8, 6]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      <mesh position={[0.22, -1.3, 0.02]}>
        <cylinderGeometry args={[0.008, 0.006, 0.8, 6]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      
      {/* Capillary networks - fine details */}
      {Array.from({length: 20}).map((_, i) => (
        <mesh key={i} position={[
          (Math.random() - 0.5) * 1.5,
          (Math.random() - 0.5) * 3,
          (Math.random() - 0.5) * 0.3
        ]}>
          <cylinderGeometry args={[0.002, 0.002, 0.1, 4]} />
          <meshBasicMaterial color="#333333" transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  );
};

// Face component with eyes and basic features
const Face = ({ position }) => {
  return (
    <group position={position}>
      {/* Left Eye */}
      <mesh position={[-0.12, 0.1, 0.15]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshPhongMaterial color="#333333" />
      </mesh>
      {/* Right Eye */}
      <mesh position={[0.12, 0.1, 0.15]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshPhongMaterial color="#333333" />
      </mesh>
      {/* Nose */}
      <mesh position={[0, 0, 0.18]}>
        <coneGeometry args={[0.03, 0.08, 6]} />
        <meshPhongMaterial color="#f4c2a1" />
      </mesh>
      {/* Mouth */}
      <mesh position={[0, -0.08, 0.15]}>
        <boxGeometry args={[0.08, 0.02, 0.01]} />
        <meshPhongMaterial color="#cc6666" />
      </mesh>
    </group>
  );
};

// Realistic anatomical model with proper muscle geometry
const Simple3DScene = ({ onBodyPartSelect, selectedPart }) => {
  const anatomicalMuscles = [
    // CHEST - Separate left and right pectorals for anatomical accuracy
    { name: 'chest_left', muscleName: 'Left Pectoralis', position: [-0.25, 1.65, 0.15], muscleType: 'pectoralis', scale: [1, 1, 1], rotation: [0, 0, Math.PI/12] },
    { name: 'chest_right', muscleName: 'Right Pectoralis', position: [0.25, 1.65, 0.15], muscleType: 'pectoralis', scale: [1, 1, 1], rotation: [0, 0, -Math.PI/12] },
    
    // SHOULDERS - Deltoid caps
    { name: 'left_shoulder', muscleName: 'Left Deltoid', position: [-0.65, 1.85, 0], muscleType: 'deltoid', scale: [1.1, 1, 1] },
    { name: 'right_shoulder', muscleName: 'Right Deltoid', position: [0.65, 1.85, 0], muscleType: 'deltoid', scale: [1.1, 1, 1] },
    
    // ARMS - Anatomical biceps and triceps
    { name: 'left_bicep', muscleName: 'Left Biceps', position: [-0.75, 1.25, 0.1], muscleType: 'bicep', rotation: [0, 0, Math.PI/16] },
    { name: 'right_bicep', muscleName: 'Right Biceps', position: [0.75, 1.25, 0.1], muscleType: 'bicep', rotation: [0, 0, -Math.PI/16] },
    
    { name: 'left_tricep', muscleName: 'Left Triceps', position: [-0.75, 1.25, -0.15], muscleType: 'tricep', rotation: [0, 0, Math.PI/16] },
    { name: 'right_tricep', muscleName: 'Right Triceps', position: [0.75, 1.25, -0.15], muscleType: 'tricep', rotation: [0, 0, -Math.PI/16] },
    
    // FOREARMS
    { name: 'left_forearm', muscleName: 'Left Forearms', position: [-0.75, 0.6, 0.05], muscleType: 'bicep', scale: [0.7, 0.8, 0.7] },
    { name: 'right_forearm', muscleName: 'Right Forearms', position: [0.75, 0.6, 0.05], muscleType: 'bicep', scale: [0.7, 0.8, 0.7] },
    
    // BACK - Wing-shaped lats and trapezius
    { name: 'lats', muscleName: 'Latissimus Dorsi', position: [0, 1.35, -0.25], muscleType: 'latissimus', scale: [1.2, 1.1, 1] },
    { name: 'traps', muscleName: 'Trapezius', position: [0, 2.05, -0.18], muscleType: 'trapezius', scale: [1.1, 1, 1] },
    
    // ABS - Individual segments for six-pack
    { name: 'abs_upper_left', muscleName: 'Upper Abs', position: [-0.08, 1.15, 0.12], muscleType: 'abs', rotation: [0, 0, Math.PI/32] },
    { name: 'abs_upper_right', muscleName: 'Upper Abs', position: [0.08, 1.15, 0.12], muscleType: 'abs', rotation: [0, 0, -Math.PI/32] },
    { name: 'abs_middle_left', muscleName: 'Middle Abs', position: [-0.08, 0.95, 0.12], muscleType: 'abs', rotation: [0, 0, Math.PI/32] },
    { name: 'abs_middle_right', muscleName: 'Middle Abs', position: [0.08, 0.95, 0.12], muscleType: 'abs', rotation: [0, 0, -Math.PI/32] },
    { name: 'abs_lower_left', muscleName: 'Lower Abs', position: [-0.08, 0.75, 0.12], muscleType: 'abs', rotation: [0, 0, Math.PI/32] },
    { name: 'abs_lower_right', muscleName: 'Lower Abs', position: [0.08, 0.75, 0.12], muscleType: 'abs', rotation: [0, 0, -Math.PI/32] },
    
    // LEGS - Teardrop quadriceps and hamstrings
    { name: 'left_quad', muscleName: 'Left Quadriceps', position: [-0.24, 0.05, 0.08], muscleType: 'quadriceps', rotation: [0, 0, Math.PI/20] },
    { name: 'right_quad', muscleName: 'Right Quadriceps', position: [0.24, 0.05, 0.08], muscleType: 'quadriceps', rotation: [0, 0, -Math.PI/20] },
    
    { name: 'left_hamstring', muscleName: 'Left Hamstrings', position: [-0.24, 0.05, -0.18], muscleType: 'hamstring', scale: [0.95, 1, 1] },
    { name: 'right_hamstring', muscleName: 'Right Hamstrings', position: [0.24, 0.05, -0.18], muscleType: 'hamstring', scale: [0.95, 1, 1] },
    
    // CALVES - Diamond-shaped
    { name: 'left_calf', muscleName: 'Left Calf', position: [-0.24, -0.85, -0.05], muscleType: 'calf', scale: [1, 1.1, 1] },
    { name: 'right_calf', muscleName: 'Right Calf', position: [0.24, -0.85, -0.05], muscleType: 'calf', scale: [1, 1.1, 1] },
    
    { name: 'left_shin', muscleName: 'Left Shins', position: [-0.24, -0.85, 0.15], muscleType: 'calf', scale: [0.6, 1, 0.6] },
    { name: 'right_shin', muscleName: 'Right Shins', position: [0.24, -0.85, 0.15], muscleType: 'calf', scale: [0.6, 1, 0.6] },
    
    // GLUTES
    { name: 'glutes', muscleName: 'Glutes', position: [0, 0.2, -0.22], muscleType: 'glutes', scale: [1, 1, 1] },
  ];

  return (
    <>
      {/* Medical lighting - high contrast for anatomical study */}
      <ambientLight intensity={0.8} color="#FFFFFF" />
      <directionalLight position={[5, 10, 5]} intensity={1.2} color="#FFFFFF" castShadow />
      <directionalLight position={[-5, 5, -5]} intensity={0.6} color="#CCCCCC" />
      <pointLight position={[0, -2, 8]} intensity={0.4} color="#FFFFFF" />
      
      {/* Anatomically correct muscles with proper geometry */}
      {anatomicalMuscles.map((muscle) => (
        <AnatomicalMuscle
          key={muscle.name}
          position={muscle.position}
          rotation={muscle.rotation || [0, 0, 0]}
          scale={muscle.scale || [1, 1, 1]}
          muscleType={muscle.muscleType}
          muscleName={muscle.muscleName}
          bodyPart={muscle.name}
          isSelected={selectedPart === muscle.name}
          onClick={onBodyPartSelect}
        />
      ))}
      
      {/* Detailed medical vascular system */}
      <DetailedVascularSystem />
      
      {/* Realistic male head */}
      <mesh position={[0, 2.35, 0]}>
        <sphereGeometry args={[0.26, 32, 32]} />
        <meshStandardMaterial color="#F3F4F6" roughness={0.8} />
      </mesh>
      
      {/* Strong neck */}
      <mesh position={[0, 1.95, 0]}>
        <cylinderGeometry args={[0.14, 0.16, 0.4, 16]} />
        <meshStandardMaterial color="#F3F4F6" roughness={0.8} />
      </mesh>
      
      {/* Male torso base - broader shoulders, V-taper */}
      <mesh position={[0, 1.3, 0]}>
        <cylinderGeometry args={[0.22, 0.35, 1.2, 16]} />
        <meshStandardMaterial color="#F9FAFB" roughness={0.9} transparent opacity={0.8} />
      </mesh>
      
      {/* Skeletal structure - spine */}
      <mesh position={[0, 1.2, -0.12]}>
        <cylinderGeometry args={[0.06, 0.06, 2.2, 8]} />
        <meshBasicMaterial color="#FFFFFF" transparent opacity={0.4} />
      </mesh>
      
      {/* Anatomical landmarks */}
      {/* Collarbone */}
      <mesh position={[0, 2.15, 0.1]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.8, 8]} />
        <meshBasicMaterial color="#FFFFFF" transparent opacity={0.3} />
      </mesh>
      
      {/* Ribcage - realistic curve */}
      <mesh position={[0, 1.5, -0.02]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshBasicMaterial color="#FFFFFF" wireframe transparent opacity={0.15} />
      </mesh>
      
      {/* Pelvis - male proportions */}
      <mesh position={[0, 0.35, -0.05]}>
        <boxGeometry args={[0.5, 0.35, 0.3]} />
        <meshBasicMaterial color="#FFFFFF" wireframe transparent opacity={0.15} />
      </mesh>
    </>
  );
};

const BodyModel3DSimple = ({ onBodyPartSelect, selectedPart = null }) => {
  return (
    <div className="w-full h-full bg-gray-900 rounded-xl overflow-hidden">
      <div className="relative w-full h-full">
        <Suspense fallback={
          <div className="flex items-center justify-center w-full h-full text-white">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
              <p>Loading 3D Model...</p>
            </div>
          </div>
        }>
          <Canvas camera={{ position: [0, 0, 6], fov: 60 }}>
            <Simple3DScene 
              onBodyPartSelect={onBodyPartSelect}
              selectedPart={selectedPart}
            />
            <OrbitControls 
              enablePan={true} 
              enableZoom={true}
              enableRotate={true}
              minDistance={2}
              maxDistance={12}
              maxPolarAngle={Math.PI}
              minPolarAngle={0}
            />
          </Canvas>
        </Suspense>
        
        {selectedPart && (
          <div className="absolute top-2 right-2 bg-black/90 text-white px-4 py-3 rounded-lg border border-red-500">
            <div className="text-lg font-bold text-red-400">
              {selectedPart.replace('_', ' ').toUpperCase()}
            </div>
            <div className="text-xs text-gray-300 mt-1">
              MUSCLE GROUP HIGHLIGHTED
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BodyModel3DSimple;