import React from "react";

interface LoadingIndicatorProps {
  message?: string;
}

// Simple text-based loading indicator
const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  message = "Loading...",
}) => {
  return <div className="text-blue-600 font-medium">{message}</div>;
};

export default LoadingIndicator;
