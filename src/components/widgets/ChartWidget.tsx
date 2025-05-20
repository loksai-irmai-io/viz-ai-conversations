
import React from 'react';
import { Widget } from '@/data/mock-data';
import { cn } from '@/lib/utils';

interface ChartWidgetProps {
  widget: Widget;
}

const ChartWidget: React.FC<ChartWidgetProps> = ({ widget }) => {
  // In a real application, we would use the widget metadata to render an actual chart
  // For this mockup, we'll just display the image associated with the widget
  
  return (
    <div className="relative">
      {/* Chart Container */}
      <div className="aspect-video rounded-md overflow-hidden bg-gray-100">
        <img 
          src={`${widget.image}?w=800&h=450&fit=crop&crop=entropy&auto=compress`}
          alt={widget.title}
          className="w-full h-full object-cover opacity-60"
        />
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center p-4">
            <p className="text-lg font-medium">Chart Visualization</p>
            <p className="text-sm text-gray-600">{widget.type}</p>
          </div>
        </div>
        
        {/* Chart Legend/Info */}
        {widget.metadata.legend && (
          <div className="absolute bottom-2 left-2 right-2 bg-white/80 p-2 rounded text-xs flex flex-wrap gap-2">
            {widget.metadata.legend.map((item: string, index: number) => (
              <span 
                key={index}
                className={cn(
                  "px-2 py-1 rounded",
                  index % 4 === 0 ? "bg-blue-100" : 
                  index % 4 === 1 ? "bg-green-100" : 
                  index % 4 === 2 ? "bg-yellow-100" : 
                  "bg-purple-100"
                )}
              >
                {item}
              </span>
            ))}
          </div>
        )}
      </div>
      
      {/* Axis Labels */}
      {widget.metadata.xAxis && (
        <div className="mt-2 text-center text-xs text-gray-500">
          {widget.metadata.xAxis}
        </div>
      )}
      
      {widget.metadata.yAxis && (
        <div 
          className="absolute -left-6 top-1/2 -translate-y-1/2 transform -rotate-90 text-xs text-gray-500"
          style={{ width: '100px' }}
        >
          {widget.metadata.yAxis}
        </div>
      )}
    </div>
  );
};

export default ChartWidget;
