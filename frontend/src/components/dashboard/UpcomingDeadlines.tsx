import React from 'react';
import { Calendar, Clock, AlertTriangle } from 'lucide-react';

interface Deadline {
    id: string;
    projectName: string;
    dueDate: string;
    daysRemaining: number;
    status: 'critical' | 'warning' | 'upcoming';
}

interface UpcomingDeadlinesProps {
    deadlines: Deadline[];
}

export const UpcomingDeadlines: React.FC<UpcomingDeadlinesProps> = ({ deadlines }) => {
    const getIcon = (status: Deadline['status']) => {
        switch (status) {
            case 'critical':
                return <AlertTriangle className="w-5 h-5 text-error-600" />;
            case 'warning':
                return <Clock className="w-5 h-5 text-warning-600" />;
            case 'upcoming':
                return <Calendar className="w-5 h-5 text-primary-600" />;
            default:
                return <Calendar className="w-5 h-5 text-secondary-600" />;
        }
    };

    const getTypeColor = (status: Deadline['status']) => {
        switch (status) {
            case 'critical':
                return 'bg-error-100 dark:bg-error-900/20';
            case 'warning':
                return 'bg-warning-100 dark:bg-warning-900/20';
            case 'upcoming':
                return 'bg-primary-100 dark:bg-primary-900/20';
            default:
                return 'bg-secondary-100 dark:bg-secondary-900/20';
        }
    };

    const getDaysRemainingText = (daysRemaining: number) => {
        if (daysRemaining === 0) return 'Due today';
        if (daysRemaining === 1) return '1 day left';
        if (daysRemaining < 0) return `${Math.abs(daysRemaining)} days overdue`;
        return `${daysRemaining} days left`;
    };

    if (deadlines.length === 0) {
        return (
            <div className="text-center py-8 text-secondary-500 dark:text-secondary-400">
                No upcoming deadlines
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {deadlines.map((deadline) => (
                <div
                    key={deadline.id}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-surface dark:hover:bg-slate-800/50 transition-colors"
                >
                    <div className={`p-2 rounded-full ${getTypeColor(deadline.status)}`}>
                        {getIcon(deadline.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm text-secondary-900 dark:text-white">
                            Project "{deadline.projectName}" {getDaysRemainingText(deadline.daysRemaining).toLowerCase()}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-secondary-500 dark:text-secondary-400 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {deadline.dueDate}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
