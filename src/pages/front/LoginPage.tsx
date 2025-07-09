import React, { useState } from "react";
import api from "../../service/Api";
import { useGlobalActiveCodeCouleur } from "../../hooks/UseGlobalActiveCodeCouleur";

import { useNavigate } from "react-router-dom";

const LoginPageFront = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { codeCouleur, loading } = useGlobalActiveCodeCouleur();

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post("/api/login", { email, password });
      const token = response.data.token;
      const dataUser = response.data.data;
  
      // Stock temporairement
      sessionStorage.setItem("jwt", token);
      sessionStorage.setItem("email", email);
      sessionStorage.setItem("demandeur", "oui");
      sessionStorage.setItem("dataUser", dataUser);

      const aLePrivilegeDemandeur = dataUser.privileges?.some(
        (priv: any) =>
          priv.title?.toLowerCase() === "demandeur" || priv.id === 10 
      );
  
      if (!aLePrivilegeDemandeur) {
        // ❌ Pas autorisé
        sessionStorage.removeItem("jwt");
        sessionStorage.removeItem("email");
        setError("Vous n'avez pas le droit d'accéder à cette interface.");
        return;
      }
  
      // ✅ OK
      setError(null);
      navigate("/");
    } catch (err) {
      setError("Email ou mot de passe incorrect");
    }
  };
  

  return (
    <>
      <style>
        {`
          

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
            padding: 0.5rem;
            color: #fff;
            font-size: 1rem;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            transition: background-color 0.3s ease;
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
          <h2 className="text-xl"> <strong>Connexion</strong></h2>

          <label>Email :</label>
          <input
            type="email"
            placeholder="Entrez votre email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Mot de passe :</label>
          <input
            type="password"
            placeholder="Entrez votre mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <div className="error">{error}</div>}

          <button type="submit">Se connecter</button>
        </form>
      </div>
    </>
  );
};

export default LoginPageFront;
