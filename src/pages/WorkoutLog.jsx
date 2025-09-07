import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Square, Plus, Trash2, Clock, Zap } from 'lucide-react';
import { useWorkout } from '../context/WorkoutContext';
import { useBodyPart } from '../context/BodyPartContext-simple';
import { useUser } from '../context/UserContext';
import ExerciseCard from '../components/ExerciseCard';

const WorkoutLog = ({ onNavigate }) => {
  const {
    availableExercises,
    currentWorkout,
    isWorkoutActive,
    startWorkout,
    addExercise,
    removeExercise,
    finishWorkout,
    cancelWorkout
  } = useWorkout();
  
  const { selectedBodyPart, getFilteredExercises, clearSelection, addBodyPartXP } = useBodyPart();
  
  const { user } = useUser();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [workoutResult, setWorkoutResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const categories = ['all', 'Chest', 'Legs', 'Back', 'Shoulders'];
  
  // Get exercises filtered by both category AND selected body part
  let filteredExercises = selectedCategory === 'all'
    ? availableExercises
    : availableExercises.filter(ex => ex.category === selectedCategory);
    
  // Further filter by selected body part if one is selected
  filteredExercises = getFilteredExercises(filteredExercises);

  const handleStartWorkout = () => {
    startWorkout();
  };

  const handleAddExercise = (exerciseData) => {
    addExercise(exerciseData);
    // Add XP to relevant body parts
    addBodyPartXP(exerciseData.exerciseId, exerciseData.xpEarned);
  };

  const handleRemoveExercise = (index) => {
    removeExercise(index);
  };

  const handleFinishWorkout = () => {
    const result = finishWorkout();
    setWorkoutResult(result);
    setShowConfirmation(true);
  };

  const handleCancelWorkout = () => {
    cancelWorkout();
  };

  const formatDuration = () => {
    if (!currentWorkout.startTime) return '00:00';
    const duration = Date.now() - new Date(currentWorkout.startTime);
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const WorkoutConfirmation = () => (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-2xl p-6 max-w-sm w-full"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          
          <h3 className="text-xl font-bold text-gray-800 dark:text-dark-text-primary mb-2">Workout Complete!</h3>
          
          {workoutResult?.success && (
            <div className="space-y-2 mb-4">
              <p className="text-lg font-semibold text-indigo-600">
                +{workoutResult.xpGained} XP Earned!
              </p>
              
              {workoutResult.leveledUp && (
                <motion.p
                  className="text-lg font-bold text-yellow-600"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1.2 }}
                  transition={{ repeat: 3, duration: 0.3 }}
                >
                  🎉 LEVEL UP! Now Level {workoutResult.newLevel}! 🎉
                </motion.p>
              )}
              
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Great job staying consistent! Keep it up!
              </p>
            </div>
          )}
          
          <button
            onClick={() => {
              setShowConfirmation(false);
              setWorkoutResult(null);
              onNavigate('dashboard');
            }}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg p-4 pb-20">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold text-gray-800 dark:text-dark-text-primary dark:text-dark-text-primary mb-2">Workout Log</h1>
          <p className="text-gray-600 dark:text-dark-text-secondary">Track your exercises and earn XP!</p>
        </motion.div>

        {!isWorkoutActive ? (
          <motion.div
            className="bg-white dark:bg-dark-surface rounded-xl p-8 text-center shadow-sm border dark:border-dark-border"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Play className="w-10 h-10 text-indigo-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-dark-text-primary dark:text-dark-text-primary mb-2">Ready to Work Out?</h2>
            <p className="text-gray-600 dark:text-dark-text-secondary mb-6">
              Start a new workout session to begin logging exercises and earning XP!
            </p>
            <motion.button
              onClick={handleStartWorkout}
              className="bg-indigo-600 dark:bg-indigo-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Workout
            </motion.button>
          </motion.div>
        ) : (
          <>
            <motion.div
              className="bg-white dark:bg-dark-surface rounded-xl p-6 shadow-sm mb-6"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    <span className="font-mono text-lg text-gray-800 dark:text-dark-text-primary">{formatDuration()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    <span className="font-bold text-yellow-600 dark:text-yellow-400">
                      {currentWorkout.totalXP} XP
                    </span>
                  </div>
                </div>
                
                <div className="flex space-x-2 relative">
                  <button
                    onClick={handleCancelWorkout}
                    className="px-4 py-2 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-600 rounded-lg bg-red-50 dark:bg-red-900/20"
                  >
                    Cancel
                  </button>
                  <div 
                    className="relative"
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                  >
                    <button
                      onClick={handleFinishWorkout}
                      disabled={currentWorkout.exercises.length === 0}
                      className="px-4 py-2 bg-green-600 dark:bg-green-500 text-white rounded-lg disabled:bg-red-400 dark:disabled:bg-red-500 disabled:cursor-not-allowed"
                    >
                      Finish
                    </button>
                    
                    {showTooltip && currentWorkout.exercises.length === 0 && (
                      <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap z-50">
                        💪 Add exercises first!
                        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-red-500"></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {currentWorkout.exercises.length > 0 && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Logged Exercises</h3>
                  <div className="space-y-2">
                    {currentWorkout.exercises.map((exercise, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                      >
                        <div className="flex-1">
                          <div className="font-medium">{exercise.exerciseName}</div>
                          <div className="text-sm text-gray-600">
                            {exercise.sets} sets × {exercise.reps} reps @ {exercise.weight}kg
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-sm font-medium text-yellow-600">
                            +{exercise.xpEarned} XP
                          </span>
                          <button
                            onClick={() => handleRemoveExercise(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Plus className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-lg font-bold text-gray-800 dark:text-dark-text-primary">Add Exercise</h2>
                </div>
                
                {selectedBodyPart && (
                  <div className="flex items-center space-x-2">
                    <motion.div
                      className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 px-3 py-1 rounded-full text-sm font-medium"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      Targeting: {selectedBodyPart.replace('_', ' ').toUpperCase()}
                    </motion.div>
                    <button
                      onClick={clearSelection}
                      className="text-gray-400 hover:text-gray-600 text-sm"
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>
              
              <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setIsLoading(true);
                      setTimeout(() => {
                        setSelectedCategory(category);
                        setIsLoading(false);
                      }, 300);
                    }}
                    className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
                      selectedCategory === category
                        ? 'bg-indigo-600 dark:bg-indigo-500 text-white'
                        : 'bg-white dark:bg-dark-surface text-gray-600 dark:text-dark-text-secondary border dark:border-dark-border'
                    }`}
                  >
                    {category === 'all' ? 'All' : category}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {isLoading ? (
                // Premium loading animation
                <>
                  {[1,2,3,4].map((i) => (
                    <div key={i} className="bg-white dark:bg-dark-surface rounded-xl p-6 shadow-sm border dark:border-dark-border animate-pulse">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-200 to-purple-200 dark:from-indigo-800 dark:to-purple-800 rounded-lg"></div>
                        <div className="flex-1 space-y-3">
                          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full w-3/4"></div>
                          <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full w-1/2"></div>
                          <div className="flex space-x-2">
                            <div className="h-8 bg-gradient-to-r from-indigo-200 to-indigo-300 dark:from-indigo-800 dark:to-indigo-700 rounded-lg w-20"></div>
                            <div className="h-8 bg-gradient-to-r from-yellow-200 to-yellow-300 dark:from-yellow-700 dark:to-yellow-600 rounded-lg w-16"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <AnimatePresence>
                  {filteredExercises.map((exercise, index) => (
                    <motion.div
                      key={exercise.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <ExerciseCard
                        exercise={exercise}
                        onLog={handleAddExercise}
                        showXPPreview={true}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </>
        )}
      </div>

      <AnimatePresence>
        {showConfirmation && <WorkoutConfirmation />}
      </AnimatePresence>
    </div>
  );
};

export default WorkoutLog;