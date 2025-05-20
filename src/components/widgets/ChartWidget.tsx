
import React from 'react';
import { Widget } from '@/data/mock-data';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { cn } from '@/lib/utils';

interface ChartWidgetProps {
  widget: Widget;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const ChartWidget: React.FC<ChartWidgetProps> = ({ widget }) => {
  const { metadata, type } = widget;
  
  const renderLineChart = () => {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={metadata.data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={Object.keys(metadata.data[0])[0]} />
          <YAxis />
          <Tooltip />
          <Legend />
          {Object.keys(metadata.data[0])
            .filter(key => key !== Object.keys(metadata.data[0])[0])
            .map((key, index) => (
              <Line 
                key={key}
                type="monotone" 
                dataKey={key} 
                stroke={COLORS[index % COLORS.length]} 
                activeDot={{ r: 8 }} 
              />
            ))}
        </LineChart>
      </ResponsiveContainer>
    );
  };

  const renderBarChart = () => {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={metadata.data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={Object.keys(metadata.data[0])[0]} />
          <YAxis />
          <Tooltip />
          <Legend />
          {Object.keys(metadata.data[0])
            .filter(key => key !== Object.keys(metadata.data[0])[0])
            .map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const renderPieChart = () => {
    // For pie charts, we expect data in a specific format
    const data = metadata.data.map((item: any) => ({
      name: item.name,
      value: item.value
    }));

    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  const renderHeatMap = () => {
    // A simplified heatmap implementation
    return (
      <div className="grid grid-cols-3 gap-2 w-full h-64">
        {metadata.data.map((item: any, index: number) => (
          <div 
            key={index}
            className="flex items-center justify-center rounded p-2"
            style={{ 
              backgroundColor: `rgba(66, 135, 245, ${item.value / 100})`,
              color: item.value > 50 ? 'white' : 'black'
            }}
          >
            <div className="text-center">
              <div className="font-medium">{item.x} / {item.y}</div>
              <div className="text-sm">{item.value}%</div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderChart = () => {
    switch (type) {
      case 'line-chart':
        return renderLineChart();
      case 'bar-chart':
        return renderBarChart();
      case 'pie-chart':
      case 'donut-chart':
        return renderPieChart();
      case 'heatmap':
        return renderHeatMap();
      case 'gauge-widget':
      case 'treemap-widget':
      case 'bullet-chart':
      case 'wordcloud-widget':
      case 'kpi-widget':
      case 'map-widget':
      case 'timeline-widget':
        // For now, we'll show a placeholder for these more complex chart types
        return (
          <div className="relative">
            <div className="aspect-video rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
              <div className="text-center p-4">
                <p className="text-lg font-medium">{widget.title}</p>
                <p className="text-sm text-gray-600">{type} visualization</p>
                <p className="text-xs text-gray-500 mt-2">This chart type requires additional implementation</p>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="p-4 bg-gray-100 rounded-md">
            <p>Unknown chart type: {type}</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      {renderChart()}
      
      {/* Axis Labels */}
      <div className="flex justify-between text-xs text-gray-500">
        {metadata.xAxis && (
          <div className="text-center w-full">
            {metadata.xAxis}
          </div>
        )}
        
        {metadata.yAxis && (
          <div className="text-right -rotate-90 origin-center absolute -left-6 top-1/2">
            {metadata.yAxis}
          </div>
        )}
      </div>
      
      {/* Chart Legend/Info */}
      {metadata.legend && (
        <div className="flex flex-wrap gap-2 justify-center">
          {metadata.legend.map((item: string, index: number) => (
            <span 
              key={index}
              className={cn(
                "px-2 py-1 rounded text-xs",
                index % COLORS.length === 0 ? "bg-blue-100" : 
                index % COLORS.length === 1 ? "bg-green-100" : 
                index % COLORS.length === 2 ? "bg-yellow-100" : 
                index % COLORS.length === 3 ? "bg-purple-100" :
                index % COLORS.length === 4 ? "bg-pink-100" :
                "bg-gray-100"
              )}
            >
              {item}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChartWidget;
