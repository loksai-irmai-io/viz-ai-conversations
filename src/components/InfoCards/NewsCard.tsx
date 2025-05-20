
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { newsData } from '@/data/mock-data';
import { fetchNews } from '@/services/api';
import { ExternalLink } from 'lucide-react';

interface NewsCardProps {
  category?: string;
}

const NewsCard: React.FC<NewsCardProps> = ({ category }) => {
  const [news, setNews] = useState(newsData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getNewsData = async () => {
      setIsLoading(true);
      const response = await fetchNews(category);
      if (response.data) {
        setNews(response.data);
      }
      setIsLoading(false);
    };

    getNewsData();
  }, [category]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">
          {category ? `${category.charAt(0).toUpperCase() + category.slice(1)} News` : 'Latest News'}
        </CardTitle>
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
                <a 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-sm font-medium hover:underline group flex items-start"
                >
                  <span className="flex-1">{item.title}</span>
                  <ExternalLink size={14} className="text-gray-400 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
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
