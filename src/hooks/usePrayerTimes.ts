import { useState, useEffect } from 'react';
import { Coordinates, CalculationMethod, PrayerTimes, SunnahTimes } from 'adhan';
import { formatTime } from '../lib/utils';

export function usePrayerTimes() {
  const [times, setTimes] = useState<any>(null);
  const [location, setLocation] = useState<string>("Detecting...");

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const coords = new Coordinates(position.coords.latitude, position.coords.longitude);
        const params = CalculationMethod.MoonsightingCommittee();
        const date = new Date();
        const prayerTimes = new PrayerTimes(coords, date, params);
        
        setTimes({
          Fajr: formatTime(prayerTimes.fajr),
          Sunrise: formatTime(prayerTimes.sunrise),
          Dhuhr: formatTime(prayerTimes.dhuhr),
          Asr: formatTime(prayerTimes.asr),
          Maghrib: formatTime(prayerTimes.maghrib),
          Isha: formatTime(prayerTimes.isha),
        });
        setLocation(`${position.coords.latitude.toFixed(2)}, ${position.coords.longitude.toFixed(2)}`);
      }, (error) => {
        console.error(error);
        setLocation("Location access denied");
      });
    }
  }, []);

  return { times, location };
}
