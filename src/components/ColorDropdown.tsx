import React, { useState, useRef, useEffect } from "react";
import { colorOptions } from "../constants";

interface ColorDropdownProps {
  value: string;
  onChange: (color: string) => void;
}

const ColorDropdown: React.FC<ColorDropdownProps> = ({ value, onChange }) => {
  const [open, setOpen] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);
  const selectedOption = colorOptions.find(opt => opt.value.toLowerCase() === value?.toLowerCase() || opt.name.toLowerCase() === value?.toLowerCase()) ?? colorOptions[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="flex items-center gap-2 px-8 mb-2 relative">
      <span className="text-left text-zinc-400 w-36 text-xs">Color:</span>
      <button
        type="button"
        className="w-22 h-6 rounded-md border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer transition-colors duration-150 shadow-sm"
        style={{ background: selectedOption.value }}
        onClick={() => setOpen(o => !o)}
        title={selectedOption.name}
      />
      {open && (
        <div className="absolute left-36 top-9 z-50 bg-zinc-800 border border-zinc-600 rounded shadow-lg p-2 grid grid-cols-4 gap-2">
          {colorOptions.map(opt => (
            <button
              key={opt.name}
              type="button"
              className={`w-7 h-7 rounded border-2 cursor-pointer transition-transform hover:scale-110 ${selectedOption.name === opt.name ? 'border-white' : 'border-transparent'}`}
              style={{ background: opt.value }}
              title={opt.name}
              onClick={() => { onChange(opt.value); setOpen(false); }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
export default ColorDropdown;
