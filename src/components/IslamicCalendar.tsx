import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { useSupabaseApp } from '../context/SupabaseContext';
import { getIslamicDate, getPrayerTimes } from '../utils/islamicCalendar';

export function IslamicCalendar() {
  const { state } = useSupabaseApp();
  const [islamicDate, setIslamicDate] = React.useState(getIslamicDate());
  const [prayerTimes, setPrayerTimes] = React.useState(getPrayerTimes());

  React.useEffect(() => {
    const interval = setInterval(() => {
      setIslamicDate(getIslamicDate());
      setPrayerTimes(getPrayerTimes());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Islamic Date */}
      <div className="glass-card p-6 rounded-3xl">
        <div className="flex items-center space-x-3 mb-4">
          <div className="neomorph-icon p-2 rounded-xl">
            <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Islamic Calendar
          </h3>
        </div>
        <div className="space-y-3">
          <div className="text-sm text-gray-500 dark:text-gray-400">Today</div>
          <div className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            {islamicDate.hijri}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {islamicDate.gregorian}
          </div>
        </div>
      </div>

      {/* Prayer Times */}
      <div className="glass-card p-6 rounded-3xl">
        <div className="flex items-center space-x-3 mb-4">
          <div className="neomorph-icon p-2 rounded-xl">
            <Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Prayer Times
          </h3>
        </div>
        <div className="space-y-3">
          {prayerTimes.map((prayer, index) => (
            <div key={index} className="neomorph-inset p-3 rounded-2xl flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {prayer.name}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {prayer.arabic}
                </span>
              </div>
              <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                {prayer.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
