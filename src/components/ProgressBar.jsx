import { motion } from 'framer-motion';

const ProgressBar = ({ 
  current = 0, 
  max = 100, 
  label = "Progress", 
  showNumbers = true,
  color = "blue",
  size = "md",
  animated = true 
}) => {
  const percentage = Math.min((current / max) * 100, 100);
  
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    indigo: 'bg-indigo-500'
  };

  const sizeClasses = {
    sm: 'h-2',
    md: 'h-4',
    lg: 'h-6'
  };

  const glowClasses = {
    blue: 'shadow-blue-500/30',
    green: 'shadow-green-500/30',
    purple: 'shadow-purple-500/30',
    yellow: 'shadow-yellow-500/30',
    red: 'shadow-red-500/30',
    indigo: 'shadow-indigo-500/30'
  };

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-dark-text-secondary">{label}</span>
          {showNumbers && (
            <span className="text-sm text-gray-500 dark:text-dark-text-muted">
              {current} / {max}
            </span>
          )}
        </div>
      )}
      
      <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full ${sizeClasses[size]} overflow-hidden`}>
        <motion.div
          className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full shadow-lg ${glowClasses[color]} relative`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ 
            duration: animated ? 1.5 : 0,
            ease: "easeOut",
            delay: animated ? 0.2 : 0
          }}
        >
          {size === 'lg' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-white">
                {Math.round(percentage)}%
              </span>
            </div>
          )}
          
          {animated && percentage > 0 && (
            <motion.div
              className="absolute top-0 left-0 h-full w-full bg-white/20 rounded-full"
              animate={{ 
                x: ["0%", "100%", "0%"] 
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{ width: '30%' }}
            />
          )}
        </motion.div>
      </div>
      
      {showNumbers && size === 'sm' && (
        <div className="mt-1 text-right">
          <span className="text-xs text-gray-500 dark:text-dark-text-muted">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;