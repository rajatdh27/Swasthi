import { motion } from 'framer-motion';
import { Calendar, Target, Flame, Award, Plus, TrendingUp } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useWorkout } from '../context/WorkoutContext';
import { useBodyPart } from '../context/BodyPartContext-simple';
import { useQuests } from '../hooks/useQuests';
import { useXP } from '../hooks/useXP';
import Avatar from '../components/Avatar';
import ProgressBar from '../components/ProgressBar';
import QuestCard from '../components/QuestCard';
import BodyModel3DSimple from '../components/BodyModel3D-simple';
import SwasthiLogo from '../components/SwasthiLogo';

const Dashboard = ({ onNavigate }) => {
  const { user } = useUser();
  const { workoutHistory, calculateWorkoutStats } = useWorkout();
  const { selectedBodyPart, bodyPartLevels, selectBodyPart, getBodyPartStats } = useBodyPart();
  const { activeQuests, questProgress, getUnclaimedRewards } = useQuests();
  const { getProgressToNextLevel } = useXP();

  if (!user) return null;

  const stats = calculateWorkoutStats();
  const levelProgress = getProgressToNextLevel(user.xp, user.level);
  const unclaimedRewards = getUnclaimedRewards();
  const featuredQuests = activeQuests.slice(0, 3);
  const bodyPartStats = getBodyPartStats();

  const quickStats = [
    {
      label: 'Workout Streak',
      value: user.streak,
      unit: 'days',
      icon: Flame,
      color: 'text-orange-500',
      bg: 'bg-orange-50 dark:bg-orange-900/20'
    },
    {
      label: 'Total Workouts',
      value: stats.totalWorkouts,
      unit: 'sessions',
      icon: Calendar,
      color: 'text-blue-500',
      bg: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      label: 'Total XP',
      value: user.xp,
      unit: 'points',
      icon: Award,
      color: 'text-purple-500',
      bg: 'bg-purple-50 dark:bg-purple-900/20'
    },
    {
      label: 'Level Progress',
      value: Math.round(levelProgress.percentage),
      unit: '%',
      icon: TrendingUp,
      color: 'text-green-500',
      bg: 'bg-green-50 dark:bg-green-900/20'
    }
  ];

  const motivationalMessages = [
    "You're crushing your fitness goals! 💪",
    "Every rep counts towards greatness! 🔥",
    "Stay consistent, champion! 🏆",
    "Your dedication is inspiring! ⭐",
    "Push harder, achieve more! 🚀"
  ];

  const todayMessage = motivationalMessages[Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % motivationalMessages.length];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg p-4 pb-20">
      <div className="max-w-4xl mx-auto space-y-6">
        <motion.div
          className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-700 dark:to-purple-700 rounded-2xl p-6 text-white shadow-2xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <SwasthiLogo className="w-10 h-10 flex-shrink-0" />
              <div>
                <h1 className="text-2xl font-bold">Welcome back, {user.name}!</h1>
                <p className="text-indigo-200">{todayMessage}</p>
              </div>
            </div>
            <Avatar level={user.level} xp={user.xp} className="flex-shrink-0" />
          </div>
          
          <div className="bg-white/20 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Level {user.level}</span>
              <span className="text-sm">
                {levelProgress.current} / {levelProgress.required} XP
              </span>
            </div>
            <ProgressBar
              current={levelProgress.current}
              max={levelProgress.required}
              color="indigo"
              size="md"
              showNumbers={false}
              animated={true}
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className={`${stat.bg} rounded-xl p-4`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center space-x-2 mb-2">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                <span className="text-sm font-medium text-gray-600 dark:text-dark-text-secondary">{stat.label}</span>
              </div>
              <div className="flex items-baseline space-x-1">
                <span className="text-2xl font-bold text-gray-800 dark:text-dark-text-primary">{stat.value}</span>
                <span className="text-sm text-gray-500 dark:text-dark-text-muted">{stat.unit}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {unclaimedRewards.length > 0 && (
          <motion.div
            className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800/50 rounded-xl p-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center space-x-2 mb-2">
              <Award className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              <span className="font-bold text-yellow-800 dark:text-yellow-200">
                {unclaimedRewards.length} Quest{unclaimedRewards.length > 1 ? 's' : ''} Completed!
              </span>
            </div>
            <p className="text-yellow-700 dark:text-yellow-300 mb-3">
              You have unclaimed rewards waiting. Visit the Quests page to claim them!
            </p>
            <button
              onClick={() => onNavigate('quests')}
              className="bg-yellow-500 dark:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-yellow-600 dark:hover:bg-yellow-700 transition-colors"
            >
              Claim Rewards
            </button>
          </motion.div>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          <motion.div
            className="bg-white dark:bg-dark-surface rounded-xl p-6 shadow-sm border dark:border-dark-border"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800 dark:text-dark-text-primary">Quick Actions</h2>
              <Target className="w-5 h-5 text-indigo-500" />
            </div>
            
            <div className="space-y-3">
              <motion.button
                onClick={() => onNavigate('workout')}
                className="w-full bg-indigo-600 dark:bg-indigo-500 text-white p-4 rounded-lg font-medium hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Plus className="w-5 h-5" />
                <span>Start Workout</span>
              </motion.button>
              
              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={() => onNavigate('progress')}
                  className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 p-3 rounded-lg font-medium hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors text-sm"
                >
                  View Progress
                </button>
                <button
                  onClick={() => onNavigate('quests')}
                  className="bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 p-3 rounded-lg font-medium hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors text-sm"
                >
                  View Quests
                </button>
              </div>
            </div>
          </motion.div>


          <motion.div
            className="bg-white dark:bg-dark-surface rounded-xl p-6 shadow-sm border dark:border-dark-border"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-lg font-bold text-gray-800 dark:text-dark-text-primary mb-4">Recent Activity</h2>
            
            {workoutHistory.length > 0 ? (
              <div className="space-y-3">
                {workoutHistory.slice(0, 3).map((workout, index) => (
                  <div key={workout.id || index} className="bg-gray-50 dark:bg-dark-card rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-800 dark:text-dark-text-primary">
                        {workout.exercises?.length || 0} exercises
                      </span>
                      <span className="text-sm text-gray-500 dark:text-dark-text-muted">
                        {new Date(workout.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-dark-text-secondary">
                        {workout.exercises?.map(ex => ex.exerciseName).slice(0, 2).join(', ')}
                        {(workout.exercises?.length || 0) > 2 && ` +${workout.exercises.length - 2} more`}
                      </span>
                      <span className="text-indigo-600 font-medium">
                        +{workout.totalXP} XP
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 dark:text-dark-text-muted">No workouts yet</p>
                <p className="text-sm text-gray-400">Start your first workout to see activity here</p>
              </div>
            )}
          </motion.div>
        </div>

        {featuredQuests.length > 0 && (
          <motion.div
            className="bg-white dark:bg-dark-surface rounded-xl p-6 shadow-sm border dark:border-dark-border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800 dark:text-dark-text-primary">Active Quests</h2>
              <button
                onClick={() => onNavigate('quests')}
                className="text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-700 dark:hover:text-indigo-300"
              >
                View All
              </button>
            </div>
            
            <div className="grid gap-4">
              {featuredQuests.map((quest) => (
                <QuestCard
                  key={quest.id}
                  quest={quest}
                  progress={questProgress[quest.id] || 0}
                  isCompleted={questProgress[quest.id] >= quest.target}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;