import React from 'react';
import { Button } from './Button';

interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    icon,
    title,
    description,
    action,
    className = '',
}) => {
    return (
        <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
            {icon && <div className="text-secondary-400 dark:text-secondary-500 mb-4">{icon}</div>}

            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">{title}</h3>

            {description && <p className="text-secondary-600 dark:text-secondary-400 mb-6 max-w-md">{description}</p>}

            {action && (
                <Button variant="primary" onClick={action.onClick}>
                    {action.label}
                </Button>
            )}
        </div>
    );
};
