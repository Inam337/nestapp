import React from "react";

interface SwitchProps {
  isOn: boolean;
  handleToggle: () => void;
  disabled?: boolean;
}

const Switch: React.FC<SwitchProps> = ({
  isOn,
  handleToggle,
  disabled = false,
}) => {
  return (
    <div className="inline-block">
      <label className="flex items-center cursor-pointer">
        <div className="relative">
          <input
            type="checkbox"
            className="hidden"
            checked={isOn}
            onChange={handleToggle}
            disabled={disabled}
          />
          <div
            className={`w-10 h-5 rounded-full shadow-inner transition-colors duration-300 ease-in-out ${
              disabled ? "bg-gray-300" : isOn ? "bg-green-500" : "bg-gray-400"
            }`}
          />
          <div
            className={`absolute w-4 h-4 bg-white rounded-full shadow top-0.5 left-0.5 transition-transform duration-300 ease-in-out transform ${
              isOn ? "translate-x-5" : ""
            } ${disabled ? "bg-gray-200" : ""}`}
          />
        </div>
      </label>
    </div>
  );
};

export default Switch;
