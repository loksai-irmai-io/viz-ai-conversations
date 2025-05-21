
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { weatherData } from '@/data/mock-data';
import { fetchWeather } from '@/services/api';

interface WeatherCardProps {
  location?: string;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ location }) => {
  const [weather, setWeather] = useState(weatherData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getWeatherData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetchWeather(location);
        if (response.data) {
          setWeather(response.data);
        }
        if (response.error) {
          setError(response.error);
          console.log('Using fallback weather data');
        }
      } catch (err) {
        setError('Failed to load weather data');
        console.error('Weather card error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    getWeatherData();
  }, [location]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Weather {location ? `in ${location}` : ''}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="animate-pulse space-y-2">
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{weather.temperature}°F</div>
              <div className="text-sm text-gray-500">{weather.condition}</div>
              <div className="text-xs text-gray-500">{weather.location}</div>
              {error && <div className="text-xs text-amber-500 mt-1">{error}</div>}
            </div>
            <div className="text-right">
              <div className="text-sm">Humidity: {weather.humidity}%</div>
              <div className="text-sm">Wind: {weather.wind}</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
