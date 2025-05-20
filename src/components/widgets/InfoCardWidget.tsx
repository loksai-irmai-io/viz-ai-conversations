
import React from 'react';
import { Widget } from '@/data/mock-data';
import { motion } from 'framer-motion';

interface InfoCardWidgetProps {
  widget: Widget;
}

const InfoCardWidget: React.FC<InfoCardWidgetProps> = ({ widget }) => {
  const { metadata } = widget;
  
  const getBackgroundColor = (index: number) => {
    const colors = [
      'bg-blue-50 hover:bg-blue-100',
      'bg-green-50 hover:bg-green-100',
      'bg-purple-50 hover:bg-purple-100'
    ];
    return colors[index % colors.length];
  };
  
  const getTextColor = (index: number) => {
    const colors = [
      'text-blue-600',
      'text-green-600',
      'text-purple-600'
    ];
    return colors[index % colors.length];
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {metadata.stats.map((stat: any, index: number) => (
        <motion.div 
          key={index} 
          className={`${getBackgroundColor(index)} p-4 rounded-md shadow-sm transition-all duration-300 hover:shadow-md cursor-pointer`}
          variants={itemVariants}
        >
          <div className="text-sm text-gray-500">{stat.label}</div>
          <div className={`text-xl font-bold ${getTextColor(index)}`}>{stat.value}</div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default InfoCardWidget;
