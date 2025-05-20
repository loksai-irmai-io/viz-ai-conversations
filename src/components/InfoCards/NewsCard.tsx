
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { newsData } from '@/data/mock-data';

const NewsCard: React.FC = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Latest News</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {newsData.map((item, index) => (
            <div key={index} className="border-b pb-2 last:border-0 last:pb-0">
              <a href={item.url} className="text-sm font-medium hover:underline">
                {item.title}
              </a>
              <div className="text-xs text-gray-500">{item.source}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default NewsCard;
