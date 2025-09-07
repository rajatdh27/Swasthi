import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = ({ className = "" }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className={`
        relative p-2 rounded-full transition-all duration-300
        ${isDarkMode 
          ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' 
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }
        ${className}
      `}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={false}
      animate={{ 
        rotate: isDarkMode ? 180 : 0,
      }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        initial={false}
        animate={{ 
          scale: isDarkMode ? 0 : 1,
          opacity: isDarkMode ? 0 : 1,
        }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <Sun className="w-5 h-5" />
      </motion.div>
      
      <motion.div
        initial={false}
        animate={{ 
          scale: isDarkMode ? 1 : 0,
          opacity: isDarkMode ? 1 : 0,
        }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <Moon className="w-5 h-5" />
      </motion.div>
      
      {/* Invisible content to maintain button size */}
      <div className="invisible">
        <Sun className="w-5 h-5" />
      </div>
    </motion.button>
  );
};

export default ThemeToggle;