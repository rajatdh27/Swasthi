import { useState, useEffect, useMemo } from 'react';
import { useUser } from '../context/UserContext';
import { useWorkout } from '../context/WorkoutContext';

export const useQuests = () => {
  const [activeQuests, setActiveQuests] = useState([]);
  const [completedQuests, setCompletedQuests] = useState([]);
  const [questProgress, setQuestProgress] = useState({});
  
  const { user, addAchievement } = useUser();
  const { workoutHistory } = useWorkout();

  const questTemplates = useMemo(() => [
    {
      id: 'first_steps',
      title: 'First Steps',
      description: 'Complete your first workout',
      type: 'milestone',
      difficulty: 'easy',
      target: 1,
      unit: 'workout',
      rewardXP: 100,
      criteria: { type: 'workout_count', value: 1 },
      unlockLevel: 1
    },
    {
      id: 'bench_master_bronze',
      title: 'Bench Press Apprentice',
      description: 'Perform 10 bench press sets',
      type: 'strength',
      difficulty: 'easy',
      target: 10,
      unit: 'sets',
      rewardXP: 150,
      criteria: { type: 'exercise_sets', exercise: 'bench-press', value: 10 },
      unlockLevel: 1
    },
    {
      id: 'consistency_warrior',
      title: 'Consistency Warrior',
      description: 'Work out for 3 consecutive days',
      type: 'consistency',
      difficulty: 'medium',
      target: 3,
      unit: 'days',
      rewardXP: 200,
      criteria: { type: 'streak', value: 3 },
      unlockLevel: 2
    },
    {
      id: 'squat_enthusiast',
      title: 'Squat Enthusiast',
      description: 'Perform 100 total squat reps',
      type: 'strength',
      difficulty: 'medium',
      target: 100,
      unit: 'reps',
      rewardXP: 250,
      criteria: { type: 'exercise_reps', exercise: 'squat', value: 100 },
      unlockLevel: 2
    },
    {
      id: 'deadlift_destroyer',
      title: 'Deadlift Destroyer',
      description: 'Deadlift a total of 1000kg',
      type: 'strength',
      difficulty: 'hard',
      target: 1000,
      unit: 'kg',
      rewardXP: 400,
      criteria: { type: 'exercise_total_weight', exercise: 'deadlift', value: 1000 },
      unlockLevel: 3
    },
    {
      id: 'week_warrior',
      title: 'Week Warrior',
      description: 'Maintain a 7-day workout streak',
      type: 'consistency',
      difficulty: 'hard',
      target: 7,
      unit: 'days',
      rewardXP: 500,
      criteria: { type: 'streak', value: 7 },
      unlockLevel: 3,
      timeLimit: '30 days'
    },
    {
      id: 'pull_up_champion',
      title: 'Pull-up Champion',
      description: 'Complete 50 pull-ups in a single workout',
      type: 'endurance',
      difficulty: 'hard',
      target: 50,
      unit: 'reps',
      rewardXP: 350,
      criteria: { type: 'single_workout_reps', exercise: 'pull-up', value: 50 },
      unlockLevel: 4
    },
    {
      id: 'legendary_lifter',
      title: 'Legendary Lifter',
      description: 'Reach 5000 total XP',
      type: 'milestone',
      difficulty: 'legendary',
      target: 5000,
      unit: 'XP',
      rewardXP: 1000,
      criteria: { type: 'total_xp', value: 5000 },
      unlockLevel: 5,
      requirements: [
        { description: 'Complete at least 20 workouts', completed: false },
        { description: 'Master 3 different exercises', completed: false },
        { description: 'Maintain 7-day streak', completed: false }
      ]
    }
  ], []);

  const calculateProgress = useMemo(() => {
    return (quest) => {
      if (!workoutHistory || !user) return 0;

      const { criteria } = quest;

      switch (criteria.type) {
        case 'workout_count':
          return workoutHistory.length;

        case 'exercise_sets':
          return workoutHistory.reduce((total, workout) => {
            return total + workout.exercises.filter(ex => 
              ex.exerciseId === criteria.exercise
            ).reduce((sets, ex) => sets + ex.sets, 0);
          }, 0);

        case 'exercise_reps':
          return workoutHistory.reduce((total, workout) => {
            return total + workout.exercises.filter(ex => 
              ex.exerciseId === criteria.exercise
            ).reduce((reps, ex) => reps + (ex.sets * ex.reps), 0);
          }, 0);

        case 'exercise_total_weight':
          return workoutHistory.reduce((total, workout) => {
            return total + workout.exercises.filter(ex => 
              ex.exerciseId === criteria.exercise
            ).reduce((weight, ex) => weight + (ex.sets * ex.reps * ex.weight), 0);
          }, 0);

        case 'streak':
          return user.streak || 0;

        case 'total_xp':
          return user.xp || 0;

        case 'single_workout_reps':
          const maxRepsInWorkout = workoutHistory.reduce((max, workout) => {
            const workoutReps = workout.exercises.filter(ex => 
              ex.exerciseId === criteria.exercise
            ).reduce((reps, ex) => reps + (ex.sets * ex.reps), 0);
            return Math.max(max, workoutReps);
          }, 0);
          return maxRepsInWorkout;

        default:
          return 0;
      }
    };
  }, [workoutHistory, user]);

  const updateQuestProgress = () => {
    if (!user) return;

    const newProgress = {};
    const availableQuests = questTemplates.filter(quest => 
      user.level >= quest.unlockLevel && 
      !completedQuests.find(completed => completed.id === quest.id)
    );

    availableQuests.forEach(quest => {
      const progress = calculateProgress(quest);
      newProgress[quest.id] = progress;

      if (progress >= quest.target && !completedQuests.find(c => c.id === quest.id)) {
        completeQuest(quest);
      }
    });

    setQuestProgress(newProgress);
    
    const newActiveQuests = availableQuests.filter(quest => 
      !completedQuests.find(completed => completed.id === quest.id)
    );
    setActiveQuests(newActiveQuests);
  };

  const completeQuest = (quest) => {
    const completedQuest = {
      ...quest,
      completedAt: new Date().toISOString(),
      progress: questProgress[quest.id] || quest.target
    };

    setCompletedQuests(prev => [...prev, completedQuest]);
    
    if (quest.rewardXP > 0) {
      setTimeout(() => {
        // This would trigger XP gain in the user context
      }, 100);
    }

    addAchievement({
      id: `quest_${quest.id}`,
      title: quest.title,
      description: `Completed: ${quest.description}`,
      type: 'quest',
      rarity: quest.difficulty,
      xpReward: quest.rewardXP,
      unlockedAt: new Date().toISOString()
    });

    return true;
  };

  const claimQuestReward = (questId) => {
    const quest = completedQuests.find(q => q.id === questId);
    if (!quest || quest.claimed) return false;

    setCompletedQuests(prev => 
      prev.map(q => q.id === questId ? { ...q, claimed: true } : q)
    );

    return {
      xp: quest.rewardXP,
      title: quest.title
    };
  };

  const getQuestsByDifficulty = (difficulty) => {
    return activeQuests.filter(quest => quest.difficulty === difficulty);
  };

  const getQuestsByType = (type) => {
    return activeQuests.filter(quest => quest.type === type);
  };

  const getUnclaimedRewards = () => {
    return completedQuests.filter(quest => !quest.claimed);
  };

  useEffect(() => {
    const savedCompleted = localStorage.getItem('gymGrowthCompletedQuests');
    if (savedCompleted) {
      try {
        setCompletedQuests(JSON.parse(savedCompleted));
      } catch (error) {
        console.error('Failed to load completed quests:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (completedQuests.length > 0) {
      localStorage.setItem('gymGrowthCompletedQuests', JSON.stringify(completedQuests));
    }
  }, [completedQuests]);

  useEffect(() => {
    updateQuestProgress();
  }, [user, workoutHistory, questTemplates, completedQuests]);

  return {
    activeQuests,
    completedQuests,
    questProgress,
    calculateProgress,
    completeQuest,
    claimQuestReward,
    getQuestsByDifficulty,
    getQuestsByType,
    getUnclaimedRewards,
    updateQuestProgress
  };
};