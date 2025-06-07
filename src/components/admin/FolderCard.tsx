import React, { useState, useRef, useEffect } from "react";
import { FaFolder } from "react-icons/fa";

const FaFolderIcon = FaFolder as React.FC<React.SVGProps<SVGSVGElement>>;

interface FolderCardProps {
  name: string;
  files: number;
  selected?: boolean;
}

const FolderCard: React.FC<FolderCardProps> = ({ name, files, selected }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Ferme le dropdown si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`px-4 pt-4 pb-5 rounded-xl bg-[#111C44] text-white w-full w-56 shadow hover:bg-[#1c2d55] transition admin-folder-content`}>
      <div className="flex justify-between items-center">
        <input type="checkbox" defaultChecked={selected} />
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen(!open)}
            className="text-right text-xs cursor-pointer"
          >
            ⋮
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-32 bg-[#111C44]  text-white z-10">
              <ul className="text-sm admin-folder-dropdown">
                <li className="px-4 py-2 hover:bg-[#1c2d55] cursor-pointer">Open</li>
                <li className="px-4 py-2 hover:bg-[#1c2d55] cursor-pointer">Rename</li>
                <li className="px-4 py-2 hover:bg-[#1c2d55] cursor-pointer">Delete</li>
              </ul>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col items-center mt-4">
      <FaFolderIcon className="text-yellow-400 text-4xl mb-2" />
        <h3 className="text-md">{name}</h3>
        <p className="text-sm text-gray-400">{files}</p>
      </div>
    </div>
  );
};

export default FolderCard;
