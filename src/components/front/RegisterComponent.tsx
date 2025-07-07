import React, { useState } from "react";
import { useGlobalActiveCodeCouleur } from "../../hooks/UseGlobalActiveCodeCouleur";
import Swal from "sweetalert2";
import api from "../../service/Api";

const RegisterForm = () => {
  const [form, setForm] = useState({
    prenom: "",
    nom: "",
    email: "",
    phone: "",
    adresse: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { codeCouleur } = useGlobalActiveCodeCouleur();
  const primaryColor = codeCouleur?.btnColor || "#9A00FF";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { [key: string]: string } = {};

    //if (!form.prenom) newErrors.prenom = "Le prénom est requis.";
    if (!form.nom) newErrors.nom = "Le nom est requis.";
    if (!form.email) newErrors.email = "L'email est requis.";
    if (!form.password) newErrors.password = "Le mot de passe est requis.";
    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("Form submitted:", form);
    }

    try {
      const response = await api.post("/api/users", form);
      console.log("Réponse API:", response.data);

      Swal.fire({
        icon: "success",
        title: "Bon travail!",
        text: "Compte ajouté avec succès !",
        confirmButtonColor: "#7c3aed", // violet
        cancelButtonColor: "#ef4444", // rouge
        showCancelButton: true,
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        background: "#1c2d55",
        color: "#fff",
      }).then(() => {
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


  const InputField = ({
    name,
    type,
    placeholder,
    icon,
    value,
    error,
  }: {
    name: string;
    type: string;
    placeholder: string;
    icon: string;
    value: string;
    error?: string;
  }) => (
    <div>
      <div className="relative">
        <i className={`bi ${icon} absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400`}></i>
        <input
          type={type}
          name={name}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color)] transition"
          style={{ "--color": primaryColor } as React.CSSProperties}
        />
      </div>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );

  return (
    <div className="flex justify-center mt-12 mb-24">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-8 border border-gray-200">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Inscription</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
         
          <InputField
            name="nom"
            type="text"
            placeholder="Nom"
            icon="bi-person"
            value={form.nom}
            error={errors.nom}
          />
           <InputField
            name="prenom"
            type="text"
            placeholder="Prénom"
            icon="bi-person"
            value={form.prenom}
            error={errors.prenom}
          />
          <InputField
            name="email"
            type="email"
            placeholder="Email"
            icon="bi-envelope"
            value={form.email}
            error={errors.email}
          />
          <InputField
            name="password"
            type="password"
            placeholder="Mot de passe"
            icon="bi-lock"
            value={form.password}
            error={errors.password}
          />
          <InputField
            name="confirmPassword"
            type="password"
            placeholder="Confirmation du mot de passe"
            icon="bi-lock"
            value={form.confirmPassword}
            error={errors.confirmPassword}
          />
           <InputField
            name="phone"
            type="text"
            placeholder="Téléphone"
            icon="bi-telephone-fill"
            value={form.phone}
            error={errors.phone}
          />
           <InputField
            name="adresse"
            type="text"
            placeholder="Adresse"
            icon="bi-geo-alt-fill"
            value={form.adresse}
            error={errors.adresse}
          />

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
