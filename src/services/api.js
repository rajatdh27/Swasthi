import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.gymgrowth.com';
const API_VERSION = '/v1';

const api = axios.create({
  baseURL: `${API_BASE_URL}${API_VERSION}`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('gymGrowthToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('gymGrowthToken');
      localStorage.removeItem('gymGrowthUser');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return {
        success: true,
        data: response.data,
        user: response.data.user,
        token: response.data.token
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed'
      };
    }
  },

  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      if (response.data.token) {
        localStorage.setItem('gymGrowthToken', response.data.token);
      }
      
      return {
        success: true,
        data: response.data,
        user: response.data.user,
        token: response.data.token
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed'
      };
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
      localStorage.removeItem('gymGrowthToken');
      localStorage.removeItem('gymGrowthUser');
      return { success: true };
    } catch (error) {
      localStorage.removeItem('gymGrowthToken');
      localStorage.removeItem('gymGrowthUser');
      return { success: true };
    }
  },

  refreshToken: async () => {
    try {
      const response = await api.post('/auth/refresh');
      if (response.data.token) {
        localStorage.setItem('gymGrowthToken', response.data.token);
      }
      return {
        success: true,
        token: response.data.token
      };
    } catch (error) {
      return {
        success: false,
        error: 'Token refresh failed'
      };
    }
  },

  forgotPassword: async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Password reset request failed'
      };
    }
  }
};

export const userAPI = {
  getProfile: async () => {
    try {
      const response = await api.get('/user/profile');
      return {
        success: true,
        user: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch profile'
      };
    }
  },

  updateProfile: async (userData) => {
    try {
      const response = await api.put('/user/profile', userData);
      return {
        success: true,
        user: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update profile'
      };
    }
  },

  updateXP: async (xpData) => {
    try {
      const response = await api.post('/user/xp', xpData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update XP'
      };
    }
  },

  updateStreak: async (streakData) => {
    try {
      const response = await api.post('/user/streak', streakData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update streak'
      };
    }
  },

  getAchievements: async () => {
    try {
      const response = await api.get('/user/achievements');
      return {
        success: true,
        achievements: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch achievements'
      };
    }
  }
};

export const workoutAPI = {
  logWorkout: async (workoutData) => {
    try {
      const response = await api.post('/workouts', workoutData);
      return {
        success: true,
        workout: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to log workout'
      };
    }
  },

  getWorkouts: async (params = {}) => {
    try {
      const response = await api.get('/workouts', { params });
      return {
        success: true,
        workouts: response.data.workouts,
        pagination: response.data.pagination
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch workouts'
      };
    }
  },

  getWorkoutById: async (workoutId) => {
    try {
      const response = await api.get(`/workouts/${workoutId}`);
      return {
        success: true,
        workout: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch workout'
      };
    }
  },

  updateWorkout: async (workoutId, workoutData) => {
    try {
      const response = await api.put(`/workouts/${workoutId}`, workoutData);
      return {
        success: true,
        workout: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update workout'
      };
    }
  },

  deleteWorkout: async (workoutId) => {
    try {
      await api.delete(`/workouts/${workoutId}`);
      return {
        success: true
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete workout'
      };
    }
  },

  getWorkoutStats: async (period = '30d') => {
    try {
      const response = await api.get(`/workouts/stats?period=${period}`);
      return {
        success: true,
        stats: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch workout stats'
      };
    }
  }
};

export const exerciseAPI = {
  getExercises: async (params = {}) => {
    try {
      const response = await api.get('/exercises', { params });
      return {
        success: true,
        exercises: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch exercises'
      };
    }
  },

  getExerciseById: async (exerciseId) => {
    try {
      const response = await api.get(`/exercises/${exerciseId}`);
      return {
        success: true,
        exercise: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch exercise'
      };
    }
  },

  createCustomExercise: async (exerciseData) => {
    try {
      const response = await api.post('/exercises/custom', exerciseData);
      return {
        success: true,
        exercise: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create exercise'
      };
    }
  }
};

export const questAPI = {
  getQuests: async () => {
    try {
      const response = await api.get('/quests');
      return {
        success: true,
        quests: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch quests'
      };
    }
  },

  getActiveQuests: async () => {
    try {
      const response = await api.get('/quests/active');
      return {
        success: true,
        quests: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch active quests'
      };
    }
  },

  claimQuestReward: async (questId) => {
    try {
      const response = await api.post(`/quests/${questId}/claim`);
      return {
        success: true,
        reward: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to claim quest reward'
      };
    }
  },

  getQuestProgress: async (questId) => {
    try {
      const response = await api.get(`/quests/${questId}/progress`);
      return {
        success: true,
        progress: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch quest progress'
      };
    }
  }
};

export const progressAPI = {
  getProgressData: async (period = '30d') => {
    try {
      const response = await api.get(`/progress?period=${period}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch progress data'
      };
    }
  },

  getStrengthProgress: async (exerciseId, period = '30d') => {
    try {
      const response = await api.get(`/progress/strength/${exerciseId}?period=${period}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch strength progress'
      };
    }
  },

  getXPHistory: async (period = '30d') => {
    try {
      const response = await api.get(`/progress/xp?period=${period}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch XP history'
      };
    }
  }
};

const mockResponses = {
  mockLogin: async (email, password) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email === 'test@example.com' && password === 'password') {
      const mockUser = {
        id: 'user123',
        name: 'Test User',
        email: 'test@example.com',
        level: 3,
        xp: 1250,
        streak: 5,
        avatarState: 'level3',
        goals: { strength: true, endurance: true },
        achievements: []
      };
      
      localStorage.setItem('gymGrowthToken', 'mock-token-123');
      return {
        success: true,
        user: mockUser,
        token: 'mock-token-123'
      };
    }
    
    return {
      success: false,
      error: 'Invalid credentials'
    };
  }
};

export { mockResponses };
export default api;