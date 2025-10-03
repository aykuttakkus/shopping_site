import React from 'react';
import { GoldColor } from '../services/api';

interface ColorPickerProps {
  selectedColor: GoldColor;
  onColorChange: (color: GoldColor) => void;
  size?: 'sm' | 'md' | 'lg';
}

const ColorPicker: React.FC<ColorPickerProps> = ({ 
  selectedColor, 
  onColorChange, 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  const borderClasses = {
    sm: 'border-2',
    md: 'border-2',
    lg: 'border-3'
  };

  const colors: { color: GoldColor; bgColor: string; label: string }[] = [
    { color: 'yellow', bgColor: 'bg-yellow-gold', label: 'Yellow Gold' },
    { color: 'white', bgColor: 'bg-white-gold', label: 'White Gold' },
    { color: 'rose', bgColor: 'bg-rose-gold', label: 'Rose Gold' },
  ];

  return (
    <div className="flex items-center space-x-2">
      {colors.map(({ color, bgColor, label }) => (
        <button
          key={color}
          onClick={() => onColorChange(color)}
          className={`
            ${sizeClasses[size]} 
            ${bgColor} 
            rounded-full 
            ${borderClasses[size]}
            transition-all duration-200 
            hover:scale-110 
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400
            ${selectedColor === color 
              ? 'border-yellow-600 shadow-lg ring-2 ring-yellow-200' 
              : 'border-gray-300 hover:border-gray-400'
            }
          `}
          aria-label={`Select ${label}`}
          title={label}
        />
      ))}
    </div>
  );
};

export default ColorPicker;
