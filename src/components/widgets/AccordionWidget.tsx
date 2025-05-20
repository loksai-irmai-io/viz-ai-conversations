
import React from 'react';
import { Widget } from '@/data/mock-data';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface AccordionWidgetProps {
  widget: Widget;
}

const AccordionWidget: React.FC<AccordionWidgetProps> = ({ widget }) => {
  const { metadata } = widget;
  
  return (
    <Accordion type="single" collapsible className="w-full">
      {metadata.sections.map((section: any, index: number) => (
        <AccordionItem key={index} value={`item-${index}`}>
          <AccordionTrigger className="text-left">
            {section.title}
          </AccordionTrigger>
          <AccordionContent>
            <div className="whitespace-pre-line text-sm">{section.content}</div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default AccordionWidget;
