import React, { useState, useEffect, useRef } from "react";
import Header from "../../components/admin/Header";
import Footer from "../../components/admin/Footer";
import Sidebar from "../../components/admin/Sidebar";
import ThemeCustomizer from '../../components/admin/ThemeCustomizer';
import FileManagerComponent from "../../components/admin/FileManager";
import HorizontalNav from '../../components/admin/HorizontalNav';
import { useLayoutContent } from '../../contexts/admin/LayoutContext';

const FileManager = () => {
  const [showCustomizer, setShowCustomizer] = useState(false);
  const { layoutContent } = useLayoutContent();

    return (
        <FileManagerComponent />
    )
}

export default FileManager;