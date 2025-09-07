import { createContext, useContext, useReducer, useEffect } from 'react';

const UserContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null
};

const userReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null };
    
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload
      };
    
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null
      };
    
    case 'UPDATE_XP':
      return {
        ...state,
        user: {
          ...state.user,
          xp: state.user.xp + action.payload.xp,
          level: action.payload.newLevel || state.user.level
        }
      };
    
    case 'UPDATE_STREAK':
      return {
        ...state,
        user: {
          ...state.user,
          streak: action.payload
        }
      };
    
    case 'LEVEL_UP':
      return {
        ...state,
        user: {
          ...state.user,
          level: action.payload.newLevel,
          xp: action.payload.remainingXP
        }
      };
    
    case 'UPDATE_AVATAR_STATE':
      return {
        ...state,
        user: {
          ...state.user,
          avatarState: action.payload
        }
      };
    
    case 'ADD_ACHIEVEMENT':
      return {
        ...state,
        user: {
          ...state.user,
          achievements: [...(state.user.achievements || []), action.payload]
        }
      };
    
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    default:
      return state;
  }
};

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  useEffect(() => {
    const savedUser = localStorage.getItem('gymGrowthUser');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        dispatch({ type: 'LOGIN_SUCCESS', payload: userData });
      } catch (error) {
        console.error('Failed to parse saved user data:', error);
        localStorage.removeItem('gymGrowthUser');
      }
    }
    dispatch({ type: 'SET_LOADING', payload: false });
  }, []);

  useEffect(() => {
    if (state.user) {
      localStorage.setItem('gymGrowthUser', JSON.stringify(state.user));
    } else {
      localStorage.removeItem('gymGrowthUser');
    }
  }, [state.user]);

  const login = (userData) => {
    dispatch({ type: 'LOGIN_SUCCESS', payload: userData });
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const updateXP = (xpGained) => {
    if (!state.user) return;
    
    const currentXP = state.user.xp;
    const currentLevel = state.user.level;
    const newXP = currentXP + xpGained;
    
    const xpThresholds = [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500, 5500];
    let newLevel = currentLevel;
    let remainingXP = newXP;
    
    for (let i = currentLevel; i < xpThresholds.length; i++) {
      if (newXP >= xpThresholds[i] && i > currentLevel) {
        newLevel = i;
      }
    }
    
    if (newLevel > currentLevel) {
      dispatch({ 
        type: 'LEVEL_UP', 
        payload: { newLevel, remainingXP: newXP } 
      });
      
      dispatch({ 
        type: 'UPDATE_AVATAR_STATE', 
        payload: `level${newLevel}` 
      });
      
      return { leveledUp: true, newLevel, xpGained };
    } else {
      dispatch({ 
        type: 'UPDATE_XP', 
        payload: { xp: xpGained } 
      });
      return { leveledUp: false, xpGained };
    }
  };

  const updateStreak = (newStreak) => {
    dispatch({ type: 'UPDATE_STREAK', payload: newStreak });
  };

  const addAchievement = (achievement) => {
    dispatch({ type: 'ADD_ACHIEVEMENT', payload: achievement });
  };

  const value = {
    ...state,
    login,
    logout,
    updateXP,
    updateStreak,
    addAchievement
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export { UserContext };