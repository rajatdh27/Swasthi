import { createContext, useContext, useReducer, useEffect } from 'react';
import { useUser } from './UserContext';

const WorkoutContext = createContext();

const initialState = {
  currentWorkout: {
    exercises: [],
    startTime: null,
    totalXP: 0
  },
  workoutHistory: [],
  availableExercises: [
    {
      id: 'bench-press',
      name: 'Bench Press',
      category: 'Chest',
      type: 'bench-press',
      baseXP: 15
    },
    {
      id: 'squat',
      name: 'Squat',
      category: 'Legs',
      type: 'squat',
      baseXP: 20
    },
    {
      id: 'deadlift',
      name: 'Deadlift',
      category: 'Back',
      type: 'deadlift',
      baseXP: 25
    },
    {
      id: 'pull-up',
      name: 'Pull-up',
      category: 'Back',
      type: 'pull-up',
      baseXP: 18
    },
    {
      id: 'push-up',
      name: 'Push-up',
      category: 'Chest',
      type: 'push-up',
      baseXP: 8
    },
    {
      id: 'overhead-press',
      name: 'Overhead Press',
      category: 'Shoulders',
      type: 'default',
      baseXP: 12
    }
  ],
  isWorkoutActive: false,
  loading: false
};

const workoutReducer = (state, action) => {
  switch (action.type) {
    case 'START_WORKOUT':
      return {
        ...state,
        currentWorkout: {
          exercises: [],
          startTime: new Date(),
          totalXP: 0
        },
        isWorkoutActive: true
      };
    
    case 'ADD_EXERCISE':
      const newExercise = action.payload;
      const updatedExercises = [...state.currentWorkout.exercises, newExercise];
      const newTotalXP = state.currentWorkout.totalXP + newExercise.xpEarned;
      
      return {
        ...state,
        currentWorkout: {
          ...state.currentWorkout,
          exercises: updatedExercises,
          totalXP: newTotalXP
        }
      };
    
    case 'REMOVE_EXERCISE':
      const exerciseToRemove = state.currentWorkout.exercises[action.payload];
      const filteredExercises = state.currentWorkout.exercises.filter((_, index) => index !== action.payload);
      const reducedTotalXP = state.currentWorkout.totalXP - (exerciseToRemove?.xpEarned || 0);
      
      return {
        ...state,
        currentWorkout: {
          ...state.currentWorkout,
          exercises: filteredExercises,
          totalXP: Math.max(0, reducedTotalXP)
        }
      };
    
    case 'FINISH_WORKOUT':
      const finishedWorkout = {
        ...state.currentWorkout,
        endTime: new Date(),
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0]
      };
      
      return {
        ...state,
        workoutHistory: [finishedWorkout, ...state.workoutHistory.slice(0, 49)], // Keep last 50 workouts
        currentWorkout: {
          exercises: [],
          startTime: null,
          totalXP: 0
        },
        isWorkoutActive: false
      };
    
    case 'CANCEL_WORKOUT':
      return {
        ...state,
        currentWorkout: {
          exercises: [],
          startTime: null,
          totalXP: 0
        },
        isWorkoutActive: false
      };
    
    case 'LOAD_WORKOUT_HISTORY':
      return {
        ...state,
        workoutHistory: action.payload,
        loading: false
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    
    default:
      return state;
  }
};

export const WorkoutProvider = ({ children }) => {
  const [state, dispatch] = useReducer(workoutReducer, initialState);
  const { updateXP, updateStreak, user } = useUser();

  useEffect(() => {
    const savedWorkoutHistory = localStorage.getItem('gymGrowthWorkoutHistory');
    if (savedWorkoutHistory) {
      try {
        const history = JSON.parse(savedWorkoutHistory);
        dispatch({ type: 'LOAD_WORKOUT_HISTORY', payload: history });
      } catch (error) {
        console.error('Failed to parse workout history:', error);
        localStorage.removeItem('gymGrowthWorkoutHistory');
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  useEffect(() => {
    if (state.workoutHistory.length > 0) {
      localStorage.setItem('gymGrowthWorkoutHistory', JSON.stringify(state.workoutHistory));
    }
  }, [state.workoutHistory]);

  const startWorkout = () => {
    dispatch({ type: 'START_WORKOUT' });
  };

  const addExercise = (exerciseData) => {
    dispatch({ type: 'ADD_EXERCISE', payload: exerciseData });
  };

  const removeExercise = (index) => {
    dispatch({ type: 'REMOVE_EXERCISE', payload: index });
  };

  const finishWorkout = () => {
    if (state.currentWorkout.exercises.length === 0) {
      return { success: false, message: 'No exercises logged' };
    }

    dispatch({ type: 'FINISH_WORKOUT' });
    
    const xpGained = state.currentWorkout.totalXP;
    const result = updateXP(xpGained);
    
    const today = new Date().toISOString().split('T')[0];
    const lastWorkoutDate = state.workoutHistory[0]?.date;
    
    if (user) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      let newStreak = user.streak || 0;
      
      if (lastWorkoutDate === yesterday) {
        newStreak += 1;
      } else if (lastWorkoutDate !== today) {
        newStreak = 1;
      }
      
      updateStreak(newStreak);
    }
    
    return { 
      success: true, 
      xpGained, 
      leveledUp: result.leveledUp,
      newLevel: result.newLevel 
    };
  };

  const cancelWorkout = () => {
    dispatch({ type: 'CANCEL_WORKOUT' });
  };

  const calculateWorkoutStats = () => {
    if (state.workoutHistory.length === 0) {
      return {
        totalWorkouts: 0,
        totalXP: 0,
        avgWorkoutDuration: 0,
        favoriteExercise: null
      };
    }

    const totalWorkouts = state.workoutHistory.length;
    const totalXP = state.workoutHistory.reduce((sum, workout) => sum + workout.totalXP, 0);
    
    const totalDuration = state.workoutHistory.reduce((sum, workout) => {
      if (workout.startTime && workout.endTime) {
        return sum + (new Date(workout.endTime) - new Date(workout.startTime));
      }
      return sum;
    }, 0);
    
    const avgWorkoutDuration = totalDuration / totalWorkouts / (1000 * 60); // in minutes
    
    const exerciseCounts = {};
    state.workoutHistory.forEach(workout => {
      workout.exercises.forEach(exercise => {
        exerciseCounts[exercise.exerciseName] = (exerciseCounts[exercise.exerciseName] || 0) + 1;
      });
    });
    
    const favoriteExercise = Object.keys(exerciseCounts).reduce((a, b) => 
      exerciseCounts[a] > exerciseCounts[b] ? a : b, null);

    return {
      totalWorkouts,
      totalXP,
      avgWorkoutDuration: Math.round(avgWorkoutDuration),
      favoriteExercise
    };
  };

  const value = {
    ...state,
    startWorkout,
    addExercise,
    removeExercise,
    finishWorkout,
    cancelWorkout,
    calculateWorkoutStats
  };

  return (
    <WorkoutContext.Provider value={value}>
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
};

export { WorkoutContext };