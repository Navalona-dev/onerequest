import React, { useState, useEffect, useRef } from "react";
import { TableFileManagerList } from "../../datas/DashboardTable"; // adapte le chemin si besoin
import Pagination from "./Pagination";

const TableFileManager = () => {
    const [openRowId, setOpenRowId] = useState<number | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
  
    // Ferme le dropdown si on clique en dehors
    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
            setOpenRowId(null);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    return (

        <div className="relative shadow-md sm:rounded-lg ">
            <div className="overflow-x-auto content-table-file-manager">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 table-dashboard">
                    <thead className="text-xs text-white bg-[#1c2d55]">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Product name
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Color
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Category
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Price
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {TableFileManagerList.map((data) => (
                        <tr className="" id="" key={data.id}>
                            <th scope="row" className="px-6 py-4 font-medium 0 whitespace-nowrap dark:text-white">
                                {data.nom}
                            </th>
                            <td className="px-6 py-4">
                                {data.color}
                            </td>
                            <td className="px-6 py-4">
                                {data.category}
                            </td>
                            <td className="px-6 py-4">
                                {data.price}
                            </td>
                            <td className="px-6 py-4" >
                                <button
                                    onClick={() => setOpenRowId(openRowId === data.id ? null : data.id)}
                                    className="cursor-pointer bg-[#1c2d55] text-xl flex items-center justify-center w-10 h-10 rounded"
                                    
                                >
                                    <span className="text-white">...</span>
                            
                                </button>


                            {openRowId === data.id && (
                                    <div className="absolute right-0 mt-2 w-32 bg-[#111C44]  text-white z-10">
                                    <ul className="text-sm admin-folder-dropdown">
                                        <li className="px-4 py-2 hover:bg-[#1c2d55] cursor-pointer">View</li>
                                        <li className="px-4 py-2 hover:bg-[#1c2d55] cursor-pointer">Rename</li>
                                        <li className="px-4 py-2 hover:bg-[#1c2d55] cursor-pointer">Delete</li>
                                    </ul>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                    
                    </tbody>
                </table>
            </div>
            <div className="mt-5">
                <Pagination />
            </div>
        </div>

    )
}

export default TableFileManager;