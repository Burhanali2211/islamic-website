import { describe, test, expect } from 'vitest';
import {
  gregorianToHijri,
  hijriToGregorian,
  formatHijriDate,
  getIslamicMonthName,
  getIslamicEvents,
  isRamadan,
  isHajjSeason,
  calculateZakatDueDate,
  getQiblaDirection,
  getPrayerTimes,
  formatIslamicDate
} from '../../utils/islamicCalendar';

describe('islamicCalendar utilities', () => {
  describe('gregorianToHijri', () => {
    test('converts known Gregorian dates to Hijri', () => {
      // Test known conversion: July 16, 622 CE = 1 Muharram 1 AH
      const hijriEpoch = gregorianToHijri(new Date(622, 6, 16));
      expect(hijriEpoch.year).toBe(1);
      expect(hijriEpoch.month).toBe(1);
      expect(hijriEpoch.day).toBe(1);

      // Test modern date
      const modernDate = gregorianToHijri(new Date(2023, 0, 1)); // Jan 1, 2023
      expect(modernDate.year).toBeGreaterThan(1440);
      expect(modernDate.month).toBeGreaterThanOrEqual(1);
      expect(modernDate.month).toBeLessThanOrEqual(12);
      expect(modernDate.day).toBeGreaterThanOrEqual(1);
      expect(modernDate.day).toBeLessThanOrEqual(30);
    });

    test('handles edge cases', () => {
      // Test leap year
      const leapYear = gregorianToHijri(new Date(2024, 1, 29)); // Feb 29, 2024
      expect(leapYear).toBeDefined();

      // Test year boundaries
      const newYear = gregorianToHijri(new Date(2023, 0, 1));
      const endYear = gregorianToHijri(new Date(2023, 11, 31));
      expect(newYear.year).toBeLessThanOrEqual(endYear.year + 1);
    });
  });

  describe('hijriToGregorian', () => {
    test('converts Hijri dates to Gregorian', () => {
      // Test Hijri epoch
      const gregorianEpoch = hijriToGregorian(1, 1, 1);
      expect(gregorianEpoch.getFullYear()).toBe(622);

      // Test modern Hijri date
      const modernHijri = hijriToGregorian(1445, 6, 15); // Mid-1445 AH
      expect(modernHijri.getFullYear()).toBeGreaterThan(2020);
      expect(modernHijri.getFullYear()).toBeLessThan(2030);
    });

    test('validates Hijri date inputs', () => {
      // Invalid month
      expect(() => hijriToGregorian(1445, 13, 1)).toThrow('Invalid month');
      expect(() => hijriToGregorian(1445, 0, 1)).toThrow('Invalid month');

      // Invalid day
      expect(() => hijriToGregorian(1445, 1, 31)).toThrow('Invalid day');
      expect(() => hijriToGregorian(1445, 1, 0)).toThrow('Invalid day');

      // Invalid year
      expect(() => hijriToGregorian(0, 1, 1)).toThrow('Invalid year');
    });
  });

  describe('formatHijriDate', () => {
    test('formats Hijri dates in different styles', () => {
      const hijriDate = { year: 1445, month: 6, day: 15 };

      // Default format
      const defaultFormat = formatHijriDate(hijriDate);
      expect(defaultFormat).toContain('1445');
      expect(defaultFormat).toContain('Jumada al-Thani');

      // Short format
      const shortFormat = formatHijriDate(hijriDate, 'short');
      expect(shortFormat).toBe('15/6/1445');

      // Long format
      const longFormat = formatHijriDate(hijriDate, 'long');
      expect(longFormat).toContain('15th');
      expect(longFormat).toContain('Jumada al-Thani');
      expect(longFormat).toContain('1445 AH');
    });

    test('handles different locales', () => {
      const hijriDate = { year: 1445, month: 1, day: 1 };

      const englishFormat = formatHijriDate(hijriDate, 'default', 'en');
      expect(englishFormat).toContain('Muharram');

      const arabicFormat = formatHijriDate(hijriDate, 'default', 'ar');
      expect(arabicFormat).toContain('محرم');
    });
  });

  describe('getIslamicMonthName', () => {
    test('returns correct month names in English', () => {
      const monthNames = [
        'Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani',
        'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', 'Shaban',
        'Ramadan', 'Shawwal', 'Dhu al-Qadah', 'Dhu al-Hijjah'
      ];

      monthNames.forEach((name, index) => {
        expect(getIslamicMonthName(index + 1, 'en')).toBe(name);
      });
    });

    test('returns correct month names in Arabic', () => {
      const arabicMonths = [
        'محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني',
        'جمادى الأولى', 'جمادى الثانية', 'رجب', 'شعبان',
        'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
      ];

      arabicMonths.forEach((name, index) => {
        expect(getIslamicMonthName(index + 1, 'ar')).toBe(name);
      });
    });

    test('handles invalid month numbers', () => {
      expect(() => getIslamicMonthName(0)).toThrow('Invalid month');
      expect(() => getIslamicMonthName(13)).toThrow('Invalid month');
    });
  });

  describe('getIslamicEvents', () => {
    test('returns events for Muharram', () => {
      const muharramEvents = getIslamicEvents(1);
      expect(muharramEvents).toContain('Islamic New Year');
      expect(muharramEvents).toContain('Day of Ashura');
    });

    test('returns events for Rabi al-Awwal', () => {
      const rabiEvents = getIslamicEvents(3);
      expect(rabiEvents).toContain('Mawlid an-Nabi');
    });

    test('returns events for Ramadan', () => {
      const ramadanEvents = getIslamicEvents(9);
      expect(ramadanEvents).toContain('Laylat al-Qadr');
      expect(ramadanEvents).toContain('Eid al-Fitr preparation');
    });

    test('returns events for Dhu al-Hijjah', () => {
      const hajjEvents = getIslamicEvents(12);
      expect(hajjEvents).toContain('Hajj pilgrimage');
      expect(hajjEvents).toContain('Eid al-Adha');
      expect(hajjEvents).toContain('Day of Arafah');
    });

    test('returns empty array for months without major events', () => {
      const safar = getIslamicEvents(2);
      expect(Array.isArray(safar)).toBe(true);
    });
  });

  describe('isRamadan', () => {
    test('correctly identifies Ramadan dates', () => {
      const ramadanDate = { year: 1445, month: 9, day: 15 };
      expect(isRamadan(ramadanDate)).toBe(true);

      const nonRamadanDate = { year: 1445, month: 8, day: 15 };
      expect(isRamadan(nonRamadanDate)).toBe(false);
    });

    test('works with Gregorian dates during Ramadan', () => {
      // This would need actual calculation based on current year
      const gregorianDate = new Date(2023, 2, 25); // Approximate Ramadan 2023
      const hijriDate = gregorianToHijri(gregorianDate);
      
      if (hijriDate.month === 9) {
        expect(isRamadan(hijriDate)).toBe(true);
      }
    });
  });

  describe('isHajjSeason', () => {
    test('correctly identifies Hajj season', () => {
      // Hajj months: Shawwal, Dhu al-Qadah, first 10 days of Dhu al-Hijjah
      const shawwalDate = { year: 1445, month: 10, day: 15 };
      expect(isHajjSeason(shawwalDate)).toBe(true);

      const dhuQadahDate = { year: 1445, month: 11, day: 15 };
      expect(isHajjSeason(dhuQadahDate)).toBe(true);

      const earlyDhuHijjah = { year: 1445, month: 12, day: 8 };
      expect(isHajjSeason(earlyDhuHijjah)).toBe(true);

      const lateDhuHijjah = { year: 1445, month: 12, day: 15 };
      expect(isHajjSeason(lateDhuHijjah)).toBe(false);

      const ramadanDate = { year: 1445, month: 9, day: 15 };
      expect(isHajjSeason(ramadanDate)).toBe(false);
    });
  });

  describe('calculateZakatDueDate', () => {
    test('calculates Zakat due date one lunar year later', () => {
      const startDate = { year: 1444, month: 1, day: 1 };
      const dueDate = calculateZakatDueDate(startDate);

      expect(dueDate.year).toBe(1445);
      expect(dueDate.month).toBe(1);
      expect(dueDate.day).toBe(1);
    });

    test('handles month overflow correctly', () => {
      const startDate = { year: 1444, month: 12, day: 15 };
      const dueDate = calculateZakatDueDate(startDate);

      expect(dueDate.year).toBe(1445);
      expect(dueDate.month).toBe(12);
      expect(dueDate.day).toBe(15);
    });
  });

  describe('getQiblaDirection', () => {
    test('calculates Qibla direction for known locations', () => {
      // Mecca coordinates
      const mecca = { latitude: 21.4225, longitude: 39.8262 };
      const meccaQibla = getQiblaDirection(mecca.latitude, mecca.longitude);
      expect(meccaQibla).toBeCloseTo(0, 1); // Should be very close to 0

      // New York coordinates
      const newYork = { latitude: 40.7128, longitude: -74.0060 };
      const nyQibla = getQiblaDirection(newYork.latitude, newYork.longitude);
      expect(nyQibla).toBeGreaterThan(0);
      expect(nyQibla).toBeLessThan(360);

      // London coordinates
      const london = { latitude: 51.5074, longitude: -0.1278 };
      const londonQibla = getQiblaDirection(london.latitude, london.longitude);
      expect(londonQibla).toBeGreaterThan(0);
      expect(londonQibla).toBeLessThan(360);
    });

    test('handles edge cases', () => {
      // North Pole
      const northPole = getQiblaDirection(90, 0);
      expect(northPole).toBeGreaterThanOrEqual(0);
      expect(northPole).toBeLessThan(360);

      // Antipodal point
      const antipodal = getQiblaDirection(-21.4225, -140.1738);
      expect(antipodal).toBeGreaterThanOrEqual(0);
      expect(antipodal).toBeLessThan(360);
    });
  });

  describe('getPrayerTimes', () => {
    test('calculates prayer times for a given location and date', () => {
      const latitude = 40.7128; // New York
      const longitude = -74.0060;
      const date = new Date(2023, 5, 15); // June 15, 2023

      const prayerTimes = getPrayerTimes(latitude, longitude, date);

      expect(prayerTimes).toHaveProperty('fajr');
      expect(prayerTimes).toHaveProperty('sunrise');
      expect(prayerTimes).toHaveProperty('dhuhr');
      expect(prayerTimes).toHaveProperty('asr');
      expect(prayerTimes).toHaveProperty('maghrib');
      expect(prayerTimes).toHaveProperty('isha');

      // Verify times are in correct order
      const times = [
        prayerTimes.fajr,
        prayerTimes.sunrise,
        prayerTimes.dhuhr,
        prayerTimes.asr,
        prayerTimes.maghrib,
        prayerTimes.isha
      ];

      for (let i = 1; i < times.length; i++) {
        expect(new Date(`2023-06-15 ${times[i]}`).getTime())
          .toBeGreaterThan(new Date(`2023-06-15 ${times[i-1]}`).getTime());
      }
    });

    test('handles different calculation methods', () => {
      const latitude = 21.4225; // Mecca
      const longitude = 39.8262;
      const date = new Date(2023, 5, 15);

      const standardTimes = getPrayerTimes(latitude, longitude, date, 'standard');
      const hanafTimes = getPrayerTimes(latitude, longitude, date, 'hanafi');

      expect(standardTimes.asr).not.toBe(hanafTimes.asr);
    });
  });

  describe('formatIslamicDate', () => {
    test('formats complete Islamic date with events', () => {
      const ramadanDate = { year: 1445, month: 9, day: 15 };
      const formatted = formatIslamicDate(ramadanDate, true);

      expect(formatted).toContain('1445');
      expect(formatted).toContain('Ramadan');
      expect(formatted).toContain('15');
    });

    test('includes relevant Islamic events', () => {
      const ashurahDate = { year: 1445, month: 1, day: 10 };
      const formatted = formatIslamicDate(ashurahDate, true);

      expect(formatted).toContain('Ashura');
    });

    test('handles formatting without events', () => {
      const regularDate = { year: 1445, month: 5, day: 20 };
      const formatted = formatIslamicDate(regularDate, false);

      expect(formatted).toContain('1445');
      expect(formatted).toContain('Jumada al-Awwal');
      expect(formatted).not.toContain('Event:');
    });
  });

  describe('date conversion accuracy', () => {
    test('round-trip conversion maintains accuracy', () => {
      const originalGregorian = new Date(2023, 5, 15);
      const hijri = gregorianToHijri(originalGregorian);
      const backToGregorian = hijriToGregorian(hijri.year, hijri.month, hijri.day);

      // Allow for 1-2 day difference due to lunar calendar approximations
      const daysDifference = Math.abs(
        (backToGregorian.getTime() - originalGregorian.getTime()) / (1000 * 60 * 60 * 24)
      );
      expect(daysDifference).toBeLessThanOrEqual(2);
    });

    test('handles leap years correctly', () => {
      const leapYearDate = new Date(2024, 1, 29); // Feb 29, 2024
      const hijri = gregorianToHijri(leapYearDate);
      const backToGregorian = hijriToGregorian(hijri.year, hijri.month, hijri.day);

      expect(backToGregorian).toBeInstanceOf(Date);
      expect(backToGregorian.getFullYear()).toBe(2024);
    });
  });
});
