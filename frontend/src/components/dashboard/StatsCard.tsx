import React, { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { gsap } from 'gsap';

interface StatsCardProps {
    icon: LucideIcon;
    label: string;
    value: number;
    change: number;
    trend: 'up' | 'down' | 'neutral';
    format?: 'number' | 'percentage';
    iconClassName?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
    icon: Icon,
    label,
    value,
    change,
    trend,
    format = 'number',
    iconClassName = 'bg-primary-100 text-primary-600',
}) => {
    const valueRef = useRef<HTMLDivElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(cardRef, { once: true, amount: 0.3 });

    // Animate count-up when in view
    useEffect(() => {
        if (isInView && valueRef.current) {
            const target = value;
            const duration = 1.5;

            gsap.fromTo(
                valueRef.current,
                { textContent: 0 },
                {
                    textContent: target,
                    duration,
                    ease: 'power2.out',
                    snap: { textContent: format === 'number' ? 1 : 0.1 },
                    onUpdate: function () {
                        if (valueRef.current) {
                            const currentValue = parseFloat(valueRef.current.textContent || '0');
                            valueRef.current.textContent =
                                format === 'percentage'
                                    ? `${currentValue.toFixed(1)}%`
                                    : Math.round(currentValue).toLocaleString();
                        }
                    },
                }
            );
        }
    }, [isInView, value, format]);

    const getTrendColor = () => {
        if (trend === 'up') return 'text-success-600 bg-success-50';
        if (trend === 'down') return 'text-error-600 bg-error-50';
        return 'text-secondary-600 bg-secondary-50';
    };

    const getTrendIcon = () => {
        if (trend === 'up') return '↑';
        if (trend === 'down') return '↓';
        return '→';
    };

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="card card-hover p-6"
        >
            <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg ${iconClassName} dark:bg-opacity-20 flex items-center justify-center`}>
                    <Icon className="w-6 h-6" />
                </div>

                <div className={`px-2 py-1 rounded-md text-xs font-medium ${getTrendColor()} dark:bg-opacity-20`}>
                    <span className="mr-0.5">{getTrendIcon()}</span>
                    {Math.abs(change)}%
                </div>
            </div>

            <div ref={valueRef} className="text-3xl font-bold text-secondary-900 dark:text-white mb-1">
                {format === 'percentage' ? `${value}%` : value.toLocaleString()}
            </div>

            <div className="text-sm text-secondary-600 dark:text-secondary-400">{label}</div>
        </motion.div>
    );
};
