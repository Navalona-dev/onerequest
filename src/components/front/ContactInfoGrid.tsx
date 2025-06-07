// ContactInfoGrid.tsx
import React from "react";

export const ContactInfoGrid: React.FC = () => {
  return (
    <div className="py-12">
      <div className="mx-auto max-w-screen-xl px-12">
        <div className="mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Phone */}
          <div className="flex flex-col items-center bg-gray-100 px-6 h-[65vh] py-12 rounded-lg text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white mb-4">
              <i className="bi bi-telephone-fill text-3xl text-red-500"></i>
            </div>
            <h4 className="mb-2 text-xl font-semibold">Numéro téléphone</h4>
            <p className="mb-1">+012 345 67890</p>
            <p className="mb-4">+012 345 67891</p>
            <a
              href="tel:+0123456789"
              className="inline-flex items-center rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
            >
              Appellez <i className="bi bi-arrow-right ms-2"></i>
            </a>
          </div>

          {/* Email */}
          <div className="flex flex-col items-center bg-gray-100 px-6 h-[65vh] py-12 rounded-lg text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white mb-4">
              <i className="bi bi-envelope-paper-fill text-3xl text-red-500"></i>
            </div>
            <h4 className="mb-2 text-xl font-semibold">Adresse e-mail</h4>
            <p className="mb-1">info@example.com</p>
            <p className="mb-4">support@example.com</p>
            <a
              href="mailto:info@example.com"
              className="inline-flex items-center rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
            >
              Envoyer mail <i className="bi bi-arrow-right ms-2"></i>
            </a>
          </div>

          {/* Office Address */}
          <div className="flex flex-col items-center bg-gray-100 px-6 h-[65vh] py-12 rounded-lg text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white mb-4">
              <i className="bi bi-geo-alt-fill text-3xl text-red-500"></i>
            </div>
            <h4 className="mb-2 text-xl font-semibold">Adresse officielle</h4>
            <p className="mb-1">123 Main Street</p>
            <p className="mb-4">Your City, Country</p>
            <a
              href="https://goo.gl/maps/FsznshxgnULBGgkN9"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
            >
              Direction <i className="bi bi-arrow-right ms-2"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
