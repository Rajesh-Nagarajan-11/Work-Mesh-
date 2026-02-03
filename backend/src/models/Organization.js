const mongoose = require('mongoose');

const OrganizationSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    website: { type: String, default: null },
    companySize: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Organization', OrganizationSchema);
