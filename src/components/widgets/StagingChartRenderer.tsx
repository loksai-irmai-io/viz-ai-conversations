
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { StagingChart } from '@/services/stagingChartsService';
import ChartWidget from './ChartWidget';
import { Widget } from '@/data/mock-data';
import { ChartBar, Database } from 'lucide-react';

interface StagingChartRendererProps {
  chart: StagingChart;
}

const StagingChartRenderer: React.FC<StagingChartRendererProps> = ({ chart }) => {
  console.log('Rendering staging chart:', chart);
  
  // Convert StagingChart to Widget format for compatibility
  const convertToWidget = (stagingChart: StagingChart): Widget => {
    return {
      id: stagingChart.id,
      title: stagingChart.title,
      description: stagingChart.description || 'Chart from staging environment',
      type: stagingChart.type || 'bar-chart',
      module: 'staging',
      metadata: stagingChart.metadata || {},
      keywords: ['staging', 'chart'],
      image: '',
      createdAt: stagingChart.createdAt,
      updatedAt: stagingChart.updatedAt
    };
  };

  const widget = convertToWidget(chart);

  return (
    <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-2">
        <div className="flex items-center">
          <Database className="h-5 w-5 mr-2 text-blue-600" />
          <CardTitle className="text-lg">{chart.title}</CardTitle>
        </div>
        <CardDescription className="text-sm">
          {chart.description || 'Staging chart visualization'}
        </CardDescription>
        <div className="text-xs text-muted-foreground">
          Source: Staging API • Type: {chart.type}
        </div>
      </CardHeader>
      <CardContent>
        <ChartWidget widget={widget} />
        
        {/* Display staging-specific metadata */}
        {chart.createdAt && (
          <div className="mt-4 pt-2 border-t text-sm text-muted-foreground">
            <div className="font-medium mb-1">Staging Info:</div>
            <div>Created: {new Date(chart.createdAt).toLocaleDateString()}</div>
            {chart.updatedAt && (
              <div>Updated: {new Date(chart.updatedAt).toLocaleDateString()}</div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StagingChartRenderer;
