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
import PrivateRouteAdmin from './service/admin/PrivateRouteAdmin';
import PrivateRouteFront from './service/front/PrivateRouteFront';

import ContentPageFront from './pages/front/ContentPage';
import LoginPage from './pages/admin/LoginPage';
import LogoutAdmin from './service/admin/LogoutAdmin';
import LogoutFront from './service/front/LogoutFront';
import TokenWatcher from './service/TokenWatcher';
import { useGlobalActiveCodeCouleur } from './hooks/UseGlobalActiveCodeCouleur';

function App() {
  const {codeCouleur, loading} = useGlobalActiveCodeCouleur();

  return (
    <>
    {codeCouleur?.id && (
      <style>
        {`
          button, .btn-list {
            background-color: ${codeCouleur.btnColor}
          }
          button:hover, .btn-list:hover {
            background-color: ${codeCouleur.btnColorHover}
          }
        `}
      </style>
    )}
      <Provider store={store}>
        <BrowserRouter>
        <ThemeProvider>
          <LayoutContentProvider>
            <ModuleProvider>
            <TokenWatcher />
              <Routes>
                <Route path="/" element={<ContentPageFront />} />
                <Route path="/contact" element={<ContentPageFront />} />
                <Route path="/inscription" element={<ContentPageFront />} />
                <Route path="/connexion" element={<ContentPageFront />} />
                <Route path="/logout" element={<LogoutFront />} />
                <Route element={<PrivateRouteFront />}>
                  <Route path="/soumettre-demande" element={<ContentPageFront />} />
                  <Route path="/rendez-vous" element={<ContentPageFront />} />
                  <Route path="/mes-demandes" element={<ContentPageFront />} />
                  <Route path="/:idDemande/update-demande" element={<ContentPageFront />} />
                </Route>

                <Route path="/admin/login" element={<LoginPage />} />
                <Route path="/admin/logout" element={<LogoutAdmin />} />

                <Route element={<PrivateRouteAdmin />}>
                  <Route path="/no-access" element={<ContentPage />} />
                  <Route path="/admin" element={<ContentPage />} />
                  <Route path="/document" element={<ContentPage />} />
                  <Route path="/report" element={<ContentPage />} />
                  <Route path="/demande" element={<ContentPage />} />
                  <Route path="/:idDemande/traitement" element={<ContentPage />} />
                </Route>

                <Route element={<PrivateRouteAdmin requiredPrivilege="super_admin"/>}>
                    <Route path="/type-demande" element={<ContentPage />} />
                    <Route path="/:id/rang" element={<ContentPage />} />
                    <Route path="/niveau-hierarchiques" element={<ContentPage />} />
                    <Route path="/:idDepartement/niveau-hierarchique" element={<ContentPage />} />
                    <Route path="/user" element={<ContentPage />} />

                </Route>

                <Route element={<PrivateRouteAdmin requiredPrivilege="super_admin" requireIsSuperAdmin={true} />}>
                  <Route path="/departement" element={<ContentPage />} />
                  <Route path="/code-couleur" element={<ContentPage />} />
                  <Route path="/site" element={<ContentPage />} />
                  <Route path="/privilege" element={<ContentPage />} />
                  <Route path="/:idRegion/commune" element={<ContentPage />} />
                  <Route path="/region" element={<ContentPage />} />
                  <Route path="/categorie-domaine-entreprise" element={<ContentPage />} />
                  <Route path="/domaine-entreprise-liste" element={<ContentPage />} />
                  <Route path="/:idCategorieDomaine/domaine-entreprise" element={<ContentPage />} />

                </Route>

              </Routes>
            </ModuleProvider>
          </LayoutContentProvider>
        </ThemeProvider>
      </BrowserRouter>
      </Provider>
    </>
    
  );
}

export default App;
