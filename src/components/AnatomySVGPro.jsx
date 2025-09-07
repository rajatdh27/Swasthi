import { useState } from 'react';
import { motion } from 'framer-motion';
import humanBodyFrontImg from '../assets/images/human-body-front-view.png';
import humanBodyBackImg from '../assets/images/human-body-back-view_1.png';

const AnatomySVGPro = ({ view = 'front', onMuscleSelect, selectedMuscle }) => {
  const [hoveredMuscle, setHoveredMuscle] = useState(null);

  const handleMuscleClick = (muscleId, event) => {
    event.stopPropagation();
    console.log(`🔥 CLICKED MUSCLE: ${muscleId}`);
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
    <div className="w-fit mx-auto">
      {/* Image Container */}
      <div className="relative w-fit h-fit mx-auto">
      
        {view === 'front' ? (
          <img 
            src={humanBodyFrontImg} 
            alt="Human Body Front View" 
            className="w-auto h-auto max-w-full max-h-[600px]"
            onClick={() => onMuscleSelect?.(null)}
          />
        ) : (
          <img 
            src={humanBodyBackImg} 
            alt="Human Body Back View" 
            className="w-auto h-auto max-w-full max-h-[600px]"
            onClick={() => onMuscleSelect?.(null)}
          />
        )}
      
        {/* Clickable overlays using absolute positioning - Front view */}
        {view === 'front' && (
          <>
            {/* Chest */}
            <div
              className={`absolute cursor-pointer rounded-lg border-3 border-white shadow-lg flex items-center justify-center transition-opacity duration-200 ${hoveredMuscle === 'chest' || selectedMuscle === 'chest' ? 'opacity-100 bg-red-500' : 'opacity-0 bg-transparent'}`}
              style={{
                left: '35%',
                top: '18%',
                width: '30%',
                height: '17%',
              }}
              onClick={(e) => handleMuscleClick('chest', e)}
              onMouseEnter={() => handleMuscleHover('chest')}
              onMouseLeave={handleMuscleLeave}
              title="Chest"
            >
              <div className="w-16 h-12 bg-white rounded-lg opacity-80"></div>
            </div>
            
            {/* Left Shoulder */}
            <div
              className={`absolute cursor-pointer rounded-full w-12 h-12 border-3 border-white shadow-lg flex items-center justify-center transition-opacity duration-200 ${hoveredMuscle === 'left_shoulder' || selectedMuscle === 'left_shoulder' ? 'opacity-100 bg-orange-500' : 'opacity-0 bg-transparent'}`}
              style={{
                left: '25%',
                top: '18%',
              }}
              onClick={(e) => handleMuscleClick('left_shoulder', e)}
              onMouseEnter={() => handleMuscleHover('left_shoulder')}
              onMouseLeave={handleMuscleLeave}
              title="Left Shoulder"
            >
              <div className="w-5 h-5 bg-white rounded-full"></div>
            </div>
            
            {/* Right Shoulder */}
            <div
              className={`absolute cursor-pointer rounded-full w-12 h-12 border-3 border-white shadow-lg flex items-center justify-center transition-opacity duration-200 ${hoveredMuscle === 'right_shoulder' || selectedMuscle === 'right_shoulder' ? 'opacity-100 bg-orange-500' : 'opacity-0 bg-transparent'}`}
              style={{
                right: '23%',
                top: '18.5%',
              }}
              onClick={(e) => handleMuscleClick('right_shoulder', e)}
              onMouseEnter={() => handleMuscleHover('right_shoulder')}
              onMouseLeave={handleMuscleLeave}
              title="Right Shoulder"
            >
              <div className="w-5 h-5 bg-white rounded-full"></div>
            </div>
            
            {/* Left Bicep */}
            <div
              className={`absolute cursor-pointer rounded-full w-8 h-16 border-3 border-white shadow-lg flex items-center justify-center transition-opacity duration-200 ${hoveredMuscle === 'left_bicep' || selectedMuscle === 'left_bicep' ? 'opacity-100 bg-yellow-500' : 'opacity-0 bg-transparent'}`}
              style={{
                left: '25.5%',
                top: '26%',
                transform: 'rotate(30deg)',
              }}
              onClick={(e) => handleMuscleClick('left_bicep', e)}
              onMouseEnter={() => handleMuscleHover('left_bicep')}
              onMouseLeave={handleMuscleLeave}
              title="Left Bicep"
            >
              <div className="w-4 h-8 bg-white rounded-full"></div>
            </div>
            
            {/* Right Bicep */}
            <div
              className={`absolute cursor-pointer rounded-full w-8 h-16 border-3 border-white shadow-lg flex items-center justify-center transition-opacity duration-200 ${hoveredMuscle === 'right_bicep' || selectedMuscle === 'right_bicep' ? 'opacity-100 bg-yellow-500' : 'opacity-0 bg-transparent'}`}
              style={{
                right: '25.5%',
                top: '26%',
                transform: 'rotate(-30deg)',
              }}
              onClick={(e) => handleMuscleClick('right_bicep', e)}
              onMouseEnter={() => handleMuscleHover('right_bicep')}
              onMouseLeave={handleMuscleLeave}
              title="Right Bicep"
            >
              <div className="w-4 h-8 bg-white rounded-full"></div>
            </div>

            {/* Abs */}
            <div
              className={`absolute cursor-pointer rounded-lg border-3 border-white shadow-lg flex items-center justify-center transition-opacity duration-200 ${hoveredMuscle === 'abs' || selectedMuscle === 'abs' ? 'opacity-100 bg-blue-500' : 'opacity-0 bg-transparent'}`}
              style={{
                left: '42%',
                top: '40%', 
                width: '16%',
                height: '14%',
              }}
              onClick={(e) => handleMuscleClick('abs', e)}
              onMouseEnter={() => handleMuscleHover('abs')}
              onMouseLeave={handleMuscleLeave}
              title="Abs"
            >
              <div className="w-8 h-12 bg-white rounded-lg"></div>
            </div>

            {/* Left Forearm */}
            <div
              className={`absolute cursor-pointer rounded-full w-7 h-12 border-3 border-white shadow-lg flex items-center justify-center transition-opacity duration-200 ${hoveredMuscle === 'left_forearm' || selectedMuscle === 'left_forearm' ? 'opacity-100 bg-purple-500' : 'opacity-0 bg-transparent'}`}
              style={{
                left: '22%',
                top: '45%',
                transform: 'rotate(20deg)',
              }}
              onClick={(e) => handleMuscleClick('left_forearm', e)}
              onMouseEnter={() => handleMuscleHover('left_forearm')}
              onMouseLeave={handleMuscleLeave}
              title="Left Forearm"
            >
              <div className="w-3 h-6 bg-white rounded-full"></div>
            </div>

            {/* Right Forearm */}
            <div
              className={`absolute cursor-pointer rounded-full w-7 h-12 border-3 border-white shadow-lg flex items-center justify-center transition-opacity duration-200 ${hoveredMuscle === 'right_forearm' || selectedMuscle === 'right_forearm' ? 'opacity-100 bg-purple-500' : 'opacity-0 bg-transparent'}`}
              style={{
                right: '22%',
                top: '45%',
                transform: 'rotate(-20deg)',
              }}
              onClick={(e) => handleMuscleClick('right_forearm', e)}
              onMouseEnter={() => handleMuscleHover('right_forearm')}
              onMouseLeave={handleMuscleLeave}
              title="Right Forearm"
            >
              <div className="w-3 h-6 bg-white rounded-full"></div>
            </div>

            {/* Left Quad */}
            <div
              className={`absolute cursor-pointer rounded-lg border-3 border-white shadow-lg flex items-center justify-center transition-opacity duration-200 ${hoveredMuscle === 'left_quad' || selectedMuscle === 'left_quad' ? 'opacity-100 bg-green-500' : 'opacity-0 bg-transparent'}`}
              style={{
                left: '38%',
                top: '60%',
                width: '8%',
                height: '18%',
              }}
              onClick={(e) => handleMuscleClick('left_quad', e)}
              onMouseEnter={() => handleMuscleHover('left_quad')}
              onMouseLeave={handleMuscleLeave}
              title="Left Quad"
            >
              <div className="w-6 h-14 bg-white rounded-lg"></div>
            </div>

            {/* Right Quad */}
            <div
              className={`absolute cursor-pointer rounded-lg border-3 border-white shadow-lg flex items-center justify-center transition-opacity duration-200 ${hoveredMuscle === 'right_quad' || selectedMuscle === 'right_quad' ? 'opacity-100 bg-green-500' : 'opacity-0 bg-transparent'}`}
              style={{
                right: '38%',
                top: '60%',
                width: '8%',
                height: '18%',
              }}
              onClick={(e) => handleMuscleClick('right_quad', e)}
              onMouseEnter={() => handleMuscleHover('right_quad')}
              onMouseLeave={handleMuscleLeave}
              title="Right Quad"
            >
              <div className="w-6 h-14 bg-white rounded-lg"></div>
            </div>

            {/* Left Calf */}
            <div
              className={`absolute cursor-pointer rounded-full w-6 h-10 border-3 border-white shadow-lg flex items-center justify-center transition-opacity duration-200 ${hoveredMuscle === 'left_calf' || selectedMuscle === 'left_calf' ? 'opacity-100 bg-pink-500' : 'opacity-0 bg-transparent'}`}
              style={{
                left: '40%',
                top: '83%',
              }}
              onClick={(e) => handleMuscleClick('left_calf', e)}
              onMouseEnter={() => handleMuscleHover('left_calf')}
              onMouseLeave={handleMuscleLeave}
              title="Left Calf"
            >
              <div className="w-3 h-5 bg-white rounded-full"></div>
            </div>

            {/* Right Calf */}
            <div
              className={`absolute cursor-pointer rounded-full w-6 h-10 border-3 border-white shadow-lg flex items-center justify-center transition-opacity duration-200 ${hoveredMuscle === 'right_calf' || selectedMuscle === 'right_calf' ? 'opacity-100 bg-pink-500' : 'opacity-0 bg-transparent'}`}
              style={{
                right: '40%',
                top: '83%',
              }}
              onClick={(e) => handleMuscleClick('right_calf', e)}
              onMouseEnter={() => handleMuscleHover('right_calf')}
              onMouseLeave={handleMuscleLeave}
              title="Right Calf"
            >
              <div className="w-3 h-5 bg-white rounded-full"></div>
            </div>
          </>
        )}

        {/* Back view muscles */}
        {view === 'back' && (
          <>
            {/* Upper Back / Lats */}
            <div
              className={`absolute cursor-pointer rounded-lg border-3 border-white shadow-lg flex items-center justify-center transition-opacity duration-200 ${hoveredMuscle === 'back' || selectedMuscle === 'back' ? 'opacity-100 bg-gray-600' : 'opacity-0 bg-transparent'}`}
              style={{
                left: '30%',
                top: '20%',
                width: '40%',
                height: '25%',
              }}
              onClick={(e) => handleMuscleClick('back', e)}
              onMouseEnter={() => handleMuscleHover('back')}
              onMouseLeave={handleMuscleLeave}
              title="Back"
            >
              <div className="w-20 h-16 bg-white rounded-lg opacity-80"></div>
            </div>

            {/* Glutes */}
            <div
              className={`absolute cursor-pointer rounded-lg border-3 border-white shadow-lg flex items-center justify-center transition-opacity duration-200 ${hoveredMuscle === 'glutes' || selectedMuscle === 'glutes' ? 'opacity-100 bg-indigo-500' : 'opacity-0 bg-transparent'}`}
              style={{
                left: '35%',
                top: '50%',
                width: '30%',
                height: '12%',
              }}
              onClick={(e) => handleMuscleClick('glutes', e)}
              onMouseEnter={() => handleMuscleHover('glutes')}
              onMouseLeave={handleMuscleLeave}
              title="Glutes"
            >
              <div className="w-16 h-8 bg-white rounded-lg opacity-80"></div>
            </div>

            {/* Left Hamstring */}
            <div
              className={`absolute cursor-pointer rounded-lg border-3 border-white shadow-lg flex items-center justify-center transition-opacity duration-200 ${hoveredMuscle === 'left_hamstring' || selectedMuscle === 'left_hamstring' ? 'opacity-100 bg-teal-500' : 'opacity-0 bg-transparent'}`}
              style={{
                left: '38%',
                top: '65%',
                width: '8%',
                height: '15%',
              }}
              onClick={(e) => handleMuscleClick('left_hamstring', e)}
              onMouseEnter={() => handleMuscleHover('left_hamstring')}
              onMouseLeave={handleMuscleLeave}
              title="Left Hamstring"
            >
              <div className="w-6 h-12 bg-white rounded-lg"></div>
            </div>

            {/* Right Hamstring */}
            <div
              className={`absolute cursor-pointer rounded-lg border-3 border-white shadow-lg flex items-center justify-center transition-opacity duration-200 ${hoveredMuscle === 'right_hamstring' || selectedMuscle === 'right_hamstring' ? 'opacity-100 bg-teal-500' : 'opacity-0 bg-transparent'}`}
              style={{
                right: '38%',
                top: '65%',
                width: '8%',
                height: '15%',
              }}
              onClick={(e) => handleMuscleClick('right_hamstring', e)}
              onMouseEnter={() => handleMuscleHover('right_hamstring')}
              onMouseLeave={handleMuscleLeave}
              title="Right Hamstring"
            >
              <div className="w-6 h-12 bg-white rounded-lg"></div>
            </div>
          </>
        )}

        {/* Selected muscle info */}
        {selectedMuscle && (
          <motion.div
            className="absolute bottom-4 left-4 right-4 bg-white dark:bg-gray-900 bg-opacity-95 dark:bg-opacity-95 text-gray-800 dark:text-gray-100 p-4 rounded-lg shadow-lg border dark:border-gray-700 z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="font-bold text-lg mb-2">
              {selectedMuscle.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
              {selectedMuscle.includes('chest') && 'The pectoralis major is a large muscle in the upper chest that helps move the arm across the body.'}
              {selectedMuscle === 'abs' && 'The abdominal muscles support the core and help with posture, breathing, and trunk movement.'}
              {selectedMuscle.includes('shoulder') && 'The deltoids are the rounded muscles at the top of the arms and shoulders, responsible for lifting the arms.'}
              {selectedMuscle.includes('bicep') && 'The biceps brachii are muscles at the front of the upper arms that flex the elbow and rotate the forearm.'}
              {selectedMuscle.includes('forearm') && 'The forearm muscles control wrist and finger movements, providing grip strength and dexterity.'}
              {selectedMuscle.includes('quad') && 'The quadriceps are four muscles at the front of the thigh responsible for knee extension and hip flexion.'}
              {selectedMuscle.includes('calf') && 'The calf muscles (gastrocnemius and soleus) provide power for walking, running, and jumping.'}
              {selectedMuscle.includes('back') && 'The latissimus dorsi are broad back muscles for arm adduction and extension.'}
              {selectedMuscle.includes('glutes') && 'The gluteus maximus is the largest muscle in the body responsible for hip extension.'}
              {selectedMuscle.includes('hamstring') && 'The hamstrings are three muscles at the back of the thigh for knee flexion and hip extension.'}
            </p>
            
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-gray-100 text-sm mb-2">Recommended Exercises:</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                {selectedMuscle.includes('chest') && (
                  <>
                    <li>• Bench Press</li>
                    <li>• Push-ups</li>
                    <li>• Chest Flyes</li>
                    <li>• Dips</li>
                  </>
                )}
                {selectedMuscle.includes('back') && (
                  <>
                    <li>• Pull-ups</li>
                    <li>• Lat Pulldowns</li>
                    <li>• Rows</li>
                    <li>• Deadlifts</li>
                  </>
                )}
                {selectedMuscle === 'abs' && (
                  <>
                    <li>• Crunches</li>
                    <li>• Planks</li>
                    <li>• Sit-ups</li>
                    <li>• Leg Raises</li>
                  </>
                )}
                {selectedMuscle.includes('shoulder') && (
                  <>
                    <li>• Shoulder Press</li>
                    <li>• Lateral Raises</li>
                    <li>• Front Raises</li>
                    <li>• Arnold Press</li>
                  </>
                )}
                {selectedMuscle.includes('bicep') && (
                  <>
                    <li>• Bicep Curls</li>
                    <li>• Hammer Curls</li>
                    <li>• Pull-ups</li>
                    <li>• Chin-ups</li>
                  </>
                )}
                {selectedMuscle.includes('forearm') && (
                  <>
                    <li>• Wrist Curls</li>
                    <li>• Farmer Walks</li>
                    <li>• Dead Hangs</li>
                    <li>• Reverse Curls</li>
                  </>
                )}
                {selectedMuscle.includes('quad') && (
                  <>
                    <li>• Squats</li>
                    <li>• Lunges</li>
                    <li>• Leg Extensions</li>
                    <li>• Step-ups</li>
                  </>
                )}
                {selectedMuscle.includes('calf') && (
                  <>
                    <li>• Calf Raises</li>
                    <li>• Jump Rope</li>
                    <li>• Running</li>
                    <li>• Box Jumps</li>
                  </>
                )}
                {selectedMuscle.includes('glutes') && (
                  <>
                    <li>• Squats</li>
                    <li>• Deadlifts</li>
                    <li>• Hip Thrusts</li>
                    <li>• Lunges</li>
                  </>
                )}
                {selectedMuscle.includes('hamstring') && (
                  <>
                    <li>• Romanian Deadlifts</li>
                    <li>• Leg Curls</li>
                    <li>• Good Mornings</li>
                    <li>• Stiff-Leg Deadlifts</li>
                  </>
                )}
              </ul>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AnatomySVGPro;