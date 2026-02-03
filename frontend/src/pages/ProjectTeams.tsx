import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Users2 } from 'lucide-react';
import { MainLayout } from '../components/layout/MainLayout';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { projectService } from '../services/projectService';
import type { Project } from '../types';

export const ProjectTeams: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState<Project | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!id) {
            setIsLoading(false);
            return;
        }
        projectService
            .getProject(id)
            .then(setProject)
            .catch(() => setProject(null))
            .finally(() => setIsLoading(false));
    }, [id]);

    if (isLoading) {
        return (
            <MainLayout>
                <div className="flex items-center justify-center h-64">
                    <LoadingSpinner size="lg" />
                </div>
            </MainLayout>
        );
    }

    if (!project) {
        return (
            <MainLayout>
                <EmptyState
                    icon={<Users2 className="w-16 h-16" />}
                    title="Project not found"
                    description="This project may have been deleted or the link is invalid."
                    action={{ label: 'Back to Projects', onClick: () => navigate('/projects') }}
                />
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between gap-4">
                    <Link
                        to={`/projects/${project.id}`}
                        className="inline-flex items-center gap-2 text-sm font-medium text-secondary-600 dark:text-secondary-300 hover:text-secondary-900 dark:hover:text-white"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Project
                    </Link>
                    <Button variant="secondary" onClick={() => navigate('/projects')}>
                        All Projects
                    </Button>
                </div>

                <div>
                    <h1 className="text-3xl font-bold text-secondary-900 dark:text-white">Teams</h1>
                    <p className="text-secondary-600 dark:text-secondary-400 mt-1">
                        Teams for <span className="font-semibold">{project.name}</span>
                    </p>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-lg border border-border dark:border-slate-700 p-6">
                    <EmptyState
                        icon={<Users2 className="w-16 h-16" />}
                        title="Team generation coming next"
                        description="This page will show recommended teams, match scores, and approvals."
                    />
                </div>
            </div>
        </MainLayout>
    );
};

