import React, { useState } from "react";
import { useGlobalActiveCodeCouleur } from "../../hooks/UseGlobalActiveCodeCouleur";
import Swal from "sweetalert2";
import api from "../../service/Api";
import { publicApi } from "../../service/publicApi";
import { useNavigate } from "react-router-dom";
import { useLangueActive } from "../../hooks/useLangueActive";
import { useTranslation } from "react-i18next";


const RegisterForm = () => {

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    adresse: "",    
});

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { codeCouleur } = useGlobalActiveCodeCouleur();
  const primaryColor = codeCouleur?.btnColor || "#9A00FF";
  const navigate = useNavigate();
  const {langueActive} = useLangueActive();
  const { t, i18n } = useTranslation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const fieldLabels: { [key: string]: string } = {
    nom: t("register.nom"),
    prenom: t("register.prenom"),
    email: t("register.mail"),
    password: t("register.password"),
    confirmPassword: t("register.pwdConfirm"),
    phone: t("register.phone"),
    adresse: t("register.adresse"),
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const newErrors: { [key: string]: string } = {};
  
    if (!formData.nom) newErrors.nom = "Le nom est requis.";
    //if (!formData.prenom) newErrors.prenom = "Le prénom est requis.";
    if (!formData.email) newErrors.email = "L'email est requis.";
    if (!formData.password) newErrors.password = "Le mot de passe est requis.";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas.";
  
    setErrors(newErrors);
  
    // 🛑 Stoppe ici si erreurs
    if (Object.keys(newErrors).length > 0) {
      return;
    }
  
    try {
      const response = await publicApi.post("/api/users/register", formData, {
        params: {
          is_demandeur: true
        }
      });
  
      Swal.fire({
        icon: "success",
        title: langueActive?.indice === "fr" ? "Bon travail!" : 
            langueActive?.indice === "en" ? "Good job !" : "",
        text: "Compte ajouté avec succès !",
        confirmButtonColor: "#7c3aed",
        cancelButtonColor: "#ef4444",
        showCancelButton: true,
        confirmButtonText: "OK",
        cancelButtonText: "Annuler",
        background: "#1c2d55",
        color: "#fff",
      }).then(() => {
          navigate("/connexion");
         window.location.reload();
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Erreur lors de l'ajout de compte.",
        confirmButtonColor: "#ef4444",
        background: "#1c2d55",
        color: "#fff",
      });
    }
  };
  


  return (
    <div className="flex justify-center mt-12 mb-24">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-8 border border-gray-200">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">{t("register.title")}</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {Object.keys(formData).map((field) =>
            <div key={field}>
              <label htmlFor="">
                {fieldLabels[field] || field}
                {(field === "prenom" || field === "phone" || field === "adresse") ? (
                  <sup></sup>
                ) : (
                  <sup className="text-red-500 text-md ml-1"><strong>*</strong></sup>
                )}
              </label>
              <br />
              <span className="text-red-500 text-sm">{errors[field]}</span>
              <input 
                className="w-full p-2 rounded bg-gray-100 border-gray-100 text-gray-500 focus:outline-none focus:ring-0 focus:border-transparent "
                type={`${field === "password" ? "password" : field === "confirmPassword" ? "password" : field === "email" ? "email" : "text"}`} 
                placeholder={fieldLabels[field] || field} 
                name={field}
                value={formData[field as keyof typeof formData]}
                onChange={handleChange}
                autoComplete="off"
                required={field === "nom" || field === "password" || field === "confirmPassword" || field === "email"}
              />
            </div>
            
          )}

          <div className="my-3">
            <p className="text-center">
              {t("register.accountexist")}
              <span className="ml-3" 
              style={{
                color: codeCouleur?.textColor
              }}>
              <a href="/connexion" >{t("register.btn")}</a></span>
            </p>
          </div>
          
          <button
            type="submit"
            className="w-full py-2 text-white font-semibold rounded-lg transition"
            style={{ backgroundColor: primaryColor }}
          >
            S'inscrire
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
