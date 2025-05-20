
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

  const renderWidgetContent = () => {
    switch (widget.type) {
      case 'info-card-small':
      case 'info-card-medium':
      case 'info-card-large':
        return <InfoCardWidget widget={widget} />;
      
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
        return <ChartWidget widget={widget} />;
      
      case 'data-table':
        return <DataTableWidget widget={widget} />;
        
      case 'accordion-widget':
        return <AccordionWidget widget={widget} />;
        
      case 'progress-widget':
        return <ProgressWidget widget={widget} />;
        
      case 'list-widget':
        return <ListWidget widget={widget} />;
        
      default:
        return <div>Unknown widget type: {widget.type}</div>;
    }
  };

  return (
    <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{widget.title}</CardTitle>
        <CardDescription className="text-sm">{widget.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {renderWidgetContent()}
      </CardContent>
    </Card>
  );
};

export default WidgetRenderer;
