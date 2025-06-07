// src/components/front/PageHeader.tsx
import React from "react";
import bgpageheader from "../../assets/images/hero-bg-5.png";

const PageHeader: React.FC<{ title: string; breadcrumbs: string[] }> = ({
  title,
  breadcrumbs,
}) => {
  return (
    <div
  className={`
    w-full
    bg-cover
    bg-center
    mb-5
    relative
    p-0
    page-header
  `}
  style={{ backgroundImage: `url(${bgpageheader})` }}
>
  {/* Overlay noir semi-transparent */}
  <div className="absolute inset-0 bg-black bg-opacity-60" />

  {/* Contenu centré verticalement */}
  <div className="relative py-16">
    <div className="container mx-auto text-center">
      <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 animate-slide-in-down">
        {title}
      </h1>
      <nav aria-label="breadcrumb">
        <ol className="flex justify-center space-x-2 text-white text-sm uppercase">
          {breadcrumbs.map((crumb, idx) => (
            <li key={idx} className="flex items-center">
              {idx > 0 && <span className="mx-2">/</span>}
              {idx < breadcrumbs.length - 1 ? (
                <a href="#" className="hover:underline">
                  {crumb}
                </a>
              ) : (
                <span className="font-semibold">{crumb}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  </div>
</div>

  );
};

export default PageHeader;
