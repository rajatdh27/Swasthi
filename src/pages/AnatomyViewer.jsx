import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Info, RotateCcw, RotateCw } from 'lucide-react';
import { useBodyPart } from '../context/BodyPartContext-simple';
import AnatomySVGPro from '../components/AnatomySVGPro';
import Header from '../components/Header';

const AnatomyViewer = ({ onNavigate }) => {
  const { selectedBodyPart, selectBodyPart, bodyPartLevels } = useBodyPart();
  const [showInfo, setShowInfo] = useState(false);
  const [currentView, setCurrentView] = useState('front');

  const muscleInfo = {
    chest: { 
      fullName: 'Pectoralis Major',
      description: 'Large chest muscle responsible for pushing movements and arm adduction',
      exercises: ['Bench Press', 'Push-ups', 'Chest Flyes', 'Dips']
    },
    left_shoulder: {
      fullName: 'Left Deltoid',
      description: 'Three-headed shoulder muscle for arm elevation and rotation',
      exercises: ['Shoulder Press', 'Lateral Raises', 'Front Raises', 'Arnold Press']
    },
    right_shoulder: {
      fullName: 'Right Deltoid', 
      description: 'Three-headed shoulder muscle for arm elevation and rotation',
      exercises: ['Shoulder Press', 'Lateral Raises', 'Front Raises', 'Arnold Press']
    },
    left_bicep: {
      fullName: 'Left Biceps Brachii',
      description: 'Dual-headed front arm muscle for elbow flexion and supination',
      exercises: ['Bicep Curls', 'Hammer Curls', 'Pull-ups', 'Chin-ups']
    },
    right_bicep: {
      fullName: 'Right Biceps Brachii',
      description: 'Dual-headed front arm muscle for elbow flexion and supination', 
      exercises: ['Bicep Curls', 'Hammer Curls', 'Pull-ups', 'Chin-ups']
    },
    left_forearm: {
      fullName: 'Left Forearm Muscles',
      description: 'Complex muscles controlling wrist and finger movements',
      exercises: ['Wrist Curls', 'Farmer Walks', 'Dead Hangs', 'Reverse Curls']
    },
    right_forearm: {
      fullName: 'Right Forearm Muscles',
      description: 'Complex muscles controlling wrist and finger movements',
      exercises: ['Wrist Curls', 'Farmer Walks', 'Dead Hangs', 'Reverse Curls']
    },
    abs: {
      fullName: 'Rectus Abdominis',
      description: 'Core muscle responsible for spinal flexion and stability',
      exercises: ['Crunches', 'Sit-ups', 'Planks', 'Leg Raises']
    },
    left_quad: {
      fullName: 'Left Quadriceps',
      description: 'Four-headed front thigh muscle for knee extension',
      exercises: ['Squats', 'Lunges', 'Leg Extensions', 'Step-ups']
    },
    right_quad: {
      fullName: 'Right Quadriceps',
      description: 'Four-headed front thigh muscle for knee extension',
      exercises: ['Squats', 'Lunges', 'Leg Extensions', 'Step-ups']
    },
    left_calf: {
      fullName: 'Left Gastrocnemius',
      description: 'Primary calf muscle for plantar flexion and propulsion',
      exercises: ['Calf Raises', 'Jump Rope', 'Running', 'Box Jumps']
    },
    right_calf: {
      fullName: 'Right Gastrocnemius',
      description: 'Primary calf muscle for plantar flexion and propulsion',
      exercises: ['Calf Raises', 'Jump Rope', 'Running', 'Box Jumps']
    },
    back: {
      fullName: 'Latissimus Dorsi',
      description: 'Broad back muscle for arm adduction and extension',
      exercises: ['Pull-ups', 'Lat Pulldowns', 'Rows', 'Deadlifts']
    },
    glutes: {
      fullName: 'Gluteus Maximus',
      description: 'Largest muscle in the body responsible for hip extension',
      exercises: ['Squats', 'Deadlifts', 'Hip Thrusts', 'Lunges']
    },
    traps: {
      fullName: 'Trapezius',
      description: 'Diamond-shaped upper back muscle for shoulder blade movement',
      exercises: ['Shrugs', 'Upright Rows', 'Face Pulls', 'Deadlifts']
    },
    left_tricep: {
      fullName: 'Left Triceps Brachii',
      description: 'Three-headed back arm muscle for elbow extension',
      exercises: ['Tricep Dips', 'Overhead Extension', 'Close-Grip Push-ups', 'Diamond Push-ups']
    },
    right_tricep: {
      fullName: 'Right Triceps Brachii',
      description: 'Three-headed back arm muscle for elbow extension',
      exercises: ['Tricep Dips', 'Overhead Extension', 'Close-Grip Push-ups', 'Diamond Push-ups']
    },
    left_hamstring: {
      fullName: 'Left Hamstrings',
      description: 'Three-muscled back thigh group for knee flexion and hip extension',
      exercises: ['Romanian Deadlifts', 'Leg Curls', 'Good Mornings', 'Stiff-Leg Deadlifts']
    },
    right_hamstring: {
      fullName: 'Right Hamstrings',
      description: 'Three-muscled back thigh group for knee flexion and hip extension',
      exercises: ['Romanian Deadlifts', 'Leg Curls', 'Good Mornings', 'Stiff-Leg Deadlifts']
    }
  };

  const selectedMuscleInfo = selectedBodyPart ? muscleInfo[selectedBodyPart] : null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg pb-24 sm:pb-28 overflow-y-auto">
      {/* Header */}
      <Header 
        title="Sharir Rachana" 
        subtitle={`Interactive 2D muscle anatomy - ${currentView} view`}
      >
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => onNavigate('dashboard')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-dark-hover rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-dark-text-secondary" />
          </button>
          
          <button
            onClick={() => setCurrentView(currentView === 'front' ? 'back' : 'front')}
            className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors border dark:border-gray-500"
          >
            {currentView === 'front' ? <RotateCw className="w-4 h-4 text-gray-700 dark:text-gray-100" /> : <RotateCcw className="w-4 h-4 text-gray-700 dark:text-gray-100" />}
            <span className="text-sm font-medium text-gray-700 dark:text-gray-100">
              {currentView === 'front' ? 'Back View' : 'Front View'}
            </span>
          </button>
          
          <button
            onClick={() => setShowInfo(!showInfo)}
            className={`p-2 rounded-lg transition-colors ${showInfo ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-gray-100 dark:hover:bg-dark-hover text-gray-600 dark:text-dark-text-secondary'}`}
          >
            <Info className="w-5 h-5" />
          </button>
        </div>
      </Header>

      <div className="max-w-4xl mx-auto p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start justify-center">
          {/* Anatomy Model */}
          <motion.div
            className="bg-white dark:bg-dark-surface rounded-xl shadow-sm border dark:border-dark-border overflow-hidden flex-shrink-0 w-full sm:w-auto mx-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <AnatomySVGPro
              view={currentView}
              onMuscleSelect={selectBodyPart}
              selectedMuscle={selectedBodyPart}
            />
          </motion.div>

          {/* Info Panel */}
          <div className="space-y-6">
            {/* Instructions */}
            {showInfo && (
              <motion.div
                className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">How to Use</h3>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• Click any muscle to select it</li>
                  <li>• Switch between front/back views</li>
                  <li>• Hover for muscle names</li>
                  <li>• Selected muscles turn red</li>
                </ul>
              </motion.div>
            )}


            {/* Selected Muscle Info */}
            {false && selectedMuscleInfo && (
              <motion.div
                className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="font-bold text-red-800 dark:text-red-200 text-lg mb-2">
                  {selectedMuscleInfo.fullName}
                </h3>
                <p className="text-red-700 dark:text-red-300 text-sm mb-3">
                  {selectedMuscleInfo.description}
                </p>
                
                <div className="mb-3">
                  <span className="text-xs font-medium text-red-600 dark:text-red-400">
                    Level {bodyPartLevels[selectedBodyPart] || 1}
                  </span>
                </div>
                
                <div>
                  <h4 className="font-semibold text-red-800 dark:text-red-200 text-sm mb-2">
                    Recommended Exercises:
                  </h4>
                  <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                    {selectedMuscleInfo.exercises.map((exercise, index) => (
                      <li key={index}>• {exercise}</li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default AnatomyViewer;