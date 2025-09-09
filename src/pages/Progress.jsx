import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Calendar, Award, Target, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useUser } from '../context/UserContext';
import { useWorkout } from '../context/WorkoutContext';
import { useBodyPart } from '../context/BodyPartContext-simple';
import Avatar from '../components/Avatar';
import ProgressBar from '../components/ProgressBar';

const Progress = () => {
  const { user } = useUser();
  const { workoutHistory, calculateWorkoutStats } = useWorkout();
  const { bodyPartLevels, getBodyPartProgress, getBodyPartStats } = useBodyPart();
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('xp');

  const periods = [
    { key: '7d', label: '7 Days' },
    { key: '30d', label: '30 Days' },
    { key: '90d', label: '90 Days' },
    { key: 'all', label: 'All Time' }
  ];

  const metrics = [
    { key: 'xp', label: 'XP Earned', color: '#8B5CF6' },
    { key: 'workouts', label: 'Workouts', color: '#10B981' },
    { key: 'exercises', label: 'Exercises', color: '#F59E0B' }
  ];

  const stats = calculateWorkoutStats();
  const bodyPartStats = getBodyPartStats();

  const filteredData = useMemo(() => {
    if (!workoutHistory.length) return [];

    let cutoffDate = new Date();
    if (selectedPeriod === '7d') {
      cutoffDate.setDate(cutoffDate.getDate() - 7);
    } else if (selectedPeriod === '30d') {
      cutoffDate.setDate(cutoffDate.getDate() - 30);
    } else if (selectedPeriod === '90d') {
      cutoffDate.setDate(cutoffDate.getDate() - 90);
    } else {
      cutoffDate = new Date(0);
    }

    return workoutHistory
      .filter(workout => new Date(workout.date) >= cutoffDate)
      .reverse();
  }, [workoutHistory, selectedPeriod]);

  const chartData = useMemo(() => {
    if (!filteredData.length) return [];

    const dataMap = new Map();

    filteredData.forEach(workout => {
      const date = new Date(workout.date).toLocaleDateString();
      const existing = dataMap.get(date) || { date, xp: 0, workouts: 0, exercises: 0 };
      
      dataMap.set(date, {
        ...existing,
        xp: existing.xp + (workout.totalXP || 0),
        workouts: existing.workouts + 1,
        exercises: existing.exercises + (workout.exercises?.length || 0)
      });
    });

    return Array.from(dataMap.values()).slice(-14);
  }, [filteredData]);

  const exerciseBreakdown = useMemo(() => {
    if (!filteredData.length) return [];

    const exerciseCount = {};
    filteredData.forEach(workout => {
      workout.exercises?.forEach(exercise => {
        if (exerciseCount[exercise.exerciseName]) {
          exerciseCount[exercise.exerciseName] += 1;
        } else {
          exerciseCount[exercise.exerciseName] = 1;
        }
      });
    });

    return Object.entries(exerciseCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [filteredData]);

  const streakData = useMemo(() => {
    if (!workoutHistory.length) return [];

    const last30Days = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      const hasWorkout = workoutHistory.some(workout => workout.date === dateString);
      last30Days.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        hasWorkout: hasWorkout ? 1 : 0
      });
    }

    return last30Days;
  }, [workoutHistory]);

  const progressMetrics = [
    {
      label: 'Total Workouts',
      value: stats.totalWorkouts,
      change: '+12%',
      positive: true,
      icon: Calendar
    },
    {
      label: 'Total XP',
      value: user?.xp || 0,
      change: '+24%',
      positive: true,
      icon: Award
    },
    {
      label: 'Current Streak',
      value: user?.streak || 0,
      change: user?.streak > 3 ? '+15%' : '0%',
      positive: user?.streak > 3,
      icon: Target
    },
    {
      label: 'Avg Duration',
      value: `${stats.avgWorkoutDuration}m`,
      change: '-5%',
      positive: false,
      icon: TrendingUp
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg p-4 pb-24 sm:pb-28 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-6">
        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-dark-text-primary dark:text-dark-text-primary">Progress Tracking</h1>
            <p className="text-gray-600 dark:text-dark-text-secondary dark:text-dark-text-secondary">Monitor your fitness journey and achievements</p>
          </div>
          <Avatar level={user?.level || 1} xp={user?.xp || 0} />
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {progressMetrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              className="bg-white dark:bg-dark-surface rounded-xl p-4 shadow-sm border dark:border-dark-border"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-2">
                <metric.icon className="w-5 h-5 text-indigo-500" />
                <span className={`text-xs font-medium ${
                  metric.positive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.change}
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-800 dark:text-dark-text-primary mb-1">
                {metric.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-dark-text-secondary">{metric.label}</div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="bg-white dark:bg-dark-surface rounded-xl p-6 shadow-sm border dark:border-dark-border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-800 dark:text-dark-text-primary mb-4 md:mb-0">Performance Trends</h2>
            
            <div className="flex flex-wrap gap-2">
              <div className="flex bg-gray-100 dark:bg-dark-card rounded-lg p-1">
                {metrics.map((metric) => (
                  <button
                    key={metric.key}
                    onClick={() => setSelectedMetric(metric.key)}
                    className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                      selectedMetric === metric.key
                        ? 'bg-white text-indigo-600 shadow-sm'
                        : 'text-gray-600 dark:text-dark-text-secondary hover:text-gray-800 dark:text-dark-text-primary'
                    }`}
                  >
                    {metric.label}
                  </button>
                ))}
              </div>
              
              <div className="flex bg-gray-100 dark:bg-dark-card rounded-lg p-1">
                {periods.map((period) => (
                  <button
                    key={period.key}
                    onClick={() => setSelectedPeriod(period.key)}
                    className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                      selectedPeriod === period.key
                        ? 'bg-white text-indigo-600 shadow-sm'
                        : 'text-gray-600 dark:text-dark-text-secondary hover:text-gray-800 dark:text-dark-text-primary'
                    }`}
                  >
                    {period.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="h-80">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#666"
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="#666"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey={selectedMetric}
                    stroke={metrics.find(m => m.key === selectedMetric)?.color || '#8B5CF6'}
                    strokeWidth={3}
                    dot={{ fill: metrics.find(m => m.key === selectedMetric)?.color || '#8B5CF6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: 'white', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-dark-text-muted">No workout data available</p>
                  <p className="text-sm text-gray-400">Start logging workouts to see your progress</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-dark-surface rounded-xl p-6 shadow-sm border dark:border-dark-border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-800 dark:text-dark-text-primary">Body Part Development</h2>
            <div className="text-sm text-gray-500 dark:text-dark-text-muted">
              Average Level: {bodyPartStats?.averageLevel || 1}
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.keys(bodyPartLevels).map((bodyPart) => {
              const progress = getBodyPartProgress(bodyPart);
              return (
                <div key={bodyPart} className="bg-gray-50 dark:bg-dark-card rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-gray-800 dark:text-dark-text-primary">
                      {bodyPart.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </div>
                    <div className="text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 px-2 py-1 rounded-full">
                      Lv. {progress.level}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <ProgressBar
                      current={progress.currentXP}
                      max={progress.requiredXP}
                      showNumbers={false}
                      size="sm"
                      color="indigo"
                      animated={true}
                    />
                    <div className="flex justify-between text-xs text-gray-500 dark:text-dark-text-muted">
                      <span>{progress.currentXP}/{progress.requiredXP} XP</span>
                      <span>{progress.workoutCount} workouts</span>
                    </div>
                  </div>
                  
                  {progress.lastWorked && (
                    <div className="text-xs text-gray-400">
                      Last: {new Date(progress.lastWorked).toLocaleDateString()}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {bodyPartStats?.maxLevel || 1}
              </div>
              <div className="text-sm text-purple-500 dark:text-purple-300">Highest Level</div>
              <div className="text-xs text-gray-500 dark:text-dark-text-muted mt-1">
                {bodyPartStats?.mostDevelopedPart?.replace('_', ' ')}
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {bodyPartStats?.totalBodyPartXP || 0}
              </div>
              <div className="text-sm text-green-500 dark:text-green-300">Total XP</div>
              <div className="text-xs text-gray-500 dark:text-dark-text-muted mt-1">All body parts</div>
            </div>
            
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg p-4">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {bodyPartStats?.minLevel || 1}
              </div>
              <div className="text-sm text-yellow-500 dark:text-yellow-300">Needs Focus</div>
              <div className="text-xs text-gray-500 dark:text-dark-text-muted mt-1">
                {bodyPartStats?.leastDevelopedPart?.replace('_', ' ')}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            className="bg-white dark:bg-dark-surface rounded-xl p-6 shadow-sm border dark:border-dark-border"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-lg font-bold text-gray-800 dark:text-dark-text-primary mb-4">Workout Streak</h2>
            <div className="mb-4">
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-bold text-indigo-600">
                  {user?.streak || 0}
                </span>
                <span className="text-gray-600 dark:text-dark-text-secondary">days</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-dark-text-muted mt-1">
                Current consecutive workout days
              </p>
            </div>

            {streakData.length > 0 && (
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-700 mb-2">Last 30 Days</div>
                <div className="grid grid-cols-10 gap-1">
                  {streakData.slice(-20).map((day, index) => (
                    <div
                      key={index}
                      className={`h-3 w-3 rounded-sm ${
                        day.hasWorkout ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                      title={`${day.date}: ${day.hasWorkout ? 'Workout' : 'Rest'}`}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-500 dark:text-dark-text-muted mt-2">
                  <span>Less</span>
                  <span>More</span>
                </div>
              </div>
            )}
          </motion.div>

          <motion.div
            className="bg-white dark:bg-dark-surface rounded-xl p-6 shadow-sm border dark:border-dark-border"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-lg font-bold text-gray-800 dark:text-dark-text-primary mb-4">Top Exercises</h2>
            {exerciseBreakdown.length > 0 ? (
              <div className="space-y-3">
                {exerciseBreakdown.map((exercise, index) => (
                  <div key={exercise.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-800 dark:text-dark-text-primary">
                        {exercise.name}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-dark-text-secondary">
                        {exercise.count} times
                      </span>
                    </div>
                    <ProgressBar
                      current={exercise.count}
                      max={Math.max(...exerciseBreakdown.map(e => e.count))}
                      showNumbers={false}
                      size="sm"
                      color="indigo"
                      animated={false}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Target className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 dark:text-dark-text-muted">No exercise data yet</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Progress;