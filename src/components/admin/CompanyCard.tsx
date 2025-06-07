interface CompanyCardProps {
    name: string;
    location: string;
    icons: React.ReactNode[];
    iconUnique: React.ReactNode;
  }

  const CompanyCard: React.FC<CompanyCardProps> = ({ name, location, icons, iconUnique }) => {
    return (
        <div className="flex items-center justify-between p-4 mb-2 company-card">
            <div>
                <h4 className="text-md font-bold text-gray-400"> {iconUnique} {name}</h4>
            </div>
            <div className="flex">
                <p className="text-sm text-gray-500"><i className="mr-2 bi bi-geo-alt-fill"></i>{location}</p>
            </div>
            <div className="flex gap-2">
                {icons.map((icon, i) => (
                    <a key={i} href="#" className="text-blue-400 hover:text-white">{icon}</a>
                ))}
            </div>
        </div>
    );
};

export default CompanyCard
