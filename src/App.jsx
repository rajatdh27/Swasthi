import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Dumbbell, TrendingUp, Target, User } from 'lucide-react';

import { UserProvider, useUser } from './context/UserContext';
import { WorkoutProvider } from './context/WorkoutContext';
import { BodyPartProvider } from './context/BodyPartContext-simple';
import { ThemeProvider } from './context/ThemeContext';
import ThemeToggle from './components/ThemeToggle';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import WorkoutLog from './pages/WorkoutLog';
import Progress from './pages/Progress';
import Quests from './pages/Quests';
import AnatomyViewer from './pages/AnatomyViewer';

import './App.css';

const NavigationBar = ({ currentPage, onNavigate }) => {
  const navItems = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'workout', label: 'Workout', icon: Dumbbell },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'anatomy', label: 'Sharir Rachana', icon: User },
    { id: 'quests', label: 'Quests', icon: Target },
  ];

  return (
    <motion.nav
      className="fixed bottom-0 left-0 right-0 bg-white dark:bg-dark-surface border-t border-gray-200 dark:border-dark-border px-4 py-2 z-40 backdrop-blur-lg"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="flex justify-between items-center max-w-md mx-auto">
        <div className="flex justify-around items-center flex-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors ${
                currentPage === item.id
                  ? 'text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 dark:text-indigo-400'
                  : 'text-gray-600 dark:text-dark-text-secondary hover:text-indigo-600 dark:hover:text-indigo-400'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
        </div>
        
        <div className="ml-4">
          <ThemeToggle />
        </div>
      </div>
    </motion.nav>
  );
};

const AppContent = () => {
  const { user, isAuthenticated, loading } = useUser();
  const [currentPage, setCurrentPage] = useState('dashboard');

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Swasthi...</p>
        </motion.div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Login />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'workout':
        return <WorkoutLog onNavigate={handleNavigate} />;
      case 'progress':
        return <Progress onNavigate={handleNavigate} />;
      case 'anatomy':
        return <AnatomyViewer onNavigate={handleNavigate} />;
      case 'quests':
        return <Quests onNavigate={handleNavigate} />;
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg overflow-y-auto transition-colors duration-300">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {renderPage()}
        </motion.div>
      </AnimatePresence>
      
      <NavigationBar currentPage={currentPage} onNavigate={handleNavigate} />
    </div>
  );
};

function App() {
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      window.deferredPrompt = e;
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  return (
    <ThemeProvider>
      <UserProvider>
        <BodyPartProvider>
          <WorkoutProvider>
            <div className="App">
              <AppContent />
            
            {!isInstalled && window.deferredPrompt && (
              <motion.div
                className="fixed top-4 left-4 right-4 bg-indigo-600 dark:bg-indigo-700 text-white p-3 rounded-lg shadow-lg z-50"
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 2 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Install Swasthi</p>
                    <p className="text-sm text-indigo-200">Get quick access from your home screen</p>
                  </div>
                  <button
                    onClick={() => {
                      if (window.deferredPrompt) {
                        window.deferredPrompt.prompt();
                        window.deferredPrompt.userChoice.then((choiceResult) => {
                          if (choiceResult.outcome === 'accepted') {
                            setIsInstalled(true);
                          }
                          window.deferredPrompt = null;
                        });
                      }
                    }}
                    className="bg-white text-indigo-600 px-3 py-1 rounded text-sm font-medium hover:bg-gray-100 transition-colors"
                  >
                    Install
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </WorkoutProvider>
      </BodyPartProvider>
    </UserProvider>
  </ThemeProvider>
  );
}

export default App;
