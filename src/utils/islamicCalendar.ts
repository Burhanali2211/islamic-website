import { format } from 'date-fns';

export interface IslamicDate {
  hijri: string;
  gregorian: string;
  month: string;
  day: number;
  year: number;
}

export interface PrayerTime {
  name: string;
  time: string;
  arabic: string;
}

// Simplified Islamic calendar conversion (in real app, use proper library)
export function getIslamicDate(): IslamicDate {
  const today = new Date();
  const gregorian = format(today, 'MMMM dd, yyyy');
  
  // Simplified calculation - in real app, use proper Hijri calendar library
  const hijriYear = today.getFullYear() - 579;
  const hijriMonths = [
    'Muharram', 'Safar', 'Rabi\' al-awwal', 'Rabi\' al-thani',
    'Jumada al-awwal', 'Jumada al-thani', 'Rajab', 'Sha\'ban',
    'Ramadan', 'Shawwal', 'Dhu al-Qi\'dah', 'Dhu al-Hijjah'
  ];
  
  const hijriMonth = hijriMonths[today.getMonth()];
  const hijriDay = today.getDate();
  
  return {
    hijri: `${hijriDay} ${hijriMonth} ${hijriYear}`,
    gregorian,
    month: hijriMonth,
    day: hijriDay,
    year: hijriYear
  };
}

export function getPrayerTimes(): PrayerTime[] {
  // Mock prayer times - in real app, use proper prayer times API
  return [
    { name: 'Fajr', time: '05:30', arabic: 'الفجر' },
    { name: 'Dhuhr', time: '12:15', arabic: 'الظهر' },
    { name: 'Asr', time: '15:45', arabic: 'العصر' },
    { name: 'Maghrib', time: '18:20', arabic: 'المغرب' },
    { name: 'Isha', time: '19:45', arabic: 'العشاء' }
  ];
}
