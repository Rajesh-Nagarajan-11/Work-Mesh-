const Project = require('../models/Project');
const { ok, fail } = require('../utils/apiResponse');

async function getAll(req, res) {
  const { organizationId } = req.user;
  const projects = await Project.find({ organizationId }).sort({ createdAt: -1 });
  return ok(res, projects, 'Projects fetched');
}

async function getById(req, res) {
  const { organizationId } = req.user;
  const { id } = req.params;
  const project = await Project.findOne({ _id: id, organizationId });
  if (!project) return fail(res, 404, 'Project not found');
  return ok(res, project, 'Project fetched');
}

async function create(req, res) {
  const { organizationId, id: userId } = req.user;
  const {
    name,
    description,
    status,
    priority,
    deadline,
    duration,
    progress,
    requiredSkills,
    teamPreferences,
    source,
  } = req.body || {};

  if (!name || !deadline) {
    return fail(res, 400, 'name and deadline are required');
  }

  const deadlineDate = new Date(deadline);
  if (Number.isNaN(deadlineDate.getTime())) {
    return fail(res, 400, 'Invalid deadline date');
  }

  const project = await Project.create({
    organizationId,
    name: String(name).trim(),
    description: description ? String(description).trim() : '',
    status: status || 'Draft',
    priority: priority || 'Medium',
    deadline: deadlineDate,
    duration: duration || 1,
    progress: progress ?? 0,
    requiredSkills: requiredSkills || [],
    teamPreferences: teamPreferences || { teamSize: 5, seniorityMix: { junior: 40, mid: 40, senior: 20 } },
    createdBy: userId,
    source: source || 'manual',
  });

  return ok(res, project, 'Project created');
}

async function update(req, res) {
  const { organizationId } = req.user;
  const { id } = req.params;
  const updates = req.body || {};

  const project = await Project.findOne({ _id: id, organizationId });
  if (!project) return fail(res, 404, 'Project not found');

  delete updates.organizationId;
  delete updates._id;
  delete updates.id;

  if (updates.deadline) {
    const d = new Date(updates.deadline);
    updates.deadline = Number.isNaN(d.getTime()) ? project.deadline : d;
  }

  Object.assign(project, updates);
  await project.save();
  return ok(res, project, 'Project updated');
}

async function remove(req, res) {
  const { organizationId } = req.user;
  const { id } = req.params;
  const project = await Project.findOneAndDelete({ _id: id, organizationId });
  if (!project) return fail(res, 404, 'Project not found');
  return ok(res, { deleted: true }, 'Project deleted');
}

module.exports = { getAll, getById, create, update, remove };
