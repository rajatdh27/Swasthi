import { motion } from 'framer-motion';

const Avatar = ({ level = 1, xp = 0, className = "" }) => {
  const getAvatarStyle = (level) => {
    const styles = {
      1: { bg: 'bg-gray-400', glow: 'shadow-gray-400/20' },
      2: { bg: 'bg-blue-500', glow: 'shadow-blue-500/30' },
      3: { bg: 'bg-green-500', glow: 'shadow-green-500/30' },
      4: { bg: 'bg-purple-500', glow: 'shadow-purple-500/30' },
      5: { bg: 'bg-yellow-500', glow: 'shadow-yellow-500/30' },
      6: { bg: 'bg-red-500', glow: 'shadow-red-500/30' },
      7: { bg: 'bg-pink-500', glow: 'shadow-pink-500/30' },
      8: { bg: 'bg-indigo-600', glow: 'shadow-indigo-600/40' },
      9: { bg: 'bg-orange-500', glow: 'shadow-orange-500/40' },
      10: { bg: 'bg-gradient-to-tr from-purple-600 to-pink-600', glow: 'shadow-purple-600/50' }
    };
    return styles[Math.min(level, 10)] || styles[1];
  };

  const avatarStyle = getAvatarStyle(level);
  const size = level >= 5 ? 'w-24 h-24' : 'w-20 h-20';
  
  return (
    <div className={`relative ${className}`}>
      <motion.div
        className={`
          ${size} rounded-full ${avatarStyle.bg} ${avatarStyle.glow}
          flex items-center justify-center shadow-lg
          border-4 border-white dark:border-dark-surface
        `}
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300 }}
        whileHover={{ scale: 1.05 }}
      >
        <motion.div
          className="text-white font-bold text-2xl"
          animate={{ rotate: level > 5 ? [0, 10, -10, 0] : 0 }}
          transition={{ duration: 2, repeat: level > 5 ? Infinity : 0 }}
        >
          💪
        </motion.div>
      </motion.div>
      
      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
        <div className="bg-white dark:bg-dark-card rounded-full px-2 py-1 shadow-md border dark:border-dark-border">
          <span className="text-xs font-bold text-gray-800 dark:text-dark-text-primary">{level}</span>
        </div>
      </div>
      
      {level >= 10 && (
        <motion.div
          className="absolute -top-2 -right-2"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-xs">👑</span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Avatar;