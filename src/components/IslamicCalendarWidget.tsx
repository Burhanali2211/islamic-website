import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Moon, Sun, Clock } from 'lucide-react';

interface IslamicDate {
  hijri: string;
  gregorian: string;
  hijriMonth: string;
  hijriDay: number;
  hijriYear: number;
  gregorianMonth: string;
  gregorianDay: number;
  gregorianYear: number;
  weekday: string;
  weekdayArabic: string;
}

interface PrayerTime {
  name: string;
  nameArabic: string;
  time: string;
  passed: boolean;
}

export function IslamicCalendarWidget() {
  const [islamicDate, setIslamicDate] = useState<IslamicDate | null>(null);
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Hijri months in Arabic
  const hijriMonths = [
    'محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني', 'جمادى الأولى', 'جمادى الثانية',
    'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
  ];

  // Gregorian months in Arabic
  const gregorianMonthsArabic = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];

  // Weekdays in Arabic
  const weekdaysArabic = [
    'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'
  ];

  // Convert Gregorian to Hijri (simplified approximation)
  const convertToHijri = (gregorianDate: Date): IslamicDate => {
    const greg = gregorianDate;
    
    // Simplified Hijri conversion (for demonstration)
    // In a real application, you would use a proper Islamic calendar library
    const hijriEpoch = new Date('622-07-16'); // Approximate start of Islamic calendar
    const daysDiff = Math.floor((greg.getTime() - hijriEpoch.getTime()) / (1000 * 60 * 60 * 24));
    const hijriYear = Math.floor(daysDiff / 354.37) + 1; // Approximate Hijri year
    const dayOfYear = daysDiff % 354;
    const hijriMonth = Math.floor(dayOfYear / 29.5) + 1;
    const hijriDay = Math.floor(dayOfYear % 29.5) + 1;

    return {
      hijri: `${hijriDay} ${hijriMonths[hijriMonth - 1]} ${hijriYear}`,
      gregorian: greg.toLocaleDateString('ar-SA'),
      hijriMonth: hijriMonths[hijriMonth - 1],
      hijriDay: hijriDay,
      hijriYear: hijriYear,
      gregorianMonth: gregorianMonthsArabic[greg.getMonth()],
      gregorianDay: greg.getDate(),
      gregorianYear: greg.getFullYear(),
      weekday: greg.toLocaleDateString('en-US', { weekday: 'long' }),
      weekdayArabic: weekdaysArabic[greg.getDay()]
    };
  };

  // Sample prayer times (in a real app, you'd fetch from an API)
  const getSamplePrayerTimes = (): PrayerTime[] => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;

    const prayers = [
      { name: 'Fajr', nameArabic: 'الفجر', time: '05:30', timeInMinutes: 5 * 60 + 30 },
      { name: 'Sunrise', nameArabic: 'الشروق', time: '06:45', timeInMinutes: 6 * 60 + 45 },
      { name: 'Dhuhr', nameArabic: 'الظهر', time: '12:15', timeInMinutes: 12 * 60 + 15 },
      { name: 'Asr', nameArabic: 'العصر', time: '15:30', timeInMinutes: 15 * 60 + 30 },
      { name: 'Maghrib', nameArabic: 'المغرب', time: '18:45', timeInMinutes: 18 * 60 + 45 },
      { name: 'Isha', nameArabic: 'العشاء', time: '20:00', timeInMinutes: 20 * 60 + 0 },
    ];

    return prayers.map(prayer => ({
      name: prayer.name,
      nameArabic: prayer.nameArabic,
      time: prayer.time,
      passed: currentTimeInMinutes > prayer.timeInMinutes
    }));
  };

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentTime(now);
      setIslamicDate(convertToHijri(now));
      setPrayerTimes(getSamplePrayerTimes());
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const getNextPrayer = () => {
    const nextPrayer = prayerTimes.find(prayer => !prayer.passed);
    return nextPrayer || prayerTimes[0]; // If all prayers passed, return first prayer of next day
  };

  const nextPrayer = getNextPrayer();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 rounded-2xl"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-green-600" />
          <span>التقويم الإسلامي - Islamic Calendar</span>
        </h3>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Clock className="h-4 w-4" />
          <span>{currentTime.toLocaleTimeString('ar-SA', { hour12: false })}</span>
        </div>
      </div>

      {islamicDate && (
        <div className="space-y-4">
          {/* Current Date */}
          <div className="text-center p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl">
            <div className="text-lg font-bold text-gray-900 dark:text-white" dir="rtl">
              {islamicDate.weekdayArabic}
            </div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1" dir="rtl">
              {islamicDate.hijri}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {islamicDate.hijriYear}هـ
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-2 border-t border-gray-200 dark:border-gray-700 pt-2">
              {islamicDate.gregorianDay} {islamicDate.gregorianMonth} {islamicDate.gregorianYear}م
            </div>
          </div>

          {/* Next Prayer */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-blue-600 dark:text-blue-400">الصلاة القادمة - Next Prayer</div>
                <div className="text-lg font-bold text-blue-900 dark:text-blue-100" dir="rtl">
                  {nextPrayer.nameArabic}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-blue-900 dark:text-blue-100">
                  {nextPrayer.time}
                </div>
                <div className="text-xs text-blue-600 dark:text-blue-400">
                  {nextPrayer.name}
                </div>
              </div>
            </div>
          </div>

          {/* Prayer Times */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              مواقيت الصلاة - Prayer Times
            </h4>
            {prayerTimes.map((prayer, index) => (
              <div 
                key={index} 
                className={`flex items-center justify-between p-2 rounded-lg ${
                  prayer.passed 
                    ? 'bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400' 
                    : 'bg-green-50 dark:bg-green-900/20 text-green-900 dark:text-green-100'
                }`}
              >
                <div className="flex items-center space-x-2">
                  {prayer.name === 'Sunrise' ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                  <span className="text-sm font-medium" dir="rtl">{prayer.nameArabic}</span>
                </div>
                <div className="text-sm font-mono">{prayer.time}</div>
              </div>
            ))}
          </div>

          {/* Islamic Events (Sample) */}
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
            <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
              المناسبات الإسلامية - Islamic Events
            </h4>
            <div className="text-xs text-yellow-700 dark:text-yellow-300 space-y-1">
              <div>• ليلة القدر - Laylat al-Qadr (تقريبي)</div>
              <div>• يوم عرفة - Day of Arafah (متبقي 45 يوم)</div>
              <div>• عيد الأضحى - Eid al-Adha (متبقي 46 يوم)</div>
            </div>
          </div>

          {/* Quranic Verse of the Day */}
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
            <h4 className="text-sm font-medium text-purple-800 dark:text-purple-200 mb-2">
              آية اليوم - Verse of the Day
            </h4>
            <div className="text-sm text-purple-700 dark:text-purple-300" dir="rtl">
              <p className="font-arabic text-base leading-relaxed mb-2">
                "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا"
              </p>
              <p className="text-xs text-purple-600 dark:text-purple-400">
                سورة الطلاق - آية 2
              </p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
