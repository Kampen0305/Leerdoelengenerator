import React, { useState } from "react";
import { Info } from "lucide-react";

interface InfoBoxProps {
  children: React.ReactNode;
}

export function InfoBox({ children }: InfoBoxProps) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="ml-1 text-blue-600 hover:text-blue-800 align-middle"
        aria-label="Toon meer info"
      >
        <Info className="w-4 h-4" />
      </button>
      {open && (
        <div className="absolute z-10 w-64 p-3 mt-1 text-xs text-gray-700 bg-white border border-gray-200 rounded shadow-lg">
          {children}
        </div>
      )}
    </span>
  );
}

export default InfoBox;
