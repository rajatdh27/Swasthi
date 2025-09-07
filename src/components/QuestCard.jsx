import { motion } from 'framer-motion';
import { Trophy, Star, Clock, CheckCircle } from 'lucide-react';
import ProgressBar from './ProgressBar';

const QuestCard = ({ 
  quest, 
  progress = 0, 
  isCompleted = false, 
  onClaim 
}) => {
  const progressPercentage = Math.min((progress / quest.target) * 100, 100);
  
  const difficultyColors = {
    easy: { bg: 'bg-green-100 dark:bg-green-900/20', border: 'border-green-300 dark:border-green-600', text: 'text-green-700 dark:text-green-400' },
    medium: { bg: 'bg-yellow-100 dark:bg-yellow-900/20', border: 'border-yellow-300 dark:border-yellow-600', text: 'text-yellow-700 dark:text-yellow-400' },
    hard: { bg: 'bg-red-100 dark:bg-red-900/20', border: 'border-red-300 dark:border-red-600', text: 'text-red-700 dark:text-red-400' },
    legendary: { bg: 'bg-purple-100 dark:bg-purple-900/20', border: 'border-purple-300 dark:border-purple-600', text: 'text-purple-700 dark:text-purple-400' }
  };

  const typeIcons = {
    strength: '💪',
    endurance: '🏃',
    consistency: '📅',
    milestone: '🎯',
    challenge: '⚡'
  };

  const colors = difficultyColors[quest.difficulty] || difficultyColors.easy;

  return (
    <motion.div
      className={`
        relative p-6 rounded-xl border-2 transition-all duration-200
        ${isCompleted 
          ? 'border-green-300 dark:border-green-600 bg-green-50 dark:bg-green-900/20' 
          : `${colors.border} ${colors.bg} dark:border-dark-border dark:bg-dark-surface`
        }
      `}
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      layout
    >
      {isCompleted && (
        <motion.div
          className="absolute -top-2 -right-2"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
            <CheckCircle className="w-5 h-5 text-white" />
          </div>
        </motion.div>
      )}

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">
            {typeIcons[quest.type] || '🎯'}
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-800 dark:text-dark-text-primary">{quest.title}</h3>
            <p className="text-sm text-gray-600 dark:text-dark-text-secondary">{quest.description}</p>
          </div>
        </div>
        
        <div className="flex flex-col items-end space-y-1">
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
            {quest.difficulty}
          </div>
          <div className="flex items-center space-x-1 text-yellow-600">
            <Star className="w-4 h-4" />
            <span className="text-sm font-bold">{quest.rewardXP} XP</span>
          </div>
        </div>
      </div>

      {quest.timeLimit && (
        <div className="flex items-center space-x-2 mb-3 text-gray-500 dark:text-dark-text-muted">
          <Clock className="w-4 h-4" />
          <span className="text-sm">Complete within {quest.timeLimit}</span>
        </div>
      )}

      <div className="mb-4">
        <ProgressBar
          current={Math.min(progress, quest.target)}
          max={quest.target}
          label={`Progress: ${progress}/${quest.target} ${quest.unit}`}
          color={isCompleted ? "green" : quest.difficulty === 'legendary' ? 'purple' : 'blue'}
          size="md"
          animated={true}
        />
      </div>

      {quest.requirements && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-dark-text-secondary mb-2">Requirements:</h4>
          <ul className="space-y-1">
            {quest.requirements.map((req, index) => (
              <li key={index} className="flex items-center space-x-2 text-sm text-gray-600 dark:text-dark-text-secondary">
                <div className={`w-2 h-2 rounded-full ${req.completed ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                <span className={req.completed ? 'line-through text-green-600 dark:text-green-400' : ''}>
                  {req.description}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {isCompleted && onClaim && (
        <motion.button
          onClick={() => onClaim(quest.id)}
          className="w-full bg-green-600 dark:bg-green-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 dark:hover:bg-green-600 transition-colors duration-200"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-center space-x-2">
            <Trophy className="w-5 h-5" />
            <span>Claim Reward!</span>
          </div>
        </motion.button>
      )}

      {quest.difficulty === 'legendary' && !isCompleted && (
        <motion.div
          className="absolute inset-0 rounded-xl"
          style={{
            background: 'linear-gradient(45deg, transparent 30%, rgba(147, 51, 234, 0.1) 50%, transparent 70%)',
          }}
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%']
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: 'reverse'
          }}
        />
      )}
    </motion.div>
  );
};

export default QuestCard;