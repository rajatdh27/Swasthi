import { createContext, useContext, useReducer, useEffect } from 'react';
import { useWorkout } from './WorkoutContext';

const BodyPartContext = createContext();

const initialState = {
  selectedBodyPart: null,
  bodyPartLevels: {
    head: 1,
    chest: 1,
    abs: 1,
    left_shoulder: 1,
    right_shoulder: 1,
    left_bicep: 1,
    right_bicep: 1,
    left_forearm: 1,
    right_forearm: 1,
    left_quad: 1,
    right_quad: 1,
    left_calf: 1,
    right_calf: 1,
    back: 1,
    glutes: 1
  },
  bodyPartXP: {
    head: 0,
    chest: 0,
    abs: 0,
    left_shoulder: 0,
    right_shoulder: 0,
    left_bicep: 0,
    right_bicep: 0,
    left_forearm: 0,
    right_forearm: 0,
    left_quad: 0,
    right_quad: 0,
    left_calf: 0,
    right_calf: 0,
    back: 0,
    glutes: 0
  },
  bodyPartWorkouts: {},
  lastWorkoutDate: {}
};

// Map exercises to body parts
const EXERCISE_BODY_PART_MAP = {
  'bench-press': ['chest', 'left_shoulder', 'right_shoulder'],
  'squat': ['left_quad', 'right_quad', 'glutes'],
  'deadlift': ['back', 'left_quad', 'right_quad', 'glutes'],
  'pull-up': ['back', 'left_bicep', 'right_bicep'],
  'push-up': ['chest', 'left_shoulder', 'right_shoulder'],
  'overhead-press': ['left_shoulder', 'right_shoulder', 'chest'],
  'bicep-curl': ['left_bicep', 'right_bicep'],
  'tricep-dip': ['left_forearm', 'right_forearm'],
  'calf-raise': ['left_calf', 'right_calf'],
  'plank': ['abs', 'chest'],
  'sit-up': ['abs'],
  'lat-pulldown': ['back', 'left_bicep', 'right_bicep']
};

// Body part categories for exercise filtering
const BODY_PART_CATEGORIES = {
  chest: 'Chest',
  abs: 'Abs',
  left_shoulder: 'Shoulders',
  right_shoulder: 'Shoulders',
  left_bicep: 'Arms',
  right_bicep: 'Arms',
  left_forearm: 'Arms',
  right_forearm: 'Arms',
  left_quad: 'Legs',
  right_quad: 'Legs',
  left_calf: 'Legs',
  right_calf: 'Legs',
  back: 'Back',
  glutes: 'Legs'
};

const bodyPartReducer = (state, action) => {
  switch (action.type) {
    case 'SELECT_BODY_PART':
      return {
        ...state,
        selectedBodyPart: action.payload
      };

    case 'ADD_BODY_PART_XP':
      const { bodyParts, xp } = action.payload;
      const updatedXP = { ...state.bodyPartXP };
      const updatedLevels = { ...state.bodyPartLevels };
      const updatedWorkouts = { ...state.bodyPartWorkouts };

      bodyParts.forEach(part => {
        // Add XP
        updatedXP[part] = (updatedXP[part] || 0) + xp;
        
        // Calculate new level (every 100 XP = 1 level)
        const newLevel = Math.floor(updatedXP[part] / 100) + 1;
        updatedLevels[part] = Math.max(updatedLevels[part], newLevel);
        
        // Track workout count
        updatedWorkouts[part] = (updatedWorkouts[part] || 0) + 1;
      });

      return {
        ...state,
        bodyPartXP: updatedXP,
        bodyPartLevels: updatedLevels,
        bodyPartWorkouts: updatedWorkouts,
        lastWorkoutDate: {
          ...state.lastWorkoutDate,
          ...bodyParts.reduce((acc, part) => ({ 
            ...acc, 
            [part]: new Date().toISOString() 
          }), {})
        }
      };

    case 'LOAD_BODY_PART_DATA':
      return {
        ...state,
        ...action.payload
      };

    case 'RESET_SELECTION':
      return {
        ...state,
        selectedBodyPart: null
      };

    default:
      return state;
  }
};

