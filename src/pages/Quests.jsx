import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Target, Clock, Star, Award } from 'lucide-react';
import { useQuests } from '../hooks/useQuests';
import { useUser } from '../context/UserContext';
import QuestCard from '../components/QuestCard';

const Quests = () => {
  const {
    activeQuests,
    completedQuests,
    questProgress,
    claimQuestReward,
    getQuestsByDifficulty,
    getUnclaimedRewards
  } = useQuests();
  
  const { user, updateXP } = useUser();
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [showCompleted, setShowCompleted] = useState(false);
  const [claimAnimation, setClaimAnimation] = useState(null);

  const difficulties = [
    { key: 'all', label: 'All Quests', color: 'text-gray-600 dark:text-gray-300' },
    { key: 'easy', label: 'Easy', color: 'text-green-600 dark:text-green-400' },
    { key: 'medium', label: 'Medium', color: 'text-yellow-600 dark:text-yellow-400' },
    { key: 'hard', label: 'Hard', color: 'text-red-600 dark:text-red-400' },
    { key: 'legendary', label: 'Legendary', color: 'text-purple-600 dark:text-purple-400' }
  ];

  const filteredQuests = selectedDifficulty === 'all'
    ? activeQuests
    : getQuestsByDifficulty(selectedDifficulty);

  const unclaimedRewards = getUnclaimedRewards();
  const totalActiveQuests = activeQuests.length;
  const totalCompletedQuests = completedQuests.length;

  const handleClaimReward = (questId) => {
    const reward = claimQuestReward(questId);
    if (reward) {
      updateXP(reward.xp);
      setClaimAnimation({ questId, reward });
      setTimeout(() => setClaimAnimation(null), 2000);
    }
  };

  const questStats = [
    {
      label: 'Active Quests',
      value: totalActiveQuests,
      icon: Target,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      label: 'Completed',
      value: totalCompletedQuests,
      icon: Trophy,
      color: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      label: 'Unclaimed Rewards',
      value: unclaimedRewards.length,
      icon: Award,
      color: 'text-yellow-600 dark:text-yellow-400',
      bg: 'bg-yellow-50 dark:bg-yellow-900/20'
    },
    {
      label: 'Current Level',
      value: user?.level || 1,
      icon: Star,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-50 dark:bg-purple-900/20'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg p-4 pb-20">
      <div className="max-w-4xl mx-auto space-y-6">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold text-gray-800 dark:text-dark-text-primary mb-2">Quest Hub</h1>
          <p className="text-gray-600 dark:text-dark-text-secondary">Complete challenges to earn XP and unlock achievements</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {questStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className={`${stat.bg} rounded-xl p-4`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center space-x-2 mb-2">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                <span className="text-sm font-medium text-gray-600 dark:text-dark-text-secondary">{stat.label}</span>
              </div>
              <div className="text-2xl font-bold text-gray-800 dark:text-dark-text-primary">{stat.value}</div>
            </motion.div>
          ))}
        </div>

        {unclaimedRewards.length > 0 && (
          <motion.div
            className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-6 text-white"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Trophy className="w-6 h-6" />
                  <h2 className="text-xl font-bold">Congratulations!</h2>
                </div>
                <p className="text-yellow-100 mb-3">
                  You have {unclaimedRewards.length} completed quest{unclaimedRewards.length > 1 ? 's' : ''} waiting for rewards!
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold mb-1">
                  {unclaimedRewards.reduce((sum, quest) => sum + quest.rewardXP, 0)} XP
                </div>
                <div className="text-yellow-100 text-sm">Total Rewards</div>
              </div>
            </div>
          </motion.div>
        )}

        <div className="bg-white dark:bg-dark-surface rounded-xl p-6 shadow-sm border dark:border-dark-border">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-800 dark:text-dark-text-primary mb-4 md:mb-0">
              {showCompleted ? 'Completed Quests' : 'Active Quests'}
            </h2>
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setShowCompleted(!showCompleted)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  showCompleted
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                }`}
              >
                {showCompleted ? (
                  <>
                    <Trophy className="w-4 h-4 inline mr-1" />
                    Completed ({totalCompletedQuests})
                  </>
                ) : (
                  <>
                    <Clock className="w-4 h-4 inline mr-1" />
                    Active ({totalActiveQuests})
                  </>
                )}
              </button>

              {!showCompleted && (
                <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                  {difficulties.map((difficulty) => (
                    <button
                      key={difficulty.key}
                      onClick={() => setSelectedDifficulty(difficulty.key)}
                      className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                        selectedDifficulty === difficulty.key
                          ? 'bg-white dark:bg-gray-600 shadow-sm'
                          : 'hover:bg-gray-200 dark:hover:bg-gray-600'
                      } ${difficulty.color}`}
                    >
                      {difficulty.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <AnimatePresence mode="wait">
              {!showCompleted ? (
                <motion.div
                  key="active"
                  className="grid gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  {filteredQuests.length > 0 ? (
                    filteredQuests.map((quest, index) => {
                      const progress = questProgress[quest.id] || 0;
                      const isCompleted = progress >= quest.target;
                      
                      return (
                        <motion.div
                          key={quest.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <QuestCard
                            quest={quest}
                            progress={progress}
                            isCompleted={isCompleted}
                            onClaim={isCompleted ? handleClaimReward : null}
                          />
                        </motion.div>
                      );
                    })
                  ) : (
                    <div className="text-center py-12">
                      <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-500 dark:text-dark-text-muted mb-2">
                        No {selectedDifficulty === 'all' ? 'active' : selectedDifficulty} quests available
                      </h3>
                      <p className="text-gray-400">
                        {selectedDifficulty === 'all'
                          ? 'Complete some workouts to unlock new quests!'
                          : `Try a different difficulty level or complete more workouts to unlock ${selectedDifficulty} quests.`
                        }
                      </p>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="completed"
                  className="grid gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  {completedQuests.length > 0 ? (
                    completedQuests.slice(0, 10).map((quest, index) => (
                      <motion.div
                        key={quest.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <QuestCard
                          quest={quest}
                          progress={quest.target}
                          isCompleted={true}
                          onClaim={!quest.claimed ? handleClaimReward : null}
                        />
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-500 dark:text-dark-text-muted mb-2">
                        No completed quests yet
                      </h3>
                      <p className="text-gray-400">
                        Start working out and completing active quests to see them here!
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {claimAnimation && (
          <motion.div
            className="fixed inset-0 pointer-events-none flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-yellow-500 text-white px-6 py-3 rounded-full font-bold text-lg shadow-2xl"
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1.2, y: -20 }}
              exit={{ scale: 0.5, opacity: 0, y: -100 }}
              transition={{ duration: 0.5 }}
            >
              🎉 +{claimAnimation.reward.xp} XP! 🎉
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Quests;