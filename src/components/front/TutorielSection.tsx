import React from "react";

import TutorielData from "../../datas/TutorielData";

const TutorielSection = () => {
    return(
        <section className="py-16 bg-white" id="tutoriel">
            <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
                <p className="text-sm uppercase text-red-500 font-medium mb-2">Tutoriels</p>
                <h1 className="text-4xl font-bold text-[#111C44]">Apprenez à utiliser l'application étape par étape</h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 sm:px-6 lg:px-12 py-8">

                {TutorielData.map((tuto, index) => (
                    <div
                        key={index}
                        className={`tutoriel-card bg-gray-50 rounded-lg shadow-md pt-6 hover:shadow-xl transition flex flex-col justify-between ${tuto.delay}`}
                        >
                        <div className="px-6">
                            <div className="w-16 h-16 flex items-center justify-center icon-tuto border border-red-500 rounded-full mb-4 mx-auto">
                                <i className={`bi ${tuto.iconClass} text-red-500 text-3xl`}></i>
                            </div>
                            <h3 className="text-xl font-semibold text-center mb-2 text-black">{tuto.title}</h3>
                            <p className="text-gray-600 text-center text-black">{tuto.description}</p>
                        </div>

                        <div className="bg-red-500 tutoriel-footer py-3 mt-4 text-center text-white rounded-b-md">
                            <a href="#">Voir la vidéo</a>
                        </div>
                    </div>
                ))}
            </div>

            </div>
        </section>


    )
}

export default TutorielSection;