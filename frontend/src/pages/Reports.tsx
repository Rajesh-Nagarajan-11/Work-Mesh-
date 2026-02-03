import React from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { BarChart3 } from 'lucide-react';
import { EmptyState } from '../components/ui/EmptyState';

export const Reports: React.FC = () => {
    return (
        <MainLayout>
            <div>
                <h1 className="text-3xl font-bold text-secondary-900 dark:text-white mb-6">Reports & Analytics</h1>
                <EmptyState
                    icon={<BarChart3 className="w-16 h-16" />}
                    title="Reports & Analytics"
                    description="This page will show KPIs, charts, and export options."
                />
            </div>
        </MainLayout>
    );
};
