import React, { useState, useEffect, useRef } from "react";

import DashboardAccount from "../../components/admin/DashboardAccount";
import { useLayoutContent } from '../../contexts/admin/LayoutContext';

const Dashboard = () => {
    const { layoutContent } = useLayoutContent();
    const addClass = layoutContent === "vertical" ? "max-h-[78vh]" : "max-h-[67vh]";

    return (
        <div className={`overflow-y-auto ${addClass}`}>
            <DashboardAccount />
        </div>
    )
}

export default Dashboard;