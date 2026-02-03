import type { Team } from '../types';
import { api } from '../lib/axios';

export const teamService = {
    async approveTeam(teamId: string, comments?: string): Promise<Team> {
        const response = await api.post<Team>('/teams/approve', { teamId, comments });
        return response.data;
    },

    async rejectTeam(teamId: string, reason: string): Promise<void> {
        await api.post('/teams/reject', { teamId, reason });
    },

    async modifyTeam(teamId: string, members: string[]): Promise<Team> {
        const response = await api.put<Team>(`/teams/${teamId}`, { members });
        return response.data;
    },

    async getTeam(teamId: string): Promise<Team> {
        const response = await api.get<Team>(`/teams/${teamId}`);
        return response.data;
    },
};
