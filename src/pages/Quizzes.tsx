import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Play, Trophy, Clock, CheckCircle, XCircle, Plus } from 'lucide-react';

export function Quizzes() {
  const quizzes = [
    {
      id: 1,
      title: 'Quranic Arabic Basics',
      description: 'Test your knowledge of basic Arabic vocabulary and grammar',
      questions: 20,
      duration: '15 minutes',
      difficulty: 'Beginner',
      completed: true,
      score: 85,
      category: 'Arabic',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 2,
      title: 'Hadith Classification',
      description: 'Quiz on hadith authentication and classification methods',
      questions: 15,
      duration: '20 minutes',
      difficulty: 'Intermediate',
      completed: true,
      score: 92,
      category: 'Hadith',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 3,
      title: 'Islamic History Timeline',
      description: 'Test your knowledge of important Islamic historical events',
      questions: 25,
      duration: '30 minutes',
      difficulty: 'Advanced',
      completed: false,
      score: 0,
      category: 'History',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 4,
      title: 'Fiqh Fundamentals',
      description: 'Basic principles of Islamic jurisprudence',
      questions: 18,
      duration: '25 minutes',
      difficulty: 'Intermediate',
      completed: false,
      score: 0,
      category: 'Fiqh',
      color: 'from-orange-500 to-red-500'
    },
  ];

  const recentResults = [
    { quiz: 'Quranic Arabic Basics', score: 85, date: '2024-01-15', status: 'passed' },
    { quiz: 'Hadith Classification', score: 92, date: '2024-01-14', status: 'passed' },
    { quiz: 'Tafsir Methods', score: 78, date: '2024-01-13', status: 'passed' },
    { quiz: 'Islamic Finance', score: 65, date: '2024-01-12', status: 'failed' },
  ];

  const stats = [
    { label: 'Quizzes Completed', value: 12, color: 'text-green-500' },
    { label: 'Average Score', value: '82%', color: 'text-blue-500' },
    { label: 'Perfect Scores', value: 3, color: 'text-yellow-500' },
    { label: 'Study Streak', value: '7 days', color: 'text-purple-500' },
  ];

  return (
    <div className="p-6 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Quizzes & Tests
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Test your knowledge and track your progress
          </p>
        </div>
        <button className="neomorph-button px-6 py-3 rounded-2xl font-semibold text-white bg-gradient-to-r from-green-500 to-blue-500 hover:scale-105 transition-transform flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>Create Quiz</span>
        </button>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => (
          <div key={index} className="glass-card p-6 rounded-2xl text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{stat.value}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
          </div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Available Quizzes */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 space-y-6"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Available Quizzes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quizzes.map((quiz, index) => (
              <motion.div
                key={quiz.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="glass-card p-6 rounded-3xl hover:scale-105 transition-transform relative overflow-hidden"
              >
                <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${quiz.color}`}></div>
                
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {quiz.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {quiz.description}
                      </p>
                    </div>
                    {quiz.completed && (
                      <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                        <CheckCircle className="h-5 w-5" />
                        <span className="text-sm font-medium">{quiz.score}%</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Brain className="h-4 w-4" />
                        <span>{quiz.questions} questions</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{quiz.duration}</span>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      quiz.difficulty === 'Beginner' 
                        ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                        : quiz.difficulty === 'Intermediate'
                        ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400'
                        : 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                    }`}>
                      {quiz.difficulty}
                    </span>
                  </div>

                  <button className="w-full neomorph-button py-3 rounded-2xl font-medium hover:scale-105 transition-transform flex items-center justify-center space-x-2">
                    <Play className="h-4 w-4" />
                    <span>{quiz.completed ? 'Retake Quiz' : 'Start Quiz'}</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Results */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Results</h2>
          <div className="glass-card p-6 rounded-3xl">
            <div className="space-y-4">
              {recentResults.map((result, index) => (
                <div key={index} className="neomorph-inset p-4 rounded-2xl">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {result.quiz}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {result.date}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {result.status === 'passed' ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      <span className={`font-semibold ${
                        result.status === 'passed' 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {result.score}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Achievement */}
          <div className="glass-card p-6 rounded-3xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Quiz Master
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Scored 90%+ in 3 consecutive quizzes
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
