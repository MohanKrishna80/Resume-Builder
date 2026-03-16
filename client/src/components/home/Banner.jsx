import React from "react";
const Banner = () => {
  return (
    <div className="w-full py-2.5 px-3 text-xs sm:text-sm font-medium text-green-800 text-center bg-gradient-to-r from-[#ABFF7E] to-[#FDFEFF]">
      <p className="flex items-center justify-center flex-wrap gap-2">
        <span className="px-2 sm:px-3 py-1 rounded-lg text-white bg-green-600">
          New
        </span>
        <span>AI Feature Added</span>
      </p>
    </div>
  );
};

export default Banner;
