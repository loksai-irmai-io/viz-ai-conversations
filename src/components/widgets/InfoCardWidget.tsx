
import React from 'react';
import { Widget } from '@/data/mock-data';

interface InfoCardWidgetProps {
  widget: Widget;
}

const InfoCardWidget: React.FC<InfoCardWidgetProps> = ({ widget }) => {
  const { metadata } = widget;
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {metadata.stats.map((stat: any, index: number) => (
        <div key={index} className="bg-gray-50 p-4 rounded-md">
          <div className="text-sm text-gray-500">{stat.label}</div>
          <div className="text-xl font-bold">{stat.value}</div>
        </div>
      ))}
    </div>
  );
};

export default InfoCardWidget;
