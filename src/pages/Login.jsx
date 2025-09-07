import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Zap } from 'lucide-react';
import SwasthiLogo from '../components/SwasthiLogo';
import { useUser } from '../context/UserContext';
import { mockResponses } from '../services/api';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
    goals: {
      strength: false,
      endurance: false,
      weightLoss: false
    }
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useUser();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('goals.')) {
      const goalName = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        goals: {
          ...prev.goals,
          [goalName]: checked
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const result = await mockResponses.mockLogin(formData.email, formData.password);
        
        if (result.success) {
          login(result.user);
        } else {
          setError(result.error);
        }
      } else {
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }

        const hasGoals = Object.values(formData.goals).some(goal => goal);
        if (!hasGoals) {
          setError('Please select at least one fitness goal');
          setLoading(false);
          return;
        }

        const mockUser = {
          id: Date.now().toString(),
          name: formData.name,
          email: formData.email,
          level: 1,
          xp: 0,
          streak: 0,
          avatarState: 'level1',
          goals: formData.goals,
          achievements: []
        };

        login(mockUser);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }

    setLoading(false);
  };

  const goalOptions = [
    { key: 'strength', label: 'Build Strength', icon: '💪', color: 'text-red-600' },
    { key: 'endurance', label: 'Improve Endurance', icon: '🏃', color: 'text-blue-600' },
    { key: 'weightLoss', label: 'Lose Weight', icon: '⚖️', color: 'text-green-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 dark:from-gray-900 dark:via-gray-800 dark:to-black flex items-center justify-center p-4">
      <motion.div
        className="bg-white dark:bg-dark-surface rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border dark:border-dark-border"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-8">
          <motion.div
            className="text-center mb-8"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="inline-flex items-center space-x-2 mb-4">
              <SwasthiLogo className="w-8 h-8" />
              <h1 className="text-2xl font-bold text-gray-800 dark:text-dark-text-primary">Swasthi</h1>
            </div>
            <p className="text-gray-600 dark:text-dark-text-secondary">
              {isLogin ? 'Welcome back, champion!' : 'Start your fitness journey'}
            </p>
          </motion.div>

          {error && (
            <motion.div
              className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <p className="text-red-600 text-sm">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
              >
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-dark-card text-gray-900 dark:text-dark-text-primary"
                  placeholder="Enter your name"
                  required={!isLogin}
                />
              </motion.div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-dark-card text-gray-900 dark:text-dark-text-primary"
                placeholder="test@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder={isLogin ? "password" : "Create a password"}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-dark-text-secondary"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-dark-card text-gray-900 dark:text-dark-text-primary"
                    placeholder="Confirm your password"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary mb-3">
                    What are your fitness goals? (Select at least one)
                  </label>
                  <div className="space-y-2">
                    {goalOptions.map((goal) => (
                      <label key={goal.key} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          name={`goals.${goal.key}`}
                          checked={formData.goals[goal.key]}
                          onChange={handleInputChange}
                          className="mr-3 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-xl mr-2">{goal.icon}</span>
                        <span className={`font-medium ${goal.color}`}>{goal.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 transform hover:scale-105'
              } text-white shadow-lg`}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{isLogin ? 'Signing In...' : 'Creating Account...'}</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <Zap className="w-5 h-5" />
                  <span>{isLogin ? 'Sign In' : 'Start Your Journey'}</span>
                </div>
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setFormData({
                  email: '',
                  password: '',
                  name: '',
                  confirmPassword: '',
                  goals: {
                    strength: false,
                    endurance: false,
                    weightLoss: false
                  }
                });
              }}
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : 'Already have an account? Sign in'
              }
            </button>
          </div>

          {isLogin && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 dark:text-dark-text-secondary text-center">
                Demo credentials:<br />
                Email: test@example.com<br />
                Password: password
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Login;