const PageBlock = () => {
    return(
        <div className="w-full py-12 bg-white page-block shadow-md animate-fade-in">
            <div className="container mx-auto">
            <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mx-6">
                {/* Cette div occupe 4 colonnes sur 5 */}
                <div className="md:col-span-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="page-block-card">
                    <p className="text-gray-700 font-medium">Traitement rapide des demandes</p>
                </div>
                <div className="page-block-card">
                    <p className="text-gray-700 font-medium">Suivi personnalisé à chaque étape</p>
                </div>
                <div className="page-block-card">
                    <p className="text-gray-700 font-medium">Équipe à l'écoute et disponible</p>
                </div>
                <div className="page-block-card">
                    <p className="text-gray-700 font-medium">Engagement qualité et fiabilité</p>
                </div>
                </div>

                {/* Si tu veux un bloc supplémentaire dans la 5e colonne */}
                <div className="hidden md:block md:col-span-1"></div>
            </div>
            </div>

            </div>
        </div>

    )
}

export default PageBlock;