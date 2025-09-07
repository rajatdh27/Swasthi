import { useMemo } from 'react';

export const useXP = () => {
  const calculateXP = useMemo(() => {
    return (sets, reps, weight, exerciseType = 'default', bonusMultiplier = 1) => {
      const baseXP = 10;
      
      const exerciseMultipliers = {
        'bench-press': 1.5,
        'squat': 2.0,
        'deadlift': 2.5,
        'pull-up': 1.8,
        'push-up': 0.8,
        'overhead-press': 1.2,
        'default': 1.0
      };

      const exerciseMultiplier = exerciseMultipliers[exerciseType] || 1.0;
      
      const weightFactor = Math.max(weight * 0.5, 5);
      const repsFactor = reps * 0.3;
      const setsFactor = sets * 5;
      
      const totalXP = (baseXP + weightFactor + repsFactor + setsFactor) * exerciseMultiplier * bonusMultiplier;
      
      return Math.round(Math.max(totalXP, 5));
    };
  }, []);

  const getXPToNextLevel = useMemo(() => {
    return (currentLevel) => {
      const xpThresholds = [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500, 5500, 6600, 7800, 9100, 10500];
      return xpThresholds[Math.min(currentLevel, xpThresholds.length - 1)] || 12000;
    };
  }, []);

  const getLevelFromXP = useMemo(() => {
    return (totalXP) => {
      const xpThresholds = [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500, 5500, 6600, 7800, 9100, 10500];
      
      for (let i = xpThresholds.length - 1; i >= 0; i--) {
        if (totalXP >= xpThresholds[i]) {
          return i;
        }
      }
      return 1;
    };
  }, []);

  const getProgressToNextLevel = useMemo(() => {
    return (currentXP, currentLevel) => {
      const currentLevelXP = getXPToNextLevel(currentLevel - 1);
      const nextLevelXP = getXPToNextLevel(currentLevel);
      
      const progressXP = currentXP - currentLevelXP;
      const requiredXP = nextLevelXP - currentLevelXP;
      
      return {
        current: Math.max(progressXP, 0),
        required: requiredXP,
        percentage: Math.min((progressXP / requiredXP) * 100, 100)
      };
    };
  }, [getXPToNextLevel]);

  const calculateBonusXP = useMemo(() => {
    return (baseXP, conditions = {}) => {
      let bonusMultiplier = 1;
      let bonuses = [];

      if (conditions.streak >= 7) {
        bonusMultiplier += 0.5;
        bonuses.push('Weekly Streak Bonus (+50%)');
      } else if (conditions.streak >= 3) {
        bonusMultiplier += 0.2;
        bonuses.push('Streak Bonus (+20%)');
      }

      if (conditions.firstWorkoutOfDay) {
        bonusMultiplier += 0.1;
        bonuses.push('Early Bird Bonus (+10%)');
      }

      if (conditions.personalRecord) {
        bonusMultiplier += 0.3;
        bonuses.push('Personal Record (+30%)');
      }

      if (conditions.perfectForm) {
        bonusMultiplier += 0.15;
        bonuses.push('Perfect Form (+15%)');
      }

      const totalXP = Math.round(baseXP * bonusMultiplier);
      const bonusXP = totalXP - baseXP;

      return {
        baseXP,
        bonusXP,
        totalXP,
        multiplier: bonusMultiplier,
        bonuses
      };
    };
  }, []);

  const getAchievementXP = useMemo(() => {
    return (achievementType, tier = 'bronze') => {
      const baseValues = {
        'first_workout': 50,
        'workout_streak': 100,
        'exercise_master': 150,
        'weight_milestone': 200,
        'consistency': 250,
        'strength_goal': 300,
        'endurance_goal': 275,
        'legendary': 500
      };

      const tierMultipliers = {
        'bronze': 1,
        'silver': 1.5,
        'gold': 2,
        'platinum': 2.5,
        'legendary': 3
      };

      const baseXP = baseValues[achievementType] || 50;
      const multiplier = tierMultipliers[tier] || 1;

      return Math.round(baseXP * multiplier);
    };
  }, []);

  const calculateWorkoutScore = useMemo(() => {
    return (exercises, duration, streak = 0) => {
      if (!exercises || exercises.length === 0) return 0;

      const totalXP = exercises.reduce((sum, exercise) => sum + (exercise.xpEarned || 0), 0);
      const exerciseCount = exercises.length;
      const avgXPPerExercise = totalXP / exerciseCount;
      
      let durationMultiplier = 1;
      if (duration > 0) {
        const durationMinutes = duration / (1000 * 60);
        if (durationMinutes >= 30 && durationMinutes <= 90) {
          durationMultiplier = 1.2;
        } else if (durationMinutes > 90) {
          durationMultiplier = 0.9;
        }
      }

      let streakMultiplier = 1 + (streak * 0.05);
      streakMultiplier = Math.min(streakMultiplier, 2);

      const baseScore = (totalXP * 0.7) + (exerciseCount * 10) + (avgXPPerExercise * 0.3);
      const finalScore = Math.round(baseScore * durationMultiplier * streakMultiplier);

      return {
        totalXP,
        exerciseCount,
        avgXPPerExercise: Math.round(avgXPPerExercise),
        durationMultiplier,
        streakMultiplier,
        finalScore
      };
    };
  }, []);

  return {
    calculateXP,
    getXPToNextLevel,
    getLevelFromXP,
    getProgressToNextLevel,
    calculateBonusXP,
    getAchievementXP,
    calculateWorkoutScore
  };
};