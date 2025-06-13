import React from 'react';
import './App.css';
import './assets/css/Style.css';
import ContentPage from './pages/admin/ContentPage';
import { ThemeProvider } from "./contexts/admin/ThemeContext";
import { LayoutContentProvider } from "./contexts/admin/LayoutContext";
import { ModuleProvider } from "./contexts/admin/ModuleContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import 'swiper/css';
import 'swiper/css/pagination';
import { Provider } from "react-redux";
import { store } from "./store";
import PrivateRouteAdmin from './service/PrivateRouteAdmin';

import ContentPageFront from './pages/front/ContentPage';
import LoginPage from './pages/admin/LoginPage';
import LogoutAdmin from './service/LogoutAdmin';
import TokenWatcher from './service/TokenWatcher';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
      <ThemeProvider>
        <LayoutContentProvider>
          <ModuleProvider>
          <TokenWatcher />
            <Routes>
              <Route path="/" element={<ContentPageFront />} />
              <Route path="/soumettre-demande" element={<ContentPageFront />} />
              <Route path="/contact" element={<ContentPageFront />} />
              <Route path="/rendez-vous" element={<ContentPageFront />} />
              <Route path="/admin/login" element={<LoginPage />} />
              <Route path="/admin/logout" element={<LogoutAdmin />} />
              <Route element={<PrivateRouteAdmin />}>
                <Route path="/admin" element={<ContentPage />} />
                <Route path="/document" element={<ContentPage />} />
                <Route path="/report" element={<ContentPage />} />
                <Route path="/demande" element={<ContentPage />} />
                <Route path="/code-couleur" element={<ContentPage />} />
                <Route path="/site" element={<ContentPage />} />
                <Route path="/user" element={<ContentPage />} />
                <Route path="/region" element={<ContentPage />} />
              </Route>
            </Routes>
          </ModuleProvider>
        </LayoutContentProvider>
      </ThemeProvider>
    </BrowserRouter>
    </Provider>
    
  );
}

export default App;
