import React, { useState, useEffect } from 'react';
import { Users, Briefcase, CheckCircle, TrendingUp } from 'lucide-react';
import { MainLayout } from '../components/layout/MainLayout';
import { StatsCard } from '../components/dashboard/StatsCard';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { LineChart } from '../components/charts/LineChart';
import { BarChart } from '../components/charts/BarChart';
import { UpcomingDeadlines } from '../components/dashboard/UpcomingDeadlines';
import type { KPI } from '../types';

export const Dashboard: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [kpis, setKpis] = useState<KPI[]>([]);

    // Dummy data for charts
    const projectsOverTime = [
        { label: 'Jan', value: 12 },
        { label: 'Feb', value: 15 },
        { label: 'Mar', value: 13 },
        { label: 'Apr', value: 18 },
        { label: 'May', value: 22 },
        { label: 'Jun', value: 20 },
    ];

    const skillDemand = [
        { label: 'React', value: 45 },
        { label: 'Python', value: 38 },
        { label: 'Node.js', value: 32 },
        { label: 'AWS', value: 28 },
        { label: 'Docker', value: 25 },
        { label: 'TypeScript', value: 40 },
        { label: 'Java', value: 22 },
        { label: 'Go', value: 18 },
    ];

    const upcomingDeadlines = [
        {
            id: '1',
            projectName: 'Security Audit',
            dueDate: 'Feb 3, 2026',
            daysRemaining: 1,
            status: 'critical' as const,
        },
        {
            id: '2',
            projectName: 'API Integration',
            dueDate: 'Feb 4, 2026',
            daysRemaining: 2,
            status: 'critical' as const,
        },
        {
            id: '3',
            projectName: 'Mobile App Redesign',
            dueDate: 'Feb 5, 2026',
            daysRemaining: 3,
            status: 'warning' as const,
        },
        {
            id: '4',
            projectName: 'E-commerce Platform',
            dueDate: 'Feb 10, 2026',
            daysRemaining: 8,
            status: 'upcoming' as const,
        },
        {
            id: '5',
            projectName: 'Data Migration',
            dueDate: 'Feb 15, 2026',
            daysRemaining: 13,
            status: 'upcoming' as const,
        },
    ];

    // Simulated data fetch
    useEffect(() => {
        // In real app, this would call analyticsService.getAnalytics()
        setTimeout(() => {
            setKpis([
                {
                    label: 'Total Employees',
                    value: 247,
                    change: 12,
                    trend: 'up',
                    icon: 'Users',
                },
                {
                    label: 'Active Projects',
                    value: 18,
                    change: 5,
                    trend: 'up',
                    icon: 'Briefcase',
                },
                {
                    label: 'Teams Formed',
                    value: 42,
                    change: 8,
                    trend: 'up',
                    icon: 'CheckCircle',
                },
                {
                    label: 'Completion Rate',
                    value: 94.5,
                    change: 2.3,
                    trend: 'up',
                    icon: 'TrendingUp',
                },
            ]);
            setIsLoading(false);
        }, 1000);
    }, []);

    const iconMap = {
        Users,
        Briefcase,
        CheckCircle,
        TrendingUp,
    };

    const colorMap = {
        Users: 'bg-primary-100 text-primary-600',
        Briefcase: 'bg-warning-100 text-warning-600',
        CheckCircle: 'bg-success-100 text-success-600',
        TrendingUp: 'bg-secondary-100 text-secondary-600',
    };

    if (isLoading) {
        return (
            <MainLayout>
                <div className="flex items-center justify-center h-[calc(100vh-200px)]">
                    <LoadingSpinner size="lg" />
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="space-y-6">
                {/* Page Header */}
                <div>
                    <h1 className="text-3xl font-bold text-secondary-900 dark:text-white mb-2">Dashboard</h1>
                    <p className="text-secondary-600 dark:text-secondary-400">Welcome back! Here's your team formation overview.</p>
                </div>

                {/* Stats Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {kpis.map((kpi) => (
                        <StatsCard
                            key={kpi.label}
                            icon={iconMap[kpi.icon as keyof typeof iconMap]}
                            label={kpi.label}
                            value={kpi.value}
                            change={kpi.change}
                            trend={kpi.trend}
                            format={kpi.label === 'Completion Rate' ? 'percentage' : 'number'}
                            iconClassName={colorMap[kpi.icon as keyof typeof colorMap]}
                        />
                    ))}
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="card p-6">
                        <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">Projects Over Time</h3>
                        <div className="h-64">
                            <LineChart data={projectsOverTime} height={240} />
                        </div>
                    </div>

                    <div className="card p-6">
                        <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">Skill Demand</h3>
                        <div className="h-64">
                            <BarChart data={skillDemand} height={240} />
                        </div>
                    </div>
                </div>

                {/* Upcoming Deadlines */}
                <div className="card p-6">
                    <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">Upcoming Deadlines</h3>
                    <UpcomingDeadlines deadlines={upcomingDeadlines} />
                </div>
            </div>
        </MainLayout>
    );
};
