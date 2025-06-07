import React, { useState, useEffect, useRef } from "react";
import StatCard from './StatCard';
import CompanyCard from './CompanyCard';
import { useLayoutContent } from '../../contexts/admin/LayoutContext';
import Button from "./Button";
import Pagination from "./Pagination";

const DashboardAccount = () => {
    const { layoutContent } = useLayoutContent();
    const addClass = layoutContent === "vertical" ? "" : "stat-card-content-horizontal";
    const addClassContent = layoutContent === "vertical" ? "" : "dashboard-content-horizontal";
    return(
        <div className={`${addClassContent}`}>
            <div className="flex items-center justify-between w-full my-4 header-dashboard pb-3">
                <h3 className="font-bold mx-4 text-white">DASHBOARD</h3>
                <div className="flex gap-2 mr-5">
                    <ul className="flex flex-row font-medium space-x-2 rtl:space-x-reverse text-sm">
                        <li className="text-gray-300"><a href="#"></a>Dashboard</li>
                        <li><i className="bi bi-caret-right-fill text-gray-500"></i></li>
                        <li className="text-gray-600">Dashboard</li>
                    </ul>
                </div>
            </div>
            <div className="flex flex-wrap md:flex-nowrap gap-x-1 gap-y-5">
                <div className="w-full md:w-6/12 pl-5 overflow-x-auto">
                    <div className={`flex flex-wrap gap-3 ${addClass}`}>
                        <StatCard title="Total Demandes" total="36,894" percentage={95} color="#10B981" />
                        <StatCard title="Demande acceptée" total="28,410" percentage={97} color="#10B981" />
                        <StatCard title="Nouvelle Demande" total="4,305" percentage={80} color="#10B981" />
                        <StatCard title="Demande réfusée" total="5,021" percentage={89} color="#F87171" />
                        <StatCard title="Total client" total="3,948" percentage={64} color="#3B82F6" />
                        <StatCard title="Client satisfait" total="1,340" percentage={20} color="#F59E0B" />
                    </div>

                </div>
                <div className="w-full md:w-6/12 admin-content px-3 overflow-x-auto">
                    <div className="mt-5">
                        <div className="flex items-center justify-between w-full mb-4 pb-2 title-stat-card">
                            <h3 className="text-lg font-bold mb-4 text-white">Featured Companies</h3>
                            <div className="flex mr-5">
                            <Button
                                variant="primary"
                                size="medium"
                                className="bg-red-400 text-black py-1 rounded-lg px-4"
                            >
                                View all Companies <i className="ml-2 bi bi-arrow-right-short"></i>
                            </Button>
                            </div>
                        </div>
                        <CompanyCard
                            name="Force Medicines"
                            iconUnique={<i className="bi bi-hospital-fill"></i>}
                            location="Cullera, Spain"
                            icons={[<i className="bi bi-facebook"></i>, <i className="bi bi-envelope"></i>, <i className="bi bi-globe"></i>]}
                        />
                        <CompanyCard
                            name="Force Medicines"
                            iconUnique={<i className="bi bi-hospital-fill"></i>}
                            location="Cullera, Spain"
                            icons={[<i className="bi bi-facebook"></i>, <i className="bi bi-envelope"></i>, <i className="bi bi-globe"></i>]}
                        />
                        <CompanyCard
                            name="Force Medicines"
                            iconUnique={<i className="bi bi-hospital-fill"></i>}
                            location="Cullera, Spain"
                            icons={[<i className="bi bi-facebook"></i>, <i className="bi bi-envelope"></i>, <i className="bi bi-globe"></i>]}
                        />
                        <CompanyCard
                            name="Force Medicines"
                            iconUnique={<i className="bi bi-hospital-fill"></i>}
                            location="Cullera, Spain"
                            icons={[<i className="bi bi-facebook"></i>, <i className="bi bi-envelope"></i>, <i className="bi bi-globe"></i>]}
                        />
                        <CompanyCard
                            name="Force Medicines"
                            iconUnique={<i className="bi bi-hospital-fill"></i>}
                            location="Cullera, Spain"
                            icons={[<i className="bi bi-facebook"></i>, <i className="bi bi-envelope"></i>, <i className="bi bi-globe"></i>]}
                        />
                        {/* Ajoute les autres entreprises ici */}
                    </div>
                    <div className="mt-5">
                        <Pagination />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardAccount;