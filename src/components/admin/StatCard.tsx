import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface StatCardProps {
    title: string;
    total: string;
    percentage: number;
    color: string
  }

  const StatCard: React.FC<StatCardProps> = ({ title, total, percentage, color }) => {
    return (
        <div className="rounded-xl p-5 w-full md:w-56 admin-content stat-card-content">

            <div className="flex justify-between items-center">
                <div>
                    <p className="text-sm text-gray-400 mb-3">{title}</p>
                    <h3 className="text-2xl font-bold text-white">{total}</h3>
                </div>
                <div className="w-12 h-12">
                    <CircularProgressbar
                        value={percentage}
                        text={`${percentage}%`}
                        styles={buildStyles({
                            pathColor: color,
                            textColor: '#fff',
                            trailColor: '#2d2d2d',
                        })}
                    />
                </div>
            </div>
        </div>
    );
};

export default StatCard;
