
import React from 'react';
import { Widget } from '@/data/mock-data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface DataTableWidgetProps {
  widget: Widget;
}

const DataTableWidget: React.FC<DataTableWidgetProps> = ({ widget }) => {
  const { metadata } = widget;
  
  // Handle case when there's a threshold to highlight rows that exceed it
  const renderCellWithThreshold = (value: any, columnKey: string, row: any) => {
    // Check if this column should have threshold formatting (typically for hours or time values)
    if (metadata.threshold && (columnKey === 'hours' || columnKey === 'exceeds')) {
      const exceedsThreshold = 
        columnKey === 'exceeds' ? value === 'Yes' : 
        typeof value === 'number' && value > metadata.threshold;
      
      return (
        <TableCell 
          className={exceedsThreshold ? "text-red-500 font-semibold" : ""}
        >
          {value}
        </TableCell>
      );
    }
    
    // Check for outlier columns that should be highlighted
    if ((columnKey === 'outlier' || columnKey === 'durationOutlier' || columnKey === 'workloadOutlier') && value === 'Yes') {
      return (
        <TableCell className="text-red-500 font-semibold">{value}</TableCell>
      );
    }
    
    // Default rendering
    return <TableCell>{value}</TableCell>;
  };
  
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {metadata.columns.map((col: any) => (
              <TableHead key={col.key} className="whitespace-nowrap">{col.header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {metadata.data.map((row: any, index: number) => (
            <TableRow key={index}>
              {metadata.columns.map((col: any) => (
                renderCellWithThreshold(row[col.key], col.key, row)
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {/* Display threshold information if available */}
      {metadata.threshold && (
        <div className="mt-3 text-xs text-muted-foreground">
          <span className="font-medium">Threshold:</span> {metadata.threshold}
          {metadata.thresholdUnit && ` ${metadata.thresholdUnit}`}
        </div>
      )}
      
      {/* Display footnote if available */}
      {metadata.footnote && (
        <div className="mt-3 text-xs text-muted-foreground italic">
          {metadata.footnote}
        </div>
      )}
    </div>
  );
};

export default DataTableWidget;
