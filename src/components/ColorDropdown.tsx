import React from "react";
import { colorOptions } from "../constants";

interface ColorDropdownProps {
  value: string;
  onChange: (color: string) => void;
}

const ColorDropdown: React.FC<ColorDropdownProps> = ({ value, onChange }) => {
  const colorName = value?.toLowerCase();
  const selectedOption = colorOptions.find(opt => opt.name === colorName);
  return (
    <label className="flex items-center gap-2 text-xs font-semibold">
      <select
        className="rounded px-2 py-1 bg-zinc-700 border border-zinc-600 focus:outline-none focus:ring focus:border-blue-400"
        style={{ color: selectedOption ? selectedOption.value : colorOptions[0].value }}
        value={selectedOption ? selectedOption.name : colorOptions[0].name}
        onChange={e => onChange(e.target.value)}
      >
        {colorOptions.map(opt => (
          <option key={opt.name} value={opt.name} style={{ color: opt.value, background: '#222' }}>{opt.name}</option>
        ))}
      </select>
      <span className="inline-block w-4 h-4 rounded border border-zinc-400 ml-2" style={{ background: selectedOption ? selectedOption.value : colorOptions[0].value }} />
    </label>
  );
};
export default ColorDropdown;
