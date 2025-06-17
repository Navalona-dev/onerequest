import React, {useState} from "react";
import { AxiosError } from "axios";
import api from "../../../service/Api";
import Swal from "sweetalert2";

interface AddCategorieDomaineProps {
    setShowModalAdd: React.Dispatch<React.SetStateAction<boolean>>;
  }
  
  const AddCategorieDomaine: React.FC<AddCategorieDomaineProps> = ({ setShowModalAdd }) => {
      const [formData, setFormData] = useState({
          nom: "",
          description: "",
      });

      const fieldLabels: { [key: string]: string } = {
        nom: "Titre",
        description: "Description",
      };

      const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      };
      
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        try {
          const response = await api.post("/api/categorie_domaine_entreprises", formData);
          console.log("Réponse API:", response.data);
    
          Swal.fire({
            icon: "success",
            title: "Bon travail!",
            text: "Catégorie domaine entreprise ajoutée avec succès !",
            confirmButtonColor: "#7c3aed", // violet
            cancelButtonColor: "#ef4444", // rouge
            showCancelButton: true,
            confirmButtonText: "OK",
            cancelButtonText: "Cancel",
            background: "#1c2d55",
            color: "#fff",
          }).then(() => {
            setShowModalAdd(false);
            window.location.reload();
          });
          
        } catch (err) {
            const error = err as AxiosError<{ message?: string }>;
          
            let errorMessage = `Erreur lors de l\'ajout d\'utilisateur.`;
          
            if (error.response) {
              // Si une réponse est retournée par le backend
              const status = error.response.status;
              const backendMessage = error.response.data?.message;
          
              // Si le backend renvoie un message clair, on l’affiche
              if (backendMessage) {
                errorMessage = backendMessage;
              } else if (status == 400) {
               
              }
              else if (status === 404) {
                errorMessage = "Catégorie introuvable.";
              } else if (status === 401) {
                errorMessage = "Non autorisé. Veuillez vous reconnecter.";
              } else if (status === 500) {
                errorMessage = "Erreur serveur. Réessayez plus tard.";
              }
              // Tu peux rajouter d'autres cas ici si besoin
            } else {
              // Pas de réponse du serveur (ex: problème de réseau)
            }
          
            await Swal.fire({
              icon: "error",
              title: "Erreur",
              text: errorMessage,
              confirmButtonColor: "#ef4444",
              background: "#1c2d55",
              color: "#fff",
            });
          }
          
      };
  
    return(
        <>
            <div className="fixed inset-0 bg-[#111C44] bg-opacity-50 flex items-start justify-center pt-2 z-50">
              <div className="bg-[#111C44] border border-red-500 rounded-lg p-8 w-11/12 max-w-md relative shadow-lg slide-down">
                <h2 className="text-xl font-bold mb-4 text-white">Créer une nouvelle catégorie</h2>
        
                <form onSubmit={handleSubmit} className="space-y-4">
                {Object.keys(formData).map((field) =>
                    <div key={field}>
                      <label className="block text-gray-400 mb-1">
                        {fieldLabels[field] || field}
                        {(field === "prenom") ? (
                            <sup></sup>
                      ) : (
                        <sup className="text-red-500">*</sup>
                        
                      )}
                      </label>
                    {field === "description" ? (
                        <textarea
                        name={field}
                        value={formData[field as keyof typeof formData]}
                        onChange={handleChange}
                        className="w-full p-2 rounded text-white bg-[#1c2d55] border-[#1c2d55] focus:outline-none focus:ring-0 focus:border-transparent"
                        required
                        rows={4}
                      />
                    ) : (
                        <input
                            type="text"
                            name={field}
                            value={formData[field as keyof typeof formData]}
                            onChange={handleChange}
                            className="w-full p-2 rounded bg-[#1c2d55] border-[#1c2d55] text-white focus:outline-none focus:ring-0 focus:border-transparent"
                            autoComplete="off"
                            required={field === "nom" || field === "email"}
                        />
                    )}
                    </div>
                )}


                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                      Enregistrer
                    </button>
                  </div>
                </form>
        
                <button
                  onClick={() => setShowModalAdd(false)}
                  className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 font-bold text-lg"
                  aria-label="Close modal"
                >
                  ×
                </button>
              </div>
            </div>
        </>
    )
}

export default AddCategorieDomaine;