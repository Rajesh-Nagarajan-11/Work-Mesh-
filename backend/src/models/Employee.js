const mongoose = require('mongoose');

const EmployeeSkillSchema = new mongoose.Schema(
  {
    skillId: { type: String, required: true },
    skillName: { type: String, required: true },
    yearsOfExperience: { type: Number, default: 0 },
    proficiencyLevel: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      default: 'Beginner',
    },
  },
  { _id: false }
);

const EmployeeAvailabilitySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ['Available', 'Partially Available', 'Unavailable'],
      default: 'Available',
    },
    currentProject: { type: String, default: null },
    currentWorkload: { type: Number, default: 0, min: 0, max: 100 },
    availableFrom: { type: Date, default: null },
  },
  { _id: false }
);

const EmployeeSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    phone: { type: String, default: null },
    department: { type: String, default: 'General' },
    role: { type: String, default: 'Employee' }, // Job title/role
    
    // Access control role (for login permissions)
    accessRole: {
      type: String,
      enum: ['Admin', 'Manager', 'Employee'],
      default: 'Employee',
    },
    
    // Password hash - only set for employees who can login
    passwordHash: { type: String, default: null },
    
    skills: { type: [EmployeeSkillSchema], default: [] },
    availability: {
      type: EmployeeAvailabilitySchema,
      default: () => ({
        status: 'Available',
        currentProject: null,
        currentWorkload: 0,
        availableFrom: null,
      }),
    },
    experience: { type: Number, default: 0 }, // Years of experience
    pastProjectScore: { type: Number, default: null, min: 0, max: 100 },
    photoUrl: { type: String, default: null },
  },
  { timestamps: true }
);

// Compound unique index: email must be unique within an organization
EmployeeSchema.index({ organizationId: 1, email: 1 }, { unique: true });

// Virtual for id (to match frontend expectation)
EmployeeSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Ensure virtuals are included in JSON
EmployeeSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    delete ret.passwordHash; // Never expose password hash
    return ret;
  },
});

module.exports = mongoose.model('Employee', EmployeeSchema);
