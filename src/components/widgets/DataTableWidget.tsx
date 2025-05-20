
import React from 'react';
import { Widget } from '@/data/mock-data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface DataTableWidgetProps {
  widget: Widget;
}

const DataTableWidget: React.FC<DataTableWidgetProps> = ({ widget }) => {
  const { metadata } = widget;
  
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {metadata.columns.map((col: any) => (
              <TableHead key={col.key}>{col.header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {metadata.data.map((row: any, index: number) => (
            <TableRow key={index}>
              {metadata.columns.map((col: any) => (
                <TableCell key={col.key}>{row[col.key]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DataTableWidget;
