import { memo } from "react";
import { IconType } from "./types";

const MenuIcon: React.FC<IconType> = memo((props) => {
  const { width = 24, height = 24, className = "", fill = "#6F767E" } = props;

  return (
    <div className={className}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4 6H20M4 12H20M4 18H20"
          stroke={fill}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
});

export { MenuIcon };
