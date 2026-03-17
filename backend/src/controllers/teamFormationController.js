/**
 * controllers/teamFormationController.js
 *
 * Proxies to the Python ML FastAPI service for team recommendations.
 * Enriches the request with org context from JWT, then forwards to
 * GET /team/recommend/{project_id}?organization_id=...
 */

const http = require('http');
const { ok, fail } = require('../utils/apiResponse');

const ML_HOST = process.env.ML_SERVICE_HOST || 'localhost';
const ML_PORT = parseInt(process.env.ML_SERVICE_PORT || '8000', 10);

/**
 * Simple wrapper to make an HTTP GET and return parsed JSON.
 */
function httpGet(url) {
    return new Promise((resolve, reject) => {
        http.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, body: JSON.parse(data) });
                } catch (e) {
                    reject(new Error('Invalid JSON from ML service'));
                }
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
}

/**
 * GET /api/projects/:id/recommend-team
 * Query params:
 *   exclude_unavailable  (optional, default false)
 */
async function recommendTeam(req, res) {
    const projectId = req.params.id;
    const orgId = req.user?.organizationId;          // set by authenticate middleware
    const excludeUnavailable = req.query.exclude_unavailable === 'true';

    if (!orgId) {
        return fail(res, 401, 'Organization context missing from token');
    }

    const mlUrl = `http://${ML_HOST}:${ML_PORT}/team/recommend/${projectId}?organization_id=${orgId}&exclude_unavailable=${excludeUnavailable}`;

    try {
        const { status, body } = await httpGet(mlUrl);

        if (status === 404) {
            return fail(res, 404, body.detail || 'Project not found in ML service');
        }
        if (status !== 200) {
            return fail(res, 502, `ML service error (${status})`);
        }

        const sanitizeCandidate = (candidate) => {
            if (!candidate || typeof candidate !== 'object') return candidate;
            const { final_score, match_percentage, score_breakdown, ...rest } = candidate;
            return rest;
        };

        const recommendedTeam = Array.isArray(body.recommended_team)
            ? body.recommended_team.map(sanitizeCandidate)
            : [];

        const allCandidates = Array.isArray(body.all_candidates)
            ? body.all_candidates.map(sanitizeCandidate)
            : [];

        const totalSkillsRequired = Number(body.total_skills_required || 0);
        const totalSkillsCovered = Number(body.total_skills_covered || 0);
        const coverageScore = totalSkillsRequired > 0
            ? (totalSkillsCovered / totalSkillsRequired) * 100
            : 100;
        const seniorityBalance = Number(recommendedTeam[0]?.team_seniority_balance || 0);
        const fallbackTeamSuitability = Math.round(((coverageScore * 0.85) + (seniorityBalance * 0.15)) * 10) / 10;

        const normalizedBody = {
            ...body,
            recommended_team: recommendedTeam,
            all_candidates: allCandidates,
            team_suitability_score: Number(body.team_suitability_score ?? fallbackTeamSuitability),
        };

        return ok(res, normalizedBody, 'Team recommendation ready');
    } catch (err) {
        console.error('[teamFormationController] ML service unreachable:', err.message);
        return fail(
            res,
            503,
            'ML service is not available. Make sure the Python FastAPI server is running on port 8000.'
        );
    }
}

module.exports = { recommendTeam };
