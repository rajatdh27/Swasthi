import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, Target, Zap } from 'lucide-react';

const ExerciseCard = ({ 
  exercise, 
  onLog, 
  isSelected = false,
  showXPPreview = true 
}) => {
  const [sets, setSets] = useState(1);
  const [reps, setReps] = useState(10);
  const [weight, setWeight] = useState(20);

  const calculateXP = () => {
    const baseXP = 10;
    const weightFactor = weight * 0.5;
    const repsFactor = reps * 0.3;
    const setsFactor = sets * 5;
    return Math.round(baseXP + weightFactor + repsFactor + setsFactor);
  };

  const handleLog = () => {
    onLog({
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      sets,
      reps,
      weight,
      xpEarned: calculateXP()
    });
  };

  const exerciseIcons = {
    'bench-press': '🏋️',
    'squat': '🦵',
    'deadlift': '💪',
    'pull-up': '🔝',
    'push-up': '⬇️',
    'default': '💪'
  };

  return (
    <motion.div
      className={`
        p-6 rounded-xl border-2 transition-all duration-200
        ${isSelected 
          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 shadow-lg' 
          : 'border-gray-200 dark:border-dark-border bg-white dark:bg-dark-surface hover:border-gray-300 dark:hover:border-gray-600'
        }
      `}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      layout
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">
            {exerciseIcons[exercise.type] || exerciseIcons.default}
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-800 dark:text-dark-text-primary">{exercise.name}</h3>
            <p className="text-sm text-gray-500 dark:text-dark-text-muted">{exercise.category}</p>
          </div>
        </div>
        
        {showXPPreview && (
          <div className="flex items-center space-x-1 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded-full">
            <Zap className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
            <span className="text-sm font-bold text-yellow-600 dark:text-yellow-400">
              {calculateXP()} XP
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <label className="block text-xs font-medium text-gray-500 dark:text-dark-text-muted mb-1">
            Sets
          </label>
          <div className="flex items-center justify-center space-x-1">
            <button
              onClick={() => setSets(Math.max(1, sets - 1))}
              className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
            >
              <Minus className="w-3 h-3 text-gray-600 dark:text-gray-300" />
            </button>
            <span className="w-8 text-center font-bold text-gray-800 dark:text-dark-text-primary">{sets}</span>
            <button
              onClick={() => setSets(sets + 1)}
              className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
            >
              <Plus className="w-3 h-3 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>

        <div className="text-center">
          <label className="block text-xs font-medium text-gray-500 dark:text-dark-text-muted mb-1">
            Reps
          </label>
          <div className="flex items-center justify-center space-x-1">
            <button
              onClick={() => setReps(Math.max(1, reps - 1))}
              className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
            >
              <Minus className="w-3 h-3 text-gray-600 dark:text-gray-300" />
            </button>
            <span className="w-8 text-center font-bold text-gray-800 dark:text-dark-text-primary">{reps}</span>
            <button
              onClick={() => setReps(reps + 1)}
              className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
            >
              <Plus className="w-3 h-3 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>

        <div className="text-center">
          <label className="block text-xs font-medium text-gray-500 dark:text-dark-text-muted mb-1">
            Weight (kg)
          </label>
          <div className="flex items-center justify-center space-x-1">
            <button
              onClick={() => setWeight(Math.max(0, weight - 5))}
              className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
            >
              <Minus className="w-3 h-3 text-gray-600 dark:text-gray-300" />
            </button>
            <span className="w-8 text-center font-bold text-gray-800 dark:text-dark-text-primary">{weight}</span>
            <button
              onClick={() => setWeight(weight + 5)}
              className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
            >
              <Plus className="w-3 h-3 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>
      </div>

      <motion.button
        onClick={handleLog}
        className="w-full bg-indigo-600 dark:bg-indigo-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors duration-200"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center justify-center space-x-2">
          <Target className="w-4 h-4" />
          <span>Log Exercise</span>
        </div>
      </motion.button>
    </motion.div>
  );
};

export default ExerciseCard;