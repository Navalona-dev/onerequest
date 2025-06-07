import React, { useState, useEffect } from "react";
import { layoutOptions, colorSchemeOptions } from "../../datas/themeOptions"; // adapte le chemin si besoin
import { useTheme } from "../../contexts/admin/ThemeContext";
import { useLayoutContent } from "../../contexts/admin/LayoutContext";

interface ThemeCustomizerProps {
  onClose: () => void;
}

const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({ onClose }) => {
    const { theme, setTheme } = useTheme();
    const { layoutContent, setLayoutContent } = useLayoutContent();

  return (
    <div>
      {/* Header */}
      <div className="bg-red-500 px-3 py-4">
        <div className="flex items-center justify-between w-full">
          <h3 className="font-bold text-white">Thème personnalisé</h3>
          <span className="text-3xl text-white font-bold cursor-pointer" onClick={onClose}>×</span>
        </div>
      </div>
        <div className="overflow-y-auto max-h-[80vh]">
            {/* Layout */}
            <div className="layout py-4 px-5">
                <h3 className="font-bold text-white">LAYOUT</h3>
                <p className="text-gray-400">Choose your layout</p>
                <div className="flex flex-wrap gap-5 mt-4">
                {layoutOptions.map((layout) => (
                    <div key={layout.id} className="col">
                    <label
                        htmlFor={`layout-${layout.id}`}
                        className={`cursor-pointer block card-layout p-4 rounded ${
                            layoutContent === layout.id ? "bg-[#1c2d55]" : "bg-[#111C44]"
                        } hover:bg-[#1c2d55]`}
                        style={{
                            backgroundImage: `url(${layout.image})`,
                            backgroundSize: "cover",
                        }}
                        >
                        <input
                            type="radio"
                            id={`layout-${layout.id}`}
                            name="layout"
                            value={layout.id}
                            checked={layoutContent === layout.id}
                            onChange={() => setLayoutContent(layout.id as "vertical" | "horizontal")}
                            className="float-right"
                        />
                        </label>
                    <h5 className="font-bold text-white text-xs mt-2 text-center">{layout.label}</h5>
                    </div>
                ))}
                </div>
            </div>

            {/* Color Scheme */}
            <div className="color-scheme py-4 px-5">
                <h3 className="font-bold text-white">COLOR SCHEME</h3>
                <p className="text-gray-400">Choose Light or Dark Scheme</p>
                <div className="flex flex-wrap gap-5 mt-4">
                {colorSchemeOptions.map((scheme) => (
                    <div key={scheme.id} className="col">
                    <label
                        htmlFor={`scheme-${scheme.id}`}
                        className={`cursor-pointer block card-color-scheme p-4 rounded ${
                            theme === scheme.id ? "bg-[#1c2d55]" : "bg-[#111C44]"
                        } hover:bg-[#1c2d55]`}
                        style={{
                            backgroundImage: `url(${scheme.image})`,
                            backgroundSize: "cover",
                        }}
                        >
                        <input
                            type="radio"
                            id={`scheme-${scheme.id}`}
                            name="scheme"
                            value={scheme.id}
                            checked={theme === scheme.id}
                            onChange={() => setTheme(scheme.id as "light" | "dark" | "autre")}
                            className="float-right"
                        />
                        </label>
                    <h5 className="font-bold text-white text-xs mt-2 text-center">{scheme.label}</h5>
                    </div>
                ))}
                </div>
            </div>

        </div>
      
    </div>
  );
};

export default ThemeCustomizer;
