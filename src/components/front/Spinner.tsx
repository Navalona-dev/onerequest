// src/components/front/Spinner.tsx
import React, { useState, useEffect } from "react";

export const Spinner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2000); // 3 secondes

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      id="spinner"
      className="
        fixed inset-0
        w-full h-screen
        bg-white
        flex items-center justify-center
        z-50
      "
    >
      <div
        className="
          animate-spin
          rounded-full
          border-4 border-gray-200 border-t-red-500
          w-12 h-12
        "
        role="status"
      />
    </div>
  );
};
