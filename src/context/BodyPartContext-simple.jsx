import { createContext, useContext, useReducer, useEffect } from 'react';

const BodyPartContext = createContext();

const initialState = {
  selectedBodyPart: null,
  bodyPartLevels: {
    head: 1,
    chest_left: 1,
    chest_right: 1,
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
    chest_left: 0,
    chest_right: 0,
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

// Exercise to body part mapping (simplified)
const EXERCISE_BODY_PART_MAP = {
  'bench-press': ['chest_left', 'chest_right', 'left_shoulder', 'right_shoulder'],
  'squat': ['left_quad', 'right_quad', 'glutes'],
  'deadlift': ['back', 'left_quad', 'right_quad', 'glutes'],
  'pull-up': ['back', 'left_bicep', 'right_bicep'],
  'push-up': ['chest_left', 'chest_right', 'left_shoulder', 'right_shoulder'],
  'overhead-press': ['left_shoulder', 'right_shoulder', 'chest_left', 'chest_right'],
  'bicep-curl': ['left_bicep', 'right_bicep'],
  'tricep-dip': ['left_forearm', 'right_forearm'],
  'calf-raise': ['left_calf', 'right_calf'],
  'plank': ['abs', 'chest_left', 'chest_right'],
  'sit-up': ['abs'],
  'lat-pulldown': ['back', 'left_bicep', 'right_bicep']
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
        updatedXP[part] = (updatedXP[part] || 0) + xp;
        const newLevel = Math.floor(updatedXP[part] / 100) + 1;
        updatedLevels[part] = Math.max(updatedLevels[part], newLevel);
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
          xp: Math.floor(xpAmount / bodyParts.length)
        } 
      });
    }
  };

  const getFilteredExercises = (availableExercises) => {
    if (!state.selectedBodyPart) return availableExercises;
    
    return availableExercises.filter(exercise => 
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
    EXERCISE_BODY_PART_MAP
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