
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { weatherData } from '@/data/mock-data';

const WeatherCard: React.FC = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Weather</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold">{weatherData.temperature}°F</div>
            <div className="text-sm text-gray-500">{weatherData.condition}</div>
            <div className="text-xs text-gray-500">{weatherData.location}</div>
          </div>
          <div className="text-right">
            <div className="text-sm">Humidity: {weatherData.humidity}%</div>
            <div className="text-sm">Wind: {weatherData.wind}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
