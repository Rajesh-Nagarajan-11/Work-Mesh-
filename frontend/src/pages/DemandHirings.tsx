import React, { useEffect, useState } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { useAuth } from '../hooks/useAuth';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { EmptyState } from '../components/ui/EmptyState';
import { AlertCircle, Activity, ShieldAlert, Sparkles } from 'lucide-react';

interface MissingSkill {
    skill_id: string;
    skill_name: string;
    demand_project_count: number;
    supply_employee_count: number;
    gap_score: number;
    affected_projects: string[];
}

interface ProjectAtRisk {
    project_name: string;
    critical_missing_skills: string[];
}

interface RecommendedHire {
    role_title: string;
    target_project: string;
    required_skills: string[];
    why: string;
}

interface DemandData {
    top_missing_skills: MissingSkill[];
    projects_at_risk: ProjectAtRisk[];
    recommended_hires: RecommendedHire[];
}

export const DemandHirings: React.FC = () => {
    const { user } = useAuth();
    const [data, setData] = useState<DemandData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchDemand = async () => {
        if (!user?.organizationId) return;
        setIsRefreshing(true);
        try {
            const response = await fetch(`http://localhost:8000/demand/${user.organizationId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch demand data');
            }
            const result = await response.json();
            setData(result);
            setLastUpdated(new Date());
            setError(null);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchDemand();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.organizationId]);

    if (isLoading) {
        return (
            <MainLayout>
                <div className="flex items-center justify-center h-64">
                    <LoadingSpinner size="lg" />
                </div>
            </MainLayout>
        );
    }

    if (error || !data) {
        return (
            <MainLayout>
                <EmptyState
                    icon={<AlertCircle className="w-12 h-12 text-error-500" />}
                    title="Could not load hiring demand"
                    description={error || "An unknown error occurred."}
                />
            </MainLayout>
        );
    }

    const criticalSkillGaps = data.top_missing_skills.filter(
        (skill) => skill.supply_employee_count < skill.demand_project_count
    ).length;

    const workforceDemandIntensity = data.top_missing_skills.reduce(
        (acc, skill) => acc + Math.max(skill.demand_project_count - skill.supply_employee_count, 0),
        0
    );

    const skillStatus = (skill: MissingSkill): 'Critical' | 'Limited' | 'Covered' => {
        if (skill.supply_employee_count === 0) return 'Critical';
        if (skill.supply_employee_count < skill.demand_project_count) return 'Limited';
        return 'Covered';
    };

    const statusClasses: Record<'Critical' | 'Limited' | 'Covered', string> = {
        Critical: 'bg-error-50 text-error-700 border-error-200 dark:bg-error-900/20 dark:text-error-300 dark:border-error-800/50',
        Limited: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800/50',
        Covered: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800/50',
    };

    return (
        <MainLayout>
            <div className="space-y-6">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-secondary-900 dark:text-white">Skill Gaps & Hiring Insights</h1>
                        <p className="text-secondary-600 dark:text-secondary-400 mt-1">
                            Analytics on workforce skill gaps, projects at risk, and recommended hiring priorities.
                        </p>
                        {lastUpdated && (
                            <p className="text-xs text-secondary-500 dark:text-secondary-500 mt-1">
                                Last updated: {lastUpdated.toLocaleString()}
                            </p>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={fetchDemand}
                        disabled={isRefreshing}
                        className="px-3 py-2 text-xs font-medium rounded-md border border-border text-secondary-700 dark:text-secondary-200 hover:bg-secondary-50 dark:hover:bg-slate-800 disabled:opacity-60"
                    >
                        {isRefreshing ? 'Refreshing…' : 'Refresh analysis'}
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    <div className="card p-6 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border-primary-200 dark:border-primary-800">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-primary-700 dark:text-primary-300">Critical Skill Gaps</p>
                                <h3 className="mt-2 text-3xl font-bold text-primary-800 dark:text-primary-200">{criticalSkillGaps}</h3>
                                <p className="mt-1 text-sm text-primary-700 dark:text-primary-300">Skills requiring immediate staffing attention</p>
                            </div>
                            <div className="shrink-0 p-2 rounded-lg bg-white/70 dark:bg-slate-900/40 border border-primary-200/80 dark:border-primary-700/60">
                                <ShieldAlert className="w-5 h-5 text-primary-700 dark:text-primary-300" />
                            </div>
                        </div>
                    </div>

                    <div className="card p-6 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200 dark:border-amber-800">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">Projects At Risk</p>
                                <h3 className="mt-2 text-3xl font-bold text-amber-800 dark:text-amber-200">{data.projects_at_risk.length}</h3>
                                <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">Projects impacted by unresolved capability gaps</p>
                            </div>
                            <div className="shrink-0 p-2 rounded-lg bg-white/70 dark:bg-slate-900/40 border border-amber-200/80 dark:border-amber-700/60">
                                <Activity className="w-5 h-5 text-amber-700 dark:text-amber-300" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="card p-6">
                        <h3 className="text-lg font-bold text-secondary-900 dark:text-white mb-1">Top skill gaps</h3>
                        <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-4">
                            Priority skills with constrained internal coverage.
                        </p>

                        {data.top_missing_skills.length === 0 ? (
                            <p className="text-sm text-secondary-500">No critical skill gaps found.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-left text-xs text-secondary-500 dark:text-secondary-400 border-b border-border dark:border-slate-700">
                                            <th className="py-2 pr-3 font-semibold">Skill</th>
                                            <th className="py-2 pr-3 font-semibold">Status</th>
                                            <th className="py-2 font-semibold">Key projects</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.top_missing_skills
                                            .filter((s) => {
                                                const status = skillStatus(s);
                                                return status === 'Critical' || status === 'Limited';
                                            })
                                            .slice(0, 10)
                                            .map((s) => (
                                                <tr key={s.skill_id} className="border-b border-border/60 dark:border-slate-700/60">
                                                    <td className="py-2 pr-3 font-medium text-secondary-900 dark:text-white whitespace-nowrap">
                                                        {s.skill_name}
                                                    </td>
                                                    <td className="py-2 pr-3">
                                                        <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full border ${statusClasses[skillStatus(s)]}`}> 
                                                            {skillStatus(s)}
                                                        </span>
                                                    </td>
                                                    <td className="py-2 text-secondary-700 dark:text-secondary-300">
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {s.affected_projects.slice(0, 2).map((project) => (
                                                                <span
                                                                    key={project}
                                                                    className="inline-flex items-center text-xs px-2 py-0.5 rounded-md bg-secondary-100 text-secondary-700 dark:bg-slate-700 dark:text-secondary-200"
                                                                >
                                                                    {project}
                                                                </span>
                                                            ))}
                                                            {s.affected_projects.length === 0 && (
                                                                <span className="text-xs text-secondary-500 dark:text-secondary-400">Not mapped</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    <div className="card p-6">
                        <h3 className="text-lg font-bold text-secondary-900 dark:text-white mb-1">Projects at risk</h3>
                        <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-4">
                            Active projects requiring immediate staffing action.
                        </p>

                        {data.projects_at_risk.length === 0 ? (
                            <p className="text-sm text-secondary-500">No projects at risk.</p>
                        ) : (
                            <div className="space-y-3">
                                {data.projects_at_risk.slice(0, 10).map((p) => (
                                    <div
                                        key={p.project_name}
                                        className="flex items-center justify-between gap-3 p-3 rounded-lg border border-border dark:border-slate-700 bg-white dark:bg-slate-800"
                                    >
                                        <div className="min-w-0">
                                            <p className="font-semibold text-secondary-900 dark:text-white truncate">
                                                {p.project_name}
                                            </p>
                                            <div className="mt-1.5 flex flex-wrap gap-1.5">
                                                {p.critical_missing_skills.slice(0, 3).map((skill) => (
                                                    <span
                                                        key={skill}
                                                        className="inline-flex items-center text-xs px-2 py-0.5 rounded-md bg-secondary-100 text-secondary-700 dark:bg-slate-700 dark:text-secondary-200"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                                {p.critical_missing_skills.length === 0 && (
                                                    <span className="text-xs text-secondary-500 dark:text-secondary-400">Skill details pending</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800/50">
                                            At risk
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};
