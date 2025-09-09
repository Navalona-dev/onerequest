import React, { useState, useEffect, useRef } from "react";
import api from "../../service/Api";
import { publicApi } from "../../service/publicApi";
import { useGlobalActiveCodeCouleur } from "../../hooks/UseGlobalActiveCodeCouleur";

import { useNavigate } from "react-router-dom";
import { useLangueActive } from "../../hooks/useLangueActive";
import { useTranslation } from "react-i18next";

type Langue = {
  id: number;
  titleFr: string;
  titleEn: string;
  icon: string;
  isActive: boolean;
  indice: string;
};

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { codeCouleur, loading } = useGlobalActiveCodeCouleur();
  const { t, i18n } = useTranslation();
  const token = sessionStorage.getItem("jwt");
  const [langues, setListeLangue] = useState<Langue[]>([]);
  const { langueActive, setLangueActive } = useLangueActive();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showPassword, setShowPassword] = useState(false);


  const navigate = useNavigate();

  const getLangLabel = (lang: Langue): string => {
    if (!langueActive) return lang.titleFr;
    return langueActive.indice === "fr" ? lang.titleFr : lang.titleEn || lang.titleFr;
  };

  const handleLangueCurrent = async (langueId: number) => {
    const selectedLangue = langues.find((l) => l.id === langueId);
    if (!selectedLangue) return;

    i18n.changeLanguage(selectedLangue.indice);
    setLangueActive(selectedLangue);
    sessionStorage.setItem("langueActive", JSON.stringify(selectedLangue));

    if (token) {
      try {
        const email = sessionStorage.getItem("email");
        const response = await api.get(`/api/users/${email}/get-user-admin-connected`);
        const userId = response.data.id;

        await api.patch(
          `/api/users/${userId}/set-langue`,
          { langueId: langueId },
          { headers: { "Content-Type": "application/json" } }
        );
      } catch (error) {
        console.error("Erreur lors de la sauvegarde de la langue côté serveur:", error);
      }
    }

    window.location.reload();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post("/api/login", { email, password });
      const token = response.data.token;
      const dataUser = response.data.data;

      sessionStorage.setItem("jwt", token);
      sessionStorage.setItem("email", email);
      sessionStorage.setItem("demandeur", "non");
      sessionStorage.setItem("dataUser", JSON.stringify(dataUser));

      const aUniquementDemandeur =
        dataUser.privileges.length === 1 &&
        dataUser.privileges[0].title?.toLowerCase() === "demandeur";

      if (aUniquementDemandeur) {
        sessionStorage.removeItem("jwt");
        sessionStorage.removeItem("email");
        setError("Vous n’avez pas le droit d’accéder à cette interface.");
        return;
      }

      setError(null);
      navigate("/admin");
    } catch (err) {
      setError("Email ou mot de passe incorrect");
    }
  };

  useEffect(() => {
    publicApi
      .get("/api/langues/public")
      .then((response) => {
        setListeLangue(response.data);
      })
      .catch((error) => console.log("Erreur API", error));
  }, []);

  // Fermer dropdown si clic en dehors
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <style>
        {`
          body {
            background-color: #1c2d55;
            margin: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          }
          .login-container {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
          }
          .login-form {
            background-color: #ffffff;
            padding: 2.5rem 2rem;
            border-radius: 12px;
            width: 100%;
            max-width: 400px;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
          }
          .login-form h2 {
            text-align: center;
            margin-bottom: 1.5rem;
            color: #1c2d55;
          }
          .login-form label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: bold;
            color: #333;
          }
          .login-form input {
            width: 100%;
            padding: 0.7rem;
            margin-bottom: 1.2rem;
            border: 1px solid #ccc;
            border-radius: 6px;
            font-size: 1rem;
          }
          .login-form button {
            width: 100%;
            padding: 0.8rem;
            background-color: #1c2d55;
            color: #fff;
            font-size: 1rem;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            transition: background-color 0.3s ease;
          }
          .login-form button:hover {
            background-color: #142042;
          }
          .login-form .error {
            color: red;
            margin-top: -0.8rem;
            margin-bottom: 1rem;
            text-align: center;
            font-size: 0.9rem;
          }
        `}
      </style>

      <div className="login-container">
        <form className="login-form" onSubmit={handleSubmit}>
          {/* Dropdown Langue */}
          <div className="relative mb-6" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-between w-48 px-4 py-2 bg-white border rounded shadow cursor-pointer focus:outline-none"
              aria-expanded={isDropdownOpen}
              aria-haspopup="listbox"
            >
              <span className="mr-2">{langueActive?.icon}</span>
              <span>{langueActive && getLangLabel(langueActive)}</span>
              <i className="bi bi-chevron-down ml-2"></i>
            </button>

            {isDropdownOpen && (
              <ul
                role="listbox"
                className="absolute mt-1 w-48 bg-white border border-gray-300 rounded shadow max-h-60 overflow-auto z-20"
              >
                {langues.map((item) => (
                  <li
                    key={item.id}
                    role="option"
                    className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => {
                      handleLangueCurrent(item.id);
                      setDropdownOpen(false);
                    }}
                  >
                    <span className="mr-2">{item.icon}</span>
                    <span>{getLangLabel(item)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <h2>{t("login.title")}</h2>

          <label>{t("login.mail")} :</label>
          <input
            type="email"
            placeholder={t("login.mailtext")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>{t("login.password")} :</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder={t("login.pwdtext")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pr-10"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/3 transform -translate-y-1/2 cursor-pointer text-gray-600"
            >
              <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
            </span>
          </div>


          {error && <div className="error">{error}</div>}

          <button type="submit">{t("login.btn")}</button>
        </form>
      </div>
    </>
  );
};

export default LoginPage;
