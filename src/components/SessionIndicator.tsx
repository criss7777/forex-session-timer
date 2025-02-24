
import React from 'react';
import { cn } from '@/lib/utils';

interface SessionIndicatorProps {
  name: string;
  isActive: boolean;
  colorClass: string;
}

const SessionIndicator = ({ name, isActive, colorClass }: SessionIndicatorProps) => {
  return (
    <div className={cn(
      "flex items-center space-x-2 p-4 rounded-lg transition-all duration-300",
      isActive ? "bg-gray-100" : "opacity-50"
    )}>
      <div className={cn(
        "h-3 w-3 rounded-full",
        isActive ? `${colorClass} animate-pulse` : "bg-gray-300"
      )} />
      <span className={cn(
        "font-medium",
        isActive ? colorClass : "text-gray-500"
      )}>
        {name}
      </span>
    </div>
  );
};

export default SessionIndicator;
