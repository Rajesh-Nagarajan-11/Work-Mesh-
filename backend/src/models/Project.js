const mongoose = require('mongoose');

const ProjectSkillSchema = new mongoose.Schema(
  {
    skillId: { type: String, required: true },
    skillName: { type: String, required: true },
    minimumExperience: { type: Number, default: 0 },
    priority: { type: String, enum: ['Must-have', 'Nice-to-have'], default: 'Must-have' },
    weight: { type: Number, default: 50, min: 0, max: 100 },
  },
  { _id: true }
);

const TeamPreferencesSchema = new mongoose.Schema(
  {
    teamSize: { type: Number, default: 5 },
    seniorityMix: {
      junior: { type: Number, default: 40 },
      mid: { type: Number, default: 40 },
      senior: { type: Number, default: 20 },
    },
  },
  { _id: false }
);

const ProjectSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    status: {
      type: String,
      enum: ['Draft', 'Active', 'Completed', 'Archived'],
      default: 'Draft',
    },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    deadline: { type: Date, required: true },
    duration: { type: Number, default: 1 }, // months
    progress: { type: Number, default: 0, min: 0, max: 100 },
    requiredSkills: { type: [ProjectSkillSchema], default: [] },
    teamPreferences: {
      type: TeamPreferencesSchema,
      default: () => ({ teamSize: 5, seniorityMix: { junior: 40, mid: 40, senior: 20 } }),
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', default: null },
    source: { type: String, enum: ['manual', 'client_form'], default: 'manual' },
  },
  { timestamps: true }
);

ProjectSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

ProjectSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toHexString();
    delete ret._id;
    delete ret.__v;
    ret.deadline = ret.deadline ? new Date(ret.deadline).toISOString() : null;
    ret.requiredSkills = (ret.requiredSkills || []).map((s) => ({
      ...s,
      id: s._id ? s._id.toString() : s.id || undefined,
      _id: undefined,
    }));
    ret.teamPreferences = ret.teamPreferences || { teamSize: 5, seniorityMix: { junior: 40, mid: 40, senior: 20 } };
    return ret;
  },
});

module.exports = mongoose.model('Project', ProjectSchema);
