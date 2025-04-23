import React from "react";

interface ToggleSwitchProps {
  isChecked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  id?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  isChecked,
  onChange,
  disabled = false,
  label,
  id = "toggle-switch",
}) => {
  return (
    <div className="flex items-center">
      {label && (
        <label htmlFor={id} className="mr-2 text-sm text-gray-700">
          {label}
        </label>
      )}
      <div className="relative inline-block w-10 mr-2 align-middle select-none">
        <input
          type="checkbox"
          id={id}
          checked={isChecked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
          style={{
            transition: "all 0.3s ease",
            left: isChecked ? "4px" : "0",
            border: isChecked ? "2px solid #4caf50" : "2px solid #f44336",
          }}
        />
        <label
          htmlFor={id}
          className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
          style={{
            background: isChecked ? "#4caf50" : "#f44336",
            transition: "background-color 0.3s ease",
          }}
        ></label>
      </div>
      <span className="text-sm text-gray-700 select-none">
        {isChecked ? "Active" : "Inactive"}
      </span>
    </div>
  );
};

export default ToggleSwitch;
