import { useState } from 'react';
import PropTypes from 'prop-types';

const colorOptions = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F06292', '#AED581',
  '#FFD54F', '#4DB6AC', '#7986CB', '#9575CD', '#4DD0E1', '#81C784', '#DCE775',
  '#FFB74D', '#A1887F', '#90A4AE', '#B39DDB', '#FFAB91', '#F48FB1'
];

export default function ColorPicker({ selectedColor, onColorChange }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Color de la Carpeta
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <span className="flex items-center">
          <span className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: selectedColor }}></span>
          {selectedColor}
        </span>
        <span className="ml-2">▼</span>
      </button>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-gray-800 rounded-md shadow-lg">
          <div className="grid grid-cols-5 gap-2 p-2">
            {colorOptions.map((color) => (
              <button
                key={color}
                className="w-8 h-8 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ backgroundColor: color }}
                onClick={() => {
                  onColorChange(color);
                  setIsOpen(false);
                }}
              >
                <span className="sr-only">{color}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

ColorPicker.propTypes = {
  selectedColor: PropTypes.string.isRequired,
  onColorChange: PropTypes.func.isRequired,
};