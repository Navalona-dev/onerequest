// ContactMapAndForm.tsx
import React from "react";

export const ContactForm: React.FC = () => {
  return (
    <div className="mx-auto max-w-screen-xl px-12">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Texte + Infos */}
        <div className="space-y-4">
          <p className="text-sm font-medium uppercase text-red-500">Contactez-nous</p>
          <h2 className="text-3xl font-semibold text-[#111C44] mb-12">Vous avez une question, une demande ou besoin d’assistance ?</h2>
          <p className="text-gray-600 mb-12">
          Notre équipe est à votre écoute pour vous apporter une réponse rapide et personnalisée. N’hésitez pas à remplir le formulaire ci-dessous ou à nous écrire directement — nous vous répondrons dans les plus brefs délais.
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Info 1 */}
            <div className="flex items-start space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500 text-white">
                <i className="bi bi-telephone-fill text-2xl"></i>
              </div>
              <div>
                <h6 className="font-semibold">Téléphone</h6>
                <span>+012 345 67890</span>
              </div>
            </div>

            {/* Info 2 */}
            <div className="flex items-start space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500 text-white">
                <i className="bi bi-envelope-fill text-2xl"></i>
              </div>
              <div>
                <h6 className="font-semibold">Adresse e-mail</h6>
                <span>info@example.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Formulaire */}
        <div>
          <form className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="name" className="sr-only">
                  Votre nom
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full rounded border border-gray-300 px-3 py-2 placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                  placeholder="Votre nom"
                />
              </div>
              <div>
                <label htmlFor="email" className="sr-only">
                  Adresse e-mail
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full rounded border border-gray-300 px-3 py-2 placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                  placeholder="Adresse e-mail"
                />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="sr-only">
                Objet
              </label>
              <input
                type="text"
                id="subject"
                className="w-full rounded border border-gray-300 px-3 py-2 placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                placeholder="Objet"
              />
            </div>

            <div>
              <label htmlFor="message" className="sr-only">
                Message
              </label>
              <textarea
                id="message"
                rows={5}
                className="w-full rounded border border-gray-300 px-3 py-2 placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                placeholder="Saisissez ici votre message"
              ></textarea>
            </div>

            <div>
              <button
                type="submit"
                className="inline-flex items-center rounded bg-red-500 px-5 py-2 text-white hover:bg-red-600"
              >
                Envoyer Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
