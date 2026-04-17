import React from 'react';
import { cn } from "@/lib/utils";

interface LiquidProgressBarProps {
  percentage: number;
  color?: 'navy' | 'orange';
  className?: string;
}

const LiquidProgressBar: React.FC<LiquidProgressBarProps> = ({ 
  percentage, 
  color = 'orange', 
  className 
}) => {
  // Ensure percentage is between 0 and 100
  const clampedPercentage = Math.min(Math.max(percentage, 0), 100);

  return (
    <div className={cn("chart-3d", className)}>
      <div className={cn("bar-3d", color)}>
        <div className="face top">
          <div className="growing-bar" style={{ width: `${clampedPercentage}%` }} />
        </div>
        <div className="face side-0">
          <div className="growing-bar" style={{ width: `${clampedPercentage}%` }} />
        </div>
        <div className="face floor">
          <div className="growing-bar" style={{ width: `${clampedPercentage}%` }} />
        </div>
        <div className="face side-a" />
        <div className="face side-b" />
        <div className="face side-1">
          <div className="growing-bar" style={{ width: `${clampedPercentage}%` }} />
        </div>
      </div>
    </div>
  );
};

export default LiquidProgressBar;
