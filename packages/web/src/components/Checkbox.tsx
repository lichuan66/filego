import React, { useState } from "react";

interface CheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
  style?: any;
}

export default function Checkbox({
  checked = false,
  onChange = (val) => {},
  label = "",
  disabled = false,
  className = "",
  style = {},
}: CheckboxProps) {
  const [isChecked, setIsChecked] = useState(checked);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    setIsChecked(isChecked);
    if (onChange) {
      onChange(isChecked);
    }
  };

  return (
    <label className={`flex items-center ${disabled ? "opacity-50" : ""}`}>
      <input
        style={style}
        type="checkbox"
        checked={isChecked}
        onChange={handleChange}
        disabled={disabled}
        className={`cursor-pointer  ${className}`}
      />
      {label && <span>{label}</span>}
    </label>
  );
}
