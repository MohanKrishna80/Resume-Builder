import { Type, Check } from "lucide-react";
import React, { useState } from "react";

const FontSelector = ({ selectedFont, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const fonts = [
    { name: "Inter", value: "Inter, sans-serif" },
    { name: "Roboto", value: "Roboto, sans-serif" },
    { name: "Roboto Slab", value: "'Roboto Slab', serif" },
    { name: "Poppins", value: "Poppins, sans-serif" },
    { name: "Open Sans", value: "'Open Sans', sans-serif" },
    { name: "Merriweather", value: "Merriweather, serif" },
    { name: "Lato", value: "Lato, sans-serif" },
    { name: "JetBrains Mono", value: "'JetBrains Mono', monospace" },
    { name: "Source Code Pro", value: "'Source Code Pro', monospace" },
    { name: "Times New Roman", value: "'Times New Roman', Times, serif" },
    { name: "Georgia", value: "Georgia, serif" },
    { name: "Garamond", value: "Garamond, serif" },
    { name: "Book Antiqua", value: "'Book Antiqua', Palatino, serif" },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-sm text-indigo-600 bg-indigo-50 ring-1 ring-indigo-300 hover:ring-2 transition-all px-3 py-2 rounded-lg"
      >
        <Type size={14} />
        <span className="max-sm:hidden">Font</span>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 w-56 bg-white border rounded-md shadow-sm z-10">
          {fonts.map((font) => (
            <div
              key={font.value}
              onClick={() => {
                onChange(font.value);
                setIsOpen(false);
              }}
              className="flex items-center justify-between px-3 py-2 hover:bg-gray-100 cursor-pointer"
              style={{ fontFamily: font.value }}
            >
              <span>{font.name}</span>

              {selectedFont === font.value && (
                <Check className="size-4 text-green-600" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FontSelector;