export const BodyPartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(bodyPartReducer, initialState);
  const { workoutHistory } = useWorkout();

  // Load saved data
  useEffect(() => {
    const savedData = localStorage.getItem('gymGrowthBodyPartData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        dispatch({ type: 'LOAD_BODY_PART_DATA', payload: parsedData });
      } catch (error) {
        console.error('Failed to load body part data:', error);
      }
    }
  }, []);

  // Save data when it changes
  useEffect(() => {
    const dataToSave = {
      bodyPartLevels: state.bodyPartLevels,
      bodyPartXP: state.bodyPartXP,
      bodyPartWorkouts: state.bodyPartWorkouts,
      lastWorkoutDate: state.lastWorkoutDate
    };
    localStorage.setItem('gymGrowthBodyPartData', JSON.stringify(dataToSave));
  }, [state.bodyPartLevels, state.bodyPartXP, state.bodyPartWorkouts, state.lastWorkoutDate]);

  const selectBodyPart = (bodyPart) => {
    dispatch({ type: 'SELECT_BODY_PART', payload: bodyPart });
  };

  const clearSelection = () => {
    dispatch({ type: 'RESET_SELECTION' });
  };

  const addBodyPartXP = (exerciseId, xpAmount) => {
    const bodyParts = EXERCISE_BODY_PART_MAP[exerciseId] || [];
    if (bodyParts.length > 0) {
      dispatch({ 
        type: 'ADD_BODY_PART_XP', 
        payload: { 
          bodyParts, 
          xp: Math.floor(xpAmount / bodyParts.length) // Distribute XP among body parts
        } 
      });
    }
  };

  const getFilteredExercises = (availableExercises) => {
    if (!state.selectedBodyPart) return availableExercises;

    const targetCategory = BODY_PART_CATEGORIES[state.selectedBodyPart];
    if (!targetCategory) return availableExercises;

    return availableExercises.filter(exercise => 
      exercise.category === targetCategory ||
      EXERCISE_BODY_PART_MAP[exercise.id]?.includes(state.selectedBodyPart)
    );
  };

  const getBodyPartProgress = (bodyPart) => {
    const currentXP = state.bodyPartXP[bodyPart] || 0;
    const currentLevel = state.bodyPartLevels[bodyPart] || 1;
    const xpForCurrentLevel = (currentLevel - 1) * 100;
    const xpForNextLevel = currentLevel * 100;
    const progressXP = currentXP - xpForCurrentLevel;
    const requiredXP = xpForNextLevel - xpForCurrentLevel;

    return {
      level: currentLevel,
      currentXP: progressXP,
      requiredXP,
      percentage: (progressXP / requiredXP) * 100,
      totalXP: currentXP,
      workoutCount: state.bodyPartWorkouts[bodyPart] || 0,
      lastWorked: state.lastWorkoutDate[bodyPart]
    };
  };

  const getBodyPartStats = () => {
    const bodyParts = Object.keys(state.bodyPartLevels);
    const totalLevels = bodyParts.reduce((sum, part) => sum + state.bodyPartLevels[part], 0);
    const avgLevel = totalLevels / bodyParts.length;
    const maxLevel = Math.max(...Object.values(state.bodyPartLevels));
    const minLevel = Math.min(...Object.values(state.bodyPartLevels));
    
    return {
      averageLevel: Math.round(avgLevel * 10) / 10,
      maxLevel,
      minLevel,
      totalBodyPartXP: Object.values(state.bodyPartXP).reduce((sum, xp) => sum + xp, 0),
      mostDevelopedPart: bodyParts.find(part => state.bodyPartLevels[part] === maxLevel),
      leastDevelopedPart: bodyParts.find(part => state.bodyPartLevels[part] === minLevel)
    };
  };

  const value = {
    ...state,
    selectBodyPart,
    clearSelection,
    addBodyPartXP,
    getFilteredExercises,
    getBodyPartProgress,
    getBodyPartStats,
    EXERCISE_BODY_PART_MAP,
    BODY_PART_CATEGORIES
  };

  return (
    <BodyPartContext.Provider value={value}>
      {children}
    </BodyPartContext.Provider>
  );
};

export const useBodyPart = () => {
  const context = useContext(BodyPartContext);
  if (!context) {
    throw new Error('useBodyPart must be used within a BodyPartProvider');
  }
  return context;
};

export { BodyPartContext };