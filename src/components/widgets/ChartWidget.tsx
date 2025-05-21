import React from 'react';
import { Widget } from '@/data/mock-data';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadialBarChart, RadialBar, Treemap, ScatterChart, Scatter, ZAxis,
  ComposedChart, Area, ReferenceLine
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
            innerRadius={type === 'donut-chart' ? 40 : 0} // Make it a donut if specified
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
    // Create a proper heatmap using a scatter chart with colored bubbles
    const data = metadata.data;
    
    // Get unique x and y values for labels
    const uniqueX = Array.from(new Set(data.map((d: any) => d.x)));
    const uniqueY = Array.from(new Set(data.map((d: any) => d.y)));
    
    const maxValue = Math.max(...data.map((d: any) => d.value));
    
    return (
      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            type="category" 
            dataKey="x" 
            name="Project" 
            allowDuplicatedCategory={false} 
          />
          <YAxis 
            type="category" 
            dataKey="y" 
            name="Week" 
            allowDuplicatedCategory={false}
          />
          <ZAxis 
            type="number"
            dataKey="value"
            range={[0, 500]}
            name="Value"
          />
          <Tooltip 
            cursor={{ strokeDasharray: '3 3' }}
            formatter={(value: any) => [`Value: ${value}`, 'Intensity']}
          />
          <Scatter 
            name="Heat Map" 
            data={data} 
            fill="#8884d8"
            shape={(props: any) => {
              const { cx, cy, payload } = props;
              const intensity = payload.value / maxValue;
              return (
                <rect
                  x={cx - 20}
                  y={cy - 20}
                  width={40}
                  height={40}
                  fill={`rgba(66, 135, 245, ${intensity})`}
                  style={{
                    fillOpacity: 0.8,
                  }}
                />
              );
            }}
          />
        </ScatterChart>
      </ResponsiveContainer>
    );
  };

  const renderGaugeChart = () => {
    if (!metadata.value) return <div>No gauge data available</div>;
    
    const data = [
      {
        name: 'Value',
        value: metadata.value,
        fill: '#8884d8',
      }
    ];
    
    // Determine fill color based on thresholds
    let fillColor = '#00C49F'; // Default green
    
    if (metadata.thresholds) {
      for (let i = 0; i < metadata.thresholds.length; i++) {
        if (metadata.value <= metadata.thresholds[i].value) {
          fillColor = metadata.thresholds[i].color;
          break;
        }
      }
    }
    
    return (
      <ResponsiveContainer width="100%" height={300}>
        <RadialBarChart 
          cx="50%" 
          cy="50%" 
          innerRadius="60%" 
          outerRadius="100%" 
          barSize={10} 
          data={data} 
          startAngle={180} 
          endAngle={0}
        >
          <RadialBar
            background
            dataKey="value"
            fill={fillColor}
          />
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-xl font-bold"
            fill="#333"
          >
            {metadata.value}%
          </text>
          <Tooltip />
        </RadialBarChart>
      </ResponsiveContainer>
    );
  };

  const renderTreeMap = () => {
    if (!metadata.data) return <div>No treemap data available</div>;
    
    return (
      <ResponsiveContainer width="100%" height={300}>
        <Treemap
          data={metadata.data}
          dataKey="value"
          aspectRatio={4/3}
          stroke="#fff"
          fill="#8884d8"
        >
          {(props) => {
            const { depth, x, y, width, height, index, name, value } = props;
            
            return (
              <g>
                <rect
                  x={x}
                  y={y}
                  width={width}
                  height={height}
                  style={{
                    fill: COLORS[index % COLORS.length],
                    stroke: '#fff',
                    strokeWidth: 2 / (depth + 1e-10),
                    strokeOpacity: 1 / (depth + 1e-10),
                  }}
                />
                {(width > 50 && height > 30) ? (
                  <text
                    x={x + width / 2}
                    y={y + height / 2}
                    textAnchor="middle"
                    fill="#fff"
                    fontSize={14}
                  >
                    {name}
                  </text>
                ) : null}
                {(width > 50 && height > 50) ? (
                  <text
                    x={x + width / 2}
                    y={y + height / 2 + 15}
                    textAnchor="middle"
                    fill="#fff"
                    fontSize={12}
                  >
                    {value}
                  </text>
                ) : null}
              </g>
            );
          }}
        </Treemap>
      </ResponsiveContainer>
    );
  };

  const renderBulletChart = () => {
    if (!metadata.data) return <div>No bullet chart data available</div>;
    
    return (
      <div className="space-y-6">
        {metadata.data.map((item: any, index: number) => (
          <div key={index} className="space-y-1">
            <div className="flex justify-between">
              <span className="font-medium">{item.name}</span>
              <span>Target: {item.target}</span>
            </div>
            <ResponsiveContainer width="100%" height={50}>
              <ComposedChart
                layout="vertical"
                data={[item]}
                margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" domain={[0, item.ranges[item.ranges.length - 1] * 1.2]} />
                <YAxis dataKey="name" type="category" hide={true} />
                <Tooltip />
                
                {/* The ranges/background bars */}
                {item.ranges.map((range: any, i: number) => (
                  <Bar 
                    key={`range-${i}`}
                    dataKey={() => range}
                    barSize={20}
                    fill={`rgba(0, 0, 0, ${0.2 - i * 0.05})`}
                    stackId="stack"
                  />
                ))}
                
                {/* The actual value bar */}
                <Bar
                  dataKey="actual"
                  barSize={8}
                  fill={item.actual >= item.target ? '#00C49F' : '#FF8042'}
                />
                
                {/* Target line */}
                <Line
                  dataKey="target"
                  type="monotone"
                  stroke="#ff7300"
                  strokeWidth={2}
                  dot={{ fill: '#ff7300', strokeWidth: 2 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>
    );
  };

  const renderKPIWidget = () => {
    if (!metadata.metrics) return <div>No KPI data available</div>;
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metadata.metrics.map((metric: any, index: number) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-sm text-gray-500">{metric.name}</div>
            <div className="text-xl font-bold">{metric.value}</div>
            <div className={`text-xs ${metric.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {metric.change >= 0 ? '+' : ''}{metric.change}%
            </div>
            {/* Sparkline */}
            <div className="h-10 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metric.trend.map((value: number, i: number) => ({ index: i, value }))}>
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke={metric.change >= 0 ? '#10b981' : '#ef4444'} 
                    strokeWidth={2} 
                    dot={false} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderTimelineWidget = () => {
    if (!metadata.events) return <div>No timeline data available</div>;
    
    return (
      <div className="relative pl-8 space-y-8 before:absolute before:top-0 before:bottom-0 before:left-4 before:w-0.5 before:bg-gray-200">
        {metadata.events.map((event: any, index: number) => {
          const date = new Date(event.date);
          return (
            <div key={index} className="relative pb-4">
              <div className="absolute left-[-1.65rem] w-4 h-4 bg-blue-500 rounded-full mt-1.5" />
              <div className="mb-1">
                <span className="text-sm font-medium text-gray-500">
                  {date.toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
              <h3 className="text-lg font-medium text-gray-900">{event.title}</h3>
              <p className="mt-1 text-sm text-gray-500">{event.description}</p>
            </div>
          );
        })}
      </div>
    );
  };

  const renderMapWidget = () => {
    if (!metadata.regions) return <div>No map data available</div>;
    
    // For a simple representation, we'll just show the regions as cards
    // In a real implementation, you'd use a mapping library like react-simple-maps
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {metadata.regions.map((region: any, index: number) => {
          // Calculate size based on value - normalize to range of 0.5-1.5
          const minValue = Math.min(...metadata.regions.map((r: any) => r.value));
          const maxValue = Math.max(...metadata.regions.map((r: any) => r.value));
          const range = maxValue - minValue;
          const scale = range === 0 ? 1 : 0.5 + ((region.value - minValue) / range);
          
          return (
            <div 
              key={index} 
              className="relative p-4 rounded-lg bg-blue-50 border border-blue-100"
              style={{ transform: `scale(${scale})` }}
            >
              <div className="text-sm font-medium">{region.name}</div>
              <div className="text-lg font-bold">{region.value}</div>
              <div className="text-xs text-gray-500">
                Lat: {region.lat.toFixed(2)}, Lng: {region.lng.toFixed(2)}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderWordCloudWidget = () => {
    if (!metadata.words) return <div>No word cloud data available</div>;
    
    // Sort words by value (frequency)
    const sortedWords = [...metadata.words].sort((a, b) => b.value - a.value);
    
    // Calculate font sizes based on word frequency
    const minValue = Math.min(...sortedWords.map((w: any) => w.value));
    const maxValue = Math.max(...sortedWords.map((w: any) => w.value));
    const range = maxValue - minValue;
    
    return (
      <div className="flex flex-wrap justify-center p-4">
        {sortedWords.map((word: any, index: number) => {
          // Map word value to font size between 12 and 32 pixels
          const fontSize = range === 0 
            ? 22 
            : Math.max(12, Math.min(32, 12 + ((word.value - minValue) / range) * 20));
          
          // Assign a color from our color palette
          const color = COLORS[index % COLORS.length];
          
          return (
            <div 
              key={index} 
              className="m-2 p-1 inline-block transition-transform hover:scale-110 cursor-pointer"
              style={{ fontSize: `${fontSize}px`, color }}
            >
              {word.text}
            </div>
          );
        })}
      </div>
    );
  };

  // New function to render scatter chart
  const renderScatterChart = () => {
    if (!metadata.data) return <div>No scatter plot data available</div>;
    
    // Determine if we need to use multiple scatter series or just one
    const hasMultipleSeries = metadata.series && Array.isArray(metadata.series);
    
    return (
      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            type="number" 
            dataKey="x" 
            name={metadata.xAxisLabel || "X"} 
            unit={metadata.xUnit || ""}
          />
          <YAxis 
            type="number" 
            dataKey="y" 
            name={metadata.yAxisLabel || "Y"} 
            unit={metadata.yUnit || ""}
          />
          <Tooltip 
            cursor={{ strokeDasharray: '3 3' }}
            formatter={(value, name) => [value, name]}
          />
          <Legend />
          
          {hasMultipleSeries ? (
            // Render multiple scatter series
            metadata.series.map((serie: any, index: number) => (
              <Scatter 
                key={serie.name || `series-${index}`}
                name={serie.name || `Series ${index + 1}`} 
                data={serie.data} 
                fill={COLORS[index % COLORS.length]}
              />
            ))
          ) : (
            // Render a single scatter series
            <Scatter 
              name={metadata.name || "Data"} 
              data={metadata.data} 
              fill={metadata.color || COLORS[0]}
            />
          )}
          
          {/* Add reference line if threshold exists */}
          {metadata.threshold && (
            <ReferenceLine 
              y={metadata.threshold} 
              stroke="red" 
              strokeDasharray="3 3" 
              label={metadata.thresholdLabel || "Threshold"} 
            />
          )}
        </ScatterChart>
      </ResponsiveContainer>
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
        return renderGaugeChart();
      case 'treemap-widget':
        return renderTreeMap();
      case 'bullet-chart':
        return renderBulletChart();
      case 'kpi-widget':
        return renderKPIWidget();
      case 'timeline-widget':
        return renderTimelineWidget();
      case 'map-widget':
        return renderMapWidget();
      case 'wordcloud-widget':
        return renderWordCloudWidget();
      case 'scatter-chart':
        return renderScatterChart();
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
