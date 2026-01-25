import React from "react";

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  id?: string;
  className?: string;
}

const NumberInput: React.FC<NumberInputProps> = ({ label, value, onChange, id, className }) => (
  <div className="flex items-center gap-2 px-8">
    <label htmlFor={id} className="text-left text-zinc-400 w-36">{label}</label>
    <input
      id={id}
      type="number"
      className={
        className ||
        "w-20 h-8 rounded-md border border-zinc-600 bg-zinc-800 px-2 py-1 text-base text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150 shadow-sm"
      }
      value={value}
      onChange={e => onChange(parseFloat(e.target.value))}
    />
  </div>
);

export default NumberInput;
