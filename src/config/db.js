const mongoose = require('mongoose');
const env = require('./env');

let mongoServer = null;

const connectDB = async () => {
  try {
    if (env.USE_MEMORY_DB) {
      console.log('⚡ USE_MEMORY_DB is true. Launching In-Memory MongoDB Server...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoServer = await MongoMemoryServer.create();
      const memoryUri = mongoServer.getUri();
      await mongoose.connect(memoryUri);
      console.log(`✅ Connected to In-Memory MongoDB at ${memoryUri}`);
      return;
    }

    // Try standard MongoDB URI
    console.log(`📡 Connecting to MongoDB at ${env.MONGO_URI}...`);
    await mongoose.connect(env.MONGO_URI, {
      serverSelectionTimeoutMS: 4000 // fail fast if local mongo server is down
    });
    console.log(`✅ MongoDB Connected Successfully to: ${mongoose.connection.host}`);
  } catch (error) {
    console.warn(`⚠️ Primary MongoDB connection failed (${error.message}). Switching to In-Memory MongoDB fallback...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoServer = await MongoMemoryServer.create();
      const memoryUri = mongoServer.getUri();
      await mongoose.connect(memoryUri);
      console.log(`✅ Connected to Fallback In-Memory MongoDB at ${memoryUri}`);
    } catch (fallbackErr) {
      console.error('❌ Failed to connect to MongoDB and Fallback DB:', fallbackErr.message);
      process.exit(1);
    }
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
};

module.exports = { connectDB, disconnectDB };
