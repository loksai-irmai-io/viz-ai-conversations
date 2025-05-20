
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { newsData } from '@/data/mock-data';
import { fetchNews } from '@/services/api';

const NewsCard: React.FC = () => {
  const [news, setNews] = useState(newsData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getNewsData = async () => {
      setIsLoading(true);
      const response = await fetchNews();
      if (response.data) {
        setNews(response.data);
      }
      setIsLoading(false);
    };

    getNewsData();
  }, []);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Latest News</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
          </div>
        ) : (
          <div className="space-y-3">
            {news.map((item, index) => (
              <div key={index} className="border-b pb-2 last:border-0 last:pb-0">
                <a href={item.url} className="text-sm font-medium hover:underline">
                  {item.title}
                </a>
                <div className="text-xs text-gray-500">{item.source}</div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NewsCard;
