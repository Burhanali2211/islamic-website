import React from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, MessageCircle, Calendar, BookOpen, User } from 'lucide-react';

export function StudyGroups() {
  const studyGroups = [
    {
      id: 1,
      name: 'Quranic Arabic Study Circle',
      description: 'Learn Arabic through Quranic vocabulary and grammar',
      members: 24,
      subject: 'Arabic Language',
      nextMeeting: '2024-01-20 10:00 AM',
      image: 'https://picsum.photos/400/200?random=1',
      status: 'active'
    },
    {
      id: 2,
      name: 'Hadith Sciences Discussion',
      description: 'Deep dive into hadith authentication and methodology',
      members: 18,
      subject: 'Hadith Studies',
      nextMeeting: '2024-01-22 2:00 PM',
      image: 'https://picsum.photos/400/200?random=2',
      status: 'active'
    },
    {
      id: 3,
      name: 'Islamic History Research',
      description: 'Exploring Islamic civilization and historical events',
      members: 31,
      subject: 'Islamic History',
      nextMeeting: '2024-01-25 6:00 PM',
      image: 'https://picsum.photos/400/200?random=3',
      status: 'active'
    },
    {
      id: 4,
      name: 'Fiqh Study Group',
      description: 'Contemporary fiqh issues and classical jurisprudence',
      members: 15,
      subject: 'Islamic Jurisprudence',
      nextMeeting: '2024-01-28 4:00 PM',
      image: 'https://picsum.photos/400/200?random=4',
      status: 'pending'
    },
  ];

  const recentActivity = [
    { user: 'Ahmed Ali', action: 'shared a resource', group: 'Quranic Arabic Study Circle', time: '2 hours ago' },
    { user: 'Fatima Hassan', action: 'started a discussion', group: 'Hadith Sciences Discussion', time: '4 hours ago' },
    { user: 'Omar Khan', action: 'joined', group: 'Islamic History Research', time: '6 hours ago' },
    { user: 'Aisha Rahman', action: 'posted a question', group: 'Fiqh Study Group', time: '1 day ago' },
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
            Study Groups
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Connect with fellow learners and study together
          </p>
        </div>
        <button className="neomorph-button px-6 py-3 rounded-2xl font-semibold text-white bg-gradient-to-r from-green-500 to-blue-500 hover:scale-105 transition-transform flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>Create Group</span>
        </button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Study Groups */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {studyGroups.map((group, index) => (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="glass-card p-6 rounded-3xl hover:scale-105 transition-transform relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-full blur-xl"></div>
                
                <img
                  src={group.image}
                  alt={group.name}
                  className="w-full h-32 object-cover rounded-2xl mb-4"
                />

                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {group.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {group.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{group.members} members</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <BookOpen className="h-4 w-4" />
                        <span>{group.subject}</span>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      group.status === 'active' 
                        ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400'
                    }`}>
                      {group.status}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4" />
                    <span>Next: {group.nextMeeting}</span>
                  </div>

                  <div className="flex space-x-2">
                    <button className="flex-1 neomorph-button py-2 rounded-xl font-medium hover:scale-105 transition-transform">
                      Join
                    </button>
                    <button className="neomorph-button p-2 rounded-xl hover:scale-105 transition-transform">
                      <MessageCircle className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Activity</h2>
          <div className="glass-card p-6 rounded-3xl">
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="neomorph-inset p-4 rounded-2xl">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 dark:text-white">
                        <span className="font-medium">{activity.user}</span> {activity.action}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {activity.group}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Join */}
          <div className="glass-card p-6 rounded-3xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Join</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Enter group code..."
                className="w-full px-4 py-3 glass-input rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all"
              />
              <button className="w-full neomorph-button py-3 rounded-2xl font-medium hover:scale-105 transition-transform">
                Join Group
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
