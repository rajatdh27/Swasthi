import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import humanBodyImg from '../assets/images/human-body-front-view.png';

const AnatomySVGPro = ({ view = 'front', onMuscleSelect, selectedMuscle }) => {
  const [hoveredMuscle, setHoveredMuscle] = useState(null);

  const handleMuscleClick = (muscleId, event) => {
    event.stopPropagation();
    console.log(`🔥 CLICKED MUSCLE: ${muscleId}`);
    alert(`Clicked: ${muscleId}`);
    onMuscleSelect?.(muscleId);
  };

  const handleMuscleHover = (muscleId) => {
    setHoveredMuscle(muscleId);
    console.log(`👆 HOVERED MUSCLE: ${muscleId}`);
  };

  const handleMuscleLeave = () => {
    setHoveredMuscle(null);
  };

  return (
    <div className="relative w-full h-full">
      <img 
        src={humanBodyImg} 
        alt="Human Body" 
        className="w-full h-full object-contain"
      />
      
      {/* Clickable overlays using absolute positioning */}
      
      {/* Chest - Green area */}
      <div
        className="absolute cursor-pointer"
        style={{
          left: '35%',
          top: '22%', 
          width: '30%',
          height: '15%',
          backgroundColor: hoveredMuscle === 'chest' ? 'rgba(251, 191, 36, 0.3)' : 'transparent',
          border: selectedMuscle === 'chest' ? '2px solid #ef4444' : hoveredMuscle === 'chest' ? '2px solid #f59e0b' : '2px solid transparent'
        }}
        onClick={(e) => handleMuscleClick('chest', e)}
        onMouseEnter={() => handleMuscleHover('chest')}
        onMouseLeave={handleMuscleLeave}
        title="Chest"
      />
      
      {/* Left Shoulder - Orange area */}
      <div
        className="absolute cursor-pointer rounded-full"
        style={{
          left: '18%',
          top: '12%', 
          width: '15%',
          height: '12%',
          backgroundColor: hoveredMuscle === 'left_shoulder' ? 'rgba(251, 191, 36, 0.3)' : 'transparent',
          border: selectedMuscle === 'left_shoulder' ? '2px solid #ef4444' : hoveredMuscle === 'left_shoulder' ? '2px solid #f59e0b' : '2px solid transparent'
        }}
        onClick={(e) => handleMuscleClick('left_shoulder', e)}
        onMouseEnter={() => handleMuscleHover('left_shoulder')}
        onMouseLeave={handleMuscleLeave}
        title="Left Shoulder"
      />
      
      {/* Right Shoulder - Orange area */}
      <div
        className="absolute cursor-pointer rounded-full"
        style={{
          right: '18%',
          top: '12%', 
          width: '15%',
          height: '12%',
          backgroundColor: hoveredMuscle === 'right_shoulder' ? 'rgba(251, 191, 36, 0.3)' : 'transparent',
          border: selectedMuscle === 'right_shoulder' ? '2px solid #ef4444' : hoveredMuscle === 'right_shoulder' ? '2px solid #f59e0b' : '2px solid transparent'
        }}
        onClick={(e) => handleMuscleClick('right_shoulder', e)}
        onMouseEnter={() => handleMuscleHover('right_shoulder')}
        onMouseLeave={handleMuscleLeave}
        title="Right Shoulder"
      />
      
      {/* Abs - Light blue area */}
      <div
        className="absolute cursor-pointer"
        style={{
          left: '40%',
          top: '38%', 
          width: '20%',
          height: '16%',
          backgroundColor: hoveredMuscle === 'abs' ? 'rgba(251, 191, 36, 0.3)' : 'transparent',
          border: selectedMuscle === 'abs' ? '2px solid #ef4444' : hoveredMuscle === 'abs' ? '2px solid #f59e0b' : '2px solid transparent'
        }}
        onClick={(e) => handleMuscleClick('abs', e)}
        onMouseEnter={() => handleMuscleHover('abs')}
        onMouseLeave={handleMuscleLeave}
        title="Abs"
      />
      
      {/* Left Bicep - Yellow area */}
      <div
        className="absolute cursor-pointer rounded-full"
        style={{
          left: '12%',
          top: '25%', 
          width: '12%',
          height: '10%',
          backgroundColor: hoveredMuscle === 'left_bicep' ? 'rgba(251, 191, 36, 0.3)' : 'transparent',
          border: selectedMuscle === 'left_bicep' ? '2px solid #ef4444' : hoveredMuscle === 'left_bicep' ? '2px solid #f59e0b' : '2px solid transparent'
        }}
        onClick={(e) => handleMuscleClick('left_bicep', e)}
        onMouseEnter={() => handleMuscleHover('left_bicep')}
        onMouseLeave={handleMuscleLeave}
        title="Left Bicep"
      />
      
      {/* Right Bicep - Yellow area */}
      <div
        className="absolute cursor-pointer rounded-full"
        style={{
          right: '12%',
          top: '25%', 
          width: '12%',
          height: '10%',
          backgroundColor: hoveredMuscle === 'right_bicep' ? 'rgba(251, 191, 36, 0.3)' : 'transparent',
          border: selectedMuscle === 'right_bicep' ? '2px solid #ef4444' : hoveredMuscle === 'right_bicep' ? '2px solid #f59e0b' : '2px solid transparent'
        }}
        onClick={(e) => handleMuscleClick('right_bicep', e)}
        onMouseEnter={() => handleMuscleHover('right_bicep')}
        onMouseLeave={handleMuscleLeave}
        title="Right Bicep"
      />

      {/* Muscle labels */}
      {hoveredMuscle && (
        <motion.div
          className="absolute top-4 right-4 bg-black bg-opacity-90 text-white px-3 py-2 rounded-lg text-sm font-medium z-10"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          {hoveredMuscle.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </motion.div>
      )}
      
      {/* Selected muscle info */}
      {selectedMuscle && (
        <motion.div
          className="absolute bottom-4 left-4 right-4 bg-white bg-opacity-95 text-gray-800 p-4 rounded-lg shadow-lg z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="font-bold text-lg mb-2">
            {selectedMuscle.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </h3>
          <p className="text-sm text-gray-600">
            {selectedMuscle === 'chest' && 'The pectoralis major is a large muscle in the upper chest that helps move the arm across the body.'}
            {selectedMuscle === 'abs' && 'The abdominal muscles support the core and help with posture, breathing, and trunk movement.'}
            {selectedMuscle.includes('shoulder') && 'The deltoids are the rounded muscles at the top of the arms and shoulders, responsible for lifting the arms.'}
            {selectedMuscle.includes('bicep') && 'The biceps brachii are muscles at the front of the upper arms that flex the elbow and rotate the forearm.'}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default AnatomySVGPro;