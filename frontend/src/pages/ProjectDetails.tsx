import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Briefcase, Calendar, Edit, Flag, Users } from 'lucide-react';
import { MainLayout } from '../components/layout/MainLayout';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { projectService } from '../services/projectService';
import type { Project } from '../types';

const formatDate = (iso: string) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return new Intl.DateTimeFormat(undefined, { year: 'numeric', month: 'short', day: '2-digit' }).format(d);
};

export const ProjectDetails: React.FC = () => {
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
                    icon={<Briefcase className="w-16 h-16" />}
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
                    <div className="flex items-center gap-3">
                        <Link
                            to="/projects"
                            className="inline-flex items-center gap-2 text-sm font-medium text-secondary-600 dark:text-secondary-300 hover:text-secondary-900 dark:hover:text-white"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </Link>
                    </div>
                    <div className="flex items-center gap-2">
                        {(project.status === 'Draft' || project.status === 'Active') && (
                            <Button variant="secondary" onClick={() => navigate('/projects', { state: { editProjectId: project.id } })} leftIcon={<Edit className="w-4 h-4" />}>
                                Edit
                            </Button>
                        )}
                        <Button variant="secondary" onClick={() => navigate(`/projects/${project.id}/teams`)}>
                            View Teams
                        </Button>
                    </div>
                </div>

                <div>
                    <h1 className="text-3xl font-bold text-secondary-900 dark:text-white">{project.name}</h1>
                    <p className="text-secondary-600 dark:text-secondary-400 mt-2">{project.description}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-slate-800 rounded-lg border border-border dark:border-slate-700 p-5">
                        <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400">STATUS</p>
                        <div className="mt-2 flex items-center justify-between">
                            <p className="text-lg font-semibold text-secondary-900 dark:text-white">{project.status}</p>
                            <Flag className="w-5 h-5 text-secondary-500" />
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-lg border border-border dark:border-slate-700 p-5">
                        <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400">DEADLINE</p>
                        <div className="mt-2 flex items-center justify-between">
                            <p className="text-lg font-semibold text-secondary-900 dark:text-white">{formatDate(project.deadline)}</p>
                            <Calendar className="w-5 h-5 text-secondary-500" />
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-lg border border-border dark:border-slate-700 p-5">
                        <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400">TEAM SIZE</p>
                        <div className="mt-2 flex items-center justify-between">
                            <p className="text-lg font-semibold text-secondary-900 dark:text-white">{project.teamPreferences.teamSize}</p>
                            <Users className="w-5 h-5 text-secondary-500" />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-lg border border-border dark:border-slate-700 p-6">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">Progress</h2>
                        <span className="text-sm text-secondary-600 dark:text-secondary-400">
                            {typeof project.progress === 'number' ? project.progress : 0}%
                        </span>
                    </div>
                    <div className="w-full h-2 bg-secondary-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary"
                            style={{ width: `${typeof project.progress === 'number' ? project.progress : 0}%` }}
                        />
                    </div>
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-secondary-600 dark:text-secondary-400">
                        <div className="flex items-center gap-2">
                            <Briefcase className="w-4 h-4" />
                            Duration: {project.duration} months
                        </div>
                        <div>Priority: {project.priority}</div>
                        <div>Created by: {typeof project.createdBy === 'string' ? project.createdBy : '—'}</div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-lg border border-border dark:border-slate-700 p-6">
                    <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">Required skills</h2>
                    {project.requiredSkills.length === 0 ? (
                        <p className="mt-2 text-sm text-secondary-600 dark:text-secondary-400">No skills specified.</p>
                    ) : (
                        <div className="mt-3 flex flex-wrap gap-2">
                            {project.requiredSkills.map((s, idx) => (
                                <div
                                    key={s.id || idx}
                                    className="px-3 py-1 rounded-md bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-300 text-sm font-medium"
                                >
                                    {s.skillName} • {s.minimumExperience}y • {s.priority} • {s.weight}%
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
};

