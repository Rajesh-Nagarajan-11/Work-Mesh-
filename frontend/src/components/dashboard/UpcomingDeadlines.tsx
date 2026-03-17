import React from "react";
import { Calendar, Clock, AlertTriangle, Building2 } from "lucide-react";
import type { UpcomingDeadline } from "../../services/analyticsService";

interface UpcomingDeadlinesProps {
  deadlines: UpcomingDeadline[];
}

export const UpcomingDeadlines: React.FC<UpcomingDeadlinesProps> = ({
  deadlines,
}) => {
  const getIcon = (status: UpcomingDeadline["status"]) => {
    switch (status) {
      case "critical":
        return <AlertTriangle className="w-5 h-5 text-error-600" />;
      case "warning":
        return <Clock className="w-5 h-5 text-warning-600" />;
      case "upcoming":
        return <Calendar className="w-5 h-5 text-primary-600" />;
      default:
        return <Calendar className="w-5 h-5 text-secondary-600" />;
    }
  };

  const getIconBg = (status: UpcomingDeadline["status"]) => {
    switch (status) {
      case "critical":
        return "bg-error-100 dark:bg-error-900/20";
      case "warning":
        return "bg-warning-100 dark:bg-warning-900/20";
      case "upcoming":
        return "bg-primary-100 dark:bg-primary-900/20";
      default:
        return "bg-secondary-100 dark:bg-secondary-900/20";
    }
  };

  const getStatusBadge = (status: UpcomingDeadline["status"]) => {
    switch (status) {
      case "critical":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-400">
            Critical
          </span>
        );
      case "warning":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400">
            Due Soon
          </span>
        );
      case "upcoming":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
            Upcoming
          </span>
        );
      default:
        return null;
    }
  };

  const getDaysRemainingText = (daysRemaining: number) => {
    if (daysRemaining === 0) return "Due today";
    if (daysRemaining === 1) return "1 day left";
    if (daysRemaining < 0) return `${Math.abs(daysRemaining)} days overdue`;
    return `${daysRemaining} days left`;
  };

  if (deadlines.length === 0) {
    return (
      <div className="text-center py-8 text-secondary-500 dark:text-secondary-400">
        No upcoming deadlines in the next 30 days.
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
          <div
            className={`p-2 rounded-full flex-shrink-0 ${getIconBg(deadline.status)}`}
          >
            {getIcon(deadline.status)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-medium text-secondary-900 dark:text-white truncate">
                {deadline.projectName}
              </p>
              {getStatusBadge(deadline.status)}
            </div>
            <div className="flex items-center gap-3 mt-1 flex-wrap">
              {deadline.clientName && (
                <span className="text-xs text-secondary-500 dark:text-secondary-400 flex items-center gap-1">
                  <Building2 className="w-3 h-3" />
                  {deadline.clientName}
                </span>
              )}
              <span className="text-xs text-secondary-500 dark:text-secondary-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {deadline.dueDate}
              </span>
              <span
                className={`text-xs font-medium ${
                  deadline.status === "critical"
                    ? "text-error-600 dark:text-error-400"
                    : deadline.status === "warning"
                      ? "text-warning-600 dark:text-warning-400"
                      : "text-primary-600 dark:text-primary-400"
                }`}
              >
                {getDaysRemainingText(deadline.daysRemaining)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
