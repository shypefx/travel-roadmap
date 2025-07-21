import { useEffect, useState } from 'react';

const API_KEY = 'f5dafd6e9a4d40fb983140900252107';

export const useWeather = (city = '') => {
  const [current, setCurrent] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=7&lang=fr`
        );
        const data = await res.json();
        setCurrent(data.current);
        setForecast(data.forecast.forecastday || []);
      } catch (e) {
        console.error('❌ Erreur météo:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city]);

  return { current, forecast, loading };
};
