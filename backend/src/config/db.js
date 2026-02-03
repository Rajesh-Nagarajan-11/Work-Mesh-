const mongoose = require('mongoose');

async function connectDB(uri) {
  const mongoUri = uri || 'mongodb://localhost:27017/workmesh';

  mongoose.set('strictQuery', true);

  await mongoose.connect(mongoUri, {
    autoIndex: process.env.NODE_ENV !== 'production',
  });

  // eslint-disable-next-line no-console
  console.log('Connected to MongoDB');
}

module.exports = { connectDB };

