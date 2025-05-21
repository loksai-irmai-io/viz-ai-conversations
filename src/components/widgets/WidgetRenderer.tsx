
import React from 'react';
import { Widget } from '@/data/mock-data';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import InfoCardWidget from './InfoCardWidget';
import ChartWidget from './ChartWidget';
import DataTableWidget from './DataTableWidget';
import AccordionWidget from './AccordionWidget';
import ProgressWidget from './ProgressWidget';
import ListWidget from './ListWidget';
import WeatherCard from '../InfoCards/WeatherCard';
import NewsCard from '../InfoCards/NewsCard';
import TimeCard from '../InfoCards/TimeCard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BookOpen, ChartBar, FileBarChart, FileText, TableIcon, Layers, ScatterChart, BarChart, PieChart, LineChart } from 'lucide-react';

interface WidgetRendererProps {
  widget: Widget;
}

const WidgetRenderer: React.FC<WidgetRendererProps> = ({ widget }) => {
  // Extract metadata for special cards
  const location = widget.metadata?.location;
  const category = widget.metadata?.category;

  // Special handlers for weather, news, and time cards
  if (widget.id === 'weather-card') {
    return <WeatherCard location={location} />;
  }
  
  if (widget.id === 'news-card') {
    return <NewsCard category={category} />;
  }
  
  if (widget.id === 'time-card') {
    return <TimeCard />;
  }

  // Determine widget icon based on type
  const renderWidgetIcon = () => {
    const iconClass = "h-5 w-5 mr-2 text-muted-foreground";
    
    if (widget.type.includes('chart') && widget.type.includes('bar')) {
      return <BarChart className={iconClass} />;
    } else if (widget.type.includes('pie')) {
      return <PieChart className={iconClass} />;
    } else if (widget.type.includes('line')) {
      return <LineChart className={iconClass} />;
    } else if (widget.type.includes('scatter')) {
      return <ScatterChart className={iconClass} />;
    } else if (widget.type.includes('table')) {
      return <TableIcon className={iconClass} />;
    } else if (widget.type.includes('flowchart')) {
      return <Layers className={iconClass} />;
    } else if (widget.type.includes('map')) {
      return <FileText className={iconClass} />;
    } else if (widget.type.includes('heatmap')) {
      return <ChartBar className={iconClass} />;
    } else {
      return <FileBarChart className={iconClass} />;
    }
  };

  const renderWidgetContent = () => {
    switch (widget.type) {
      case 'info-card-small':
      case 'info-card-medium':
      case 'info-card-large':
        return <InfoCardWidget widget={widget} />;
      
      // Chart types
      case 'line-chart':
      case 'bar-chart':
      case 'pie-chart':
      case 'donut-chart':
      case 'heatmap':
      case 'gauge-widget':
      case 'treemap-widget':
      case 'bullet-chart':
      case 'wordcloud-widget':
      case 'kpi-widget':
      case 'map-widget':
      case 'timeline-widget':
      case 'scatter-chart':
        return <ChartWidget widget={widget} />;
      
      // Data table with highlighting support
      case 'data-table':
        if (widget.metadata?.highlightRows) {
          return (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {widget.metadata.columns.map((col: any) => (
                      <TableHead key={col.key}>{col.header}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {widget.metadata.data.map((row: any, index: number) => {
                    const isHighlighted = widget.metadata?.highlightRows?.includes(row[widget.metadata.columns[0].key]);
                    return (
                      <TableRow 
                        key={index} 
                        className={isHighlighted ? "bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:hover:bg-yellow-900/50" : ""}
                      >
                        {widget.metadata.columns.map((col: any) => (
                          <TableCell key={col.key}>{row[col.key]}</TableCell>
                        ))}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              {widget.metadata?.footnote && (
                <div className="mt-3 text-sm text-muted-foreground italic">
                  {widget.metadata.footnote}
                </div>
              )}
            </div>
          );
        }
        return <DataTableWidget widget={widget} />;
        
      case 'accordion-widget':
        return <AccordionWidget widget={widget} />;
        
      case 'progress-widget':
        return <ProgressWidget widget={widget} />;
        
      case 'list-widget':
        return <ListWidget widget={widget} />;
      
      // Flowchart rendering (enhanced)
      case 'flowchart-widget':
        return (
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-center mb-4 font-semibold flex items-center justify-center">
              <Layers className="h-5 w-5 mr-2" />
              <span>{widget.metadata?.flowTitle || "Process Flow Visualization"}</span>
            </div>
            <div className="flex flex-col gap-2 max-h-96 overflow-auto">
              {widget.metadata?.nodes?.map((node: any) => (
                <div 
                  key={node.id} 
                  className={`p-3 rounded-lg text-sm ${
                    node.type === 'start' ? 'bg-green-100 border-l-4 border-green-500' : 
                    node.type === 'end' ? 'bg-red-100 border-l-4 border-red-500' : 
                    node.type === 'decision' ? 'bg-blue-100 border-l-4 border-blue-500' : 
                    'bg-white border border-gray-300'
                  }`}
                >
                  <div className="font-medium">{node.name}</div>
                  <div className="text-xs text-gray-500">{node.description || node.type}</div>
                </div>
              ))}
            </div>
            {widget.metadata?.edges && widget.metadata.edges.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="text-xs text-gray-500 mb-2">Connections:</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {widget.metadata.edges.map((edge: any, index: number) => (
                    <div key={index} className="text-xs bg-gray-50 p-2 rounded">
                      {edge.condition ? (
                        <span>{`${edge.from} → ${edge.to} (${edge.condition})`}</span>
                      ) : (
                        <span>{`${edge.from} → ${edge.to}`}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
        
      default:
        return <div>Unknown widget type: {widget.type}</div>;
    }
  };

  return (
    <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-2">
        <div className="flex items-center">
          {renderWidgetIcon()}
          <CardTitle className="text-lg">{widget.title}</CardTitle>
        </div>
        <CardDescription className="text-sm">{widget.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {renderWidgetContent()}
        
        {/* Display metadata footnotes or legends if available */}
        {widget.metadata?.notes && (
          <div className="mt-4 pt-2 border-t text-sm text-muted-foreground">
            <div className="font-medium mb-1">Notes:</div>
            <div>{widget.metadata.notes}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WidgetRenderer;
