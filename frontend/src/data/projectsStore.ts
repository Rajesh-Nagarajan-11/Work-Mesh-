import type { Project } from '../types';

export const PROJECTS_STORAGE_KEY = 'workmesh_projects';

export const DEFAULT_PROJECTS: Project[] = [
    {
        id: 'p1',
        name: 'Work Mesh v1',
        description: 'Build the MVP for AI-assisted team formation and staffing insights.',
        duration: 4,
        priority: 'High',
        deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 25).toISOString(),
        status: 'Active',
        progress: 62,
        requiredSkills: [
            { id: 'rs1', skillId: 'react', skillName: 'React', minimumExperience: 1, priority: 'Must-have', weight: 40 },
            { id: 'rs2', skillId: 'ts', skillName: 'TypeScript', minimumExperience: 1, priority: 'Must-have', weight: 40 },
            { id: 'rs3', skillId: 'ui', skillName: 'UI/UX', minimumExperience: 1, priority: 'Nice-to-have', weight: 20 },
        ],
        teamPreferences: {
            teamSize: 6,
            seniorityMix: { junior: 40, mid: 40, senior: 20 },
        },
        createdBy: 'admin',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 'p2',
        name: 'Skill Taxonomy Cleanup',
        description: 'Normalize skill tags and consolidate duplicates across departments.',
        duration: 2,
        priority: 'Medium',
        deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45).toISOString(),
        status: 'Draft',
        progress: 10,
        requiredSkills: [
            { id: 'rs4', skillId: 'data', skillName: 'Data Modeling', minimumExperience: 2, priority: 'Must-have', weight: 60 },
            { id: 'rs5', skillId: 'pm', skillName: 'Project Mgmt', minimumExperience: 2, priority: 'Nice-to-have', weight: 40 },
        ],
        teamPreferences: {
            teamSize: 3,
            seniorityMix: { junior: 20, mid: 60, senior: 20 },
        },
        createdBy: 'manager',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    },
    {
        id: 'p3',
        name: 'Onboarding Portal',
        description: 'Create a lightweight onboarding portal and documentation hub.',
        duration: 3,
        priority: 'Low',
        deadline: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
        status: 'Completed',
        progress: 100,
        requiredSkills: [
            { id: 'rs6', skillId: 'content', skillName: 'Technical Writing', minimumExperience: 1, priority: 'Must-have', weight: 50 },
            { id: 'rs7', skillId: 'web', skillName: 'Web', minimumExperience: 1, priority: 'Nice-to-have', weight: 50 },
        ],
        teamPreferences: {
            teamSize: 4,
            seniorityMix: { junior: 30, mid: 50, senior: 20 },
        },
        createdBy: 'admin',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 50).toISOString(),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    },
];

export function loadProjects(): Project[] {
    try {
        const raw = localStorage.getItem(PROJECTS_STORAGE_KEY);
        if (!raw) return DEFAULT_PROJECTS;
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return DEFAULT_PROJECTS;
        return parsed as Project[];
    } catch {
        return DEFAULT_PROJECTS;
    }
}

export function saveProjects(projects: Project[]) {
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
}

