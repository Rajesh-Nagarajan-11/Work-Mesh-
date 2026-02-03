require('dotenv').config();

const { createApp } = require('./app');
const { connectDB } = require('./config/db');

async function start() {
  const port = Number(process.env.PORT || 5000);

  await connectDB(process.env.MONGODB_URI);

  const app = createApp();
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Backend listening on http://localhost:${port}`);
  });
}

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start server:', err);
  process.exit(1);
});

