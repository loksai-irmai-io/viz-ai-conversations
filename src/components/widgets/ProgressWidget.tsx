
import React from 'react';
import { Widget } from '@/data/mock-data';
import { Progress } from '@/components/ui/progress';

interface ProgressWidgetProps {
  widget: Widget;
}

const ProgressWidget: React.FC<ProgressWidgetProps> = ({ widget }) => {
  const { metadata } = widget;
  
  return (
    <div className="space-y-4">
      {metadata.areas.map((area: any, index: number) => (
        <div key={index} className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>{area.name}</span>
            <span className="font-medium">{area.progress}%</span>
          </div>
          <Progress value={area.progress} className="h-2" />
        </div>
      ))}
    </div>
  );
};

export default ProgressWidget;
