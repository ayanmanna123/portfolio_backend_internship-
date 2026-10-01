const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const env = require('./config/env');
const { connectDB } = require('./config/db');
const { seedInitialData } = require('./utils/seed');
const { errorHandler, AppError } = require('./middleware/errorHandler');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const aboutRoutes = require('./routes/aboutRoutes');
const skillRoutes = require('./routes/skillRoutes');
const projectRoutes = require('./routes/projectRoutes');
const blogRoutes = require('./routes/blogRoutes');
const experienceRoutes = require('./routes/experienceRoutes');
const testimonialRoutes = require('./routes/testimonialRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const contactRoutes = require('./routes/contactRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();

// 1. Security & Core Middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

const allowedOrigins = [
  'https://portfolio-frontend-cms-internship.vercel.app',
  'https://portfolio-frontend-internship.vercel.app',
  env.CLIENT_URL,
  env.ADMIN_URL,
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:4173'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);

    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app') ||
      origin.includes('localhost')
    ) {
      return callback(null, true);
    }

    // Default fallback: allow origin
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// 2. Static Assets (Uploads)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 3. API Health & Status Endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: '🚀 Custom Portfolio CMS Backend API is running successfully!',
    status: 'online',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
    healthCheck: '/api/health',
    endpoints: {
      auth: '/api/auth',
      about: '/api/about',
      skills: '/api/skills',
      projects: '/api/projects',
      blogs: '/api/blogs',
      experience: '/api/experience',
      testimonials: '/api/testimonials',
      services: '/api/services',
      contact: '/api/contact',
      upload: '/api/upload'
    }
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
    cmsVersion: '1.0.0-custom'
  });
});

// 4. API Routes Mounting
app.use('/api/auth', authRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/experience', experienceRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/upload', uploadRoutes);

// 5. 404 Route Handler
app.use('*', (req, res, next) => {
  next(new AppError(`Cannot find endpoint ${req.originalUrl} on this server`, 404));
});

// 6. Global Error Middleware
app.use(errorHandler);

// 7. Start Server Function
const startServer = async () => {
  await connectDB();
  await seedInitialData();

  let port = Number(env.PORT) || 5000;

  const server = app.listen(port);

  server.on('listening', () => {
    const boundPort = server.address().port;
    console.log(`\n🚀 =================================================`);
    console.log(`🔥 Custom Portfolio CMS Server is running!`);
    console.log(`📡 URL: http://localhost:${boundPort}`);
    console.log(`💚 Health Check: http://localhost:${boundPort}/api/health`);
    console.log(`🔐 Admin Login: ${env.ADMIN_EMAIL} / ${env.ADMIN_PASSWORD}`);
    console.log(`=================================================\n`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      port++;
      console.warn(`⚠️ Port ${port - 1} in use. Retrying on port ${port}...`);
      server.listen(port);
    } else {
      console.error('❌ Server startup error:', err);
    }
  });
};

startServer();

module.exports = app;
