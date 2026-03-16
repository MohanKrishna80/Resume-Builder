import { Check, Palette } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

const ColorPicker = ({ selectedColor, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef(null);

  const colors = [
    { name: "Blue", value: "#3B82F6" },
    { name: "Indigo", value: "#6366F1" },
    { name: "Purple", value: "#8B5CF6" },
    { name: "Green", value: "#10B981" },
    { name: "Red", value: "#EF4444" },
    { name: "Orange", value: "#F97316" },
    { name: "Teal", value: "#14B8A6" },
    { name: "Pink", value: "#EC4899" },
    { name: "Gray", value: "#6B7280" },
    { name: "Black", value: "#1F2937" },

    // Professional resume colors
    { name: "Navy", value: "#1E3A8A" },
    { name: "Slate", value: "#334155" },
    { name: "Emerald", value: "#047857" },
    { name: "Steel Blue", value: "#4682B4" },
    { name: "Forest Green", value: "#166534" },
    { name: "Burgundy", value: "#7F1D1D" },
    { name: "Charcoal", value: "#374151" },
  ];

  // close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={pickerRef}>
      {/* Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm text-purple-600 bg-gradient-to-br from-purple-50 to-purple-100 ring-1 ring-purple-300 hover:ring-2 transition-all px-3 py-2 rounded-lg"
      >
        <Palette size={16} />

        {/* Selected color preview */}
        <div
          className="w-4 h-4 rounded-full border"
          style={{ backgroundColor: selectedColor }}
        />

        <span className="max-sm:hidden">Accent</span>
      </button>

      {/* Color panel */}
      {isOpen && (
        <div className="grid grid-cols-4 w-72 gap-3 absolute top-full left-0 p-4 mt-2 z-10 bg-white rounded-xl border border-gray-200 shadow-lg animate-fadeIn">
          {colors.map((color) => (
            <div
              key={color.value}
              className="relative cursor-pointer group flex flex-col items-center"
              onClick={() => {
                onChange(color.value);
                setIsOpen(false);
              }}
            >
              <div className="relative">
                <div
                  className="size-14 rounded-full border-2 border-transparent group-hover:border-black/20 transition"
                  style={{ backgroundColor: color.value }}
                />

                {selectedColor === color.value && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Check className="size-5 text-white drop-shadow" />
                  </div>
                )}
              </div>

              <p className="text-[10px] mt-1 text-gray-600 text-center">
                {color.name}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
