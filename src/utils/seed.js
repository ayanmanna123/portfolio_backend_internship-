const env = require('../config/env');
const User = require('../models/User');
const About = require('../models/About');
const Skill = require('../models/Skill');
const Project = require('../models/Project');
const Blog = require('../models/Blog');
const Experience = require('../models/Experience');
const Testimonial = require('../models/Testimonial');
const Service = require('../models/Service');

const seedInitialData = async () => {
  try {
    // 1. Seed Admin User
    const existingAdmin = await User.findOne({ email: env.ADMIN_EMAIL });
    if (!existingAdmin) {
      await User.create({
        username: env.ADMIN_USERNAME,
        email: env.ADMIN_EMAIL,
        password: env.ADMIN_PASSWORD,
        role: 'admin'
      });
      console.log(`👤 Admin user seeded: ${env.ADMIN_EMAIL} / ${env.ADMIN_PASSWORD}`);
    }

    // 2. Seed About Data
    const aboutCount = await About.countDocuments();
    if (aboutCount === 0) {
      await About.create({
        name: 'Ayan Manna',
        title: 'Full-Stack Engineer & CMS Architect',
        bio: 'I build high-performance web applications that drive business growth. Specializing in React, Node.js, and scalable architecture for startups and enterprises.',
        location: 'Kolkata, West Bengal, India',
        email: 'mannaayan777@gmail.com',
        phone: '9907072795',
        avatarUrl: '/profile-logo.jpeg',
        resumeUrl: '/uploads/ayan-manna.pdf',
        socialLinks: {
          github: 'https://github.com/ayanmanna123',
          linkedin: 'https://www.linkedin.com/in/ayan-manna-4a67ab34a/',
          twitter: 'https://x.com/@AyanMan13756317',
          instagram: 'https://www.instagram.com/ayan.manna.90834',
          website: 'https://www.youtube.com/@ayanmanna1007'
        },
        stats: [
          { label: 'Hackathons', value: '7+' },
          { label: 'Projects', value: '14+' },
          { label: 'Freelancing', value: '1+' },
          { label: 'Internships', value: '1+' }
        ],
        highlights: [
          'Designed & built custom CMS architecture from scratch',
          'Full-stack React, Next.js, Node.js & Express developer',
          'Focus on performance, SEO, animations, and visual polish',
          '15+ scalable web apps delivered with clean architecture'
        ]
      });
      console.log('ℹ️ About information seeded');
    }

    // 3. Seed Skills
    const skillCount = await Skill.countDocuments();
    if (skillCount === 0) {
      await Skill.insertMany([
        { name: 'React', category: 'Frontend', level: 90, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', isFeatured: true, order: 1 },
        { name: 'Next.js', category: 'Frontend', level: 85, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg', isFeatured: true, order: 2 },
        { name: 'JavaScript', category: 'Frontend', level: 90, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', isFeatured: true, order: 3 },
        { name: 'Tailwind CSS', category: 'Frontend', level: 90, icon: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg', isFeatured: true, order: 4 },
        { name: 'Node.js', category: 'Backend', level: 85, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg', isFeatured: true, order: 5 },
        { name: 'Express', category: 'Backend', level: 85, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg', isFeatured: true, order: 6 },
        { name: 'MongoDB', category: 'Database', level: 85, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg', isFeatured: true, order: 7 },
        { name: 'Python', category: 'Backend', level: 80, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', isFeatured: true, order: 8 }
      ]);
      console.log('🛠️ Skills seeded');
    }

    // 4. Seed Projects
    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
      const demoProjects = [
        {
          title: 'Where Is My Bus',
          slug: 'where-is-my-bus',
          tagline: 'Live Bus Location Tracking • Smart Route Planning',
          description: 'Real-time bus tracking and smart public transport platform with live location tracking, route planning, and secure booking system.',
          category: 'Full Stack',
          thumbnail: '/projects/project9.png',
          tags: ['MERN Stack', 'Real-Time Tracking', 'Google Maps API', 'Socket.io', 'Razorpay Payments', 'JWT Auth'],
          githubUrl: 'https://github.com/ayanmanna123/GPS_Tracker',
          liveUrl: 'https://gps-tracker-umber.vercel.app/',
          featured: true,
          order: 1
        },
        {
          title: 'CollabLearn',
          slug: 'collablearn',
          tagline: 'Smart Mentor Discovery • Real-Time Chat & Video Sessions',
          description: 'A full-stack mentorship and collaborative learning platform enabling students to connect with mentors through real-time chat, video sessions, task management, and progress tracking.',
          category: 'Full Stack',
          thumbnail: '/projects/project10.jpeg',
          tags: ['MERN Stack', 'Real-Time Chat', 'Video Conferencing', 'EdTech SaaS', 'JWT Auth', 'Razorpay', 'Socket.io'],
          githubUrl: 'https://github.com/ayanmanna123/CollabLearn',
          liveUrl: 'https://collab-learn-ruby.vercel.app/',
          featured: true,
          order: 2
        }
      ];
      for (const p of demoProjects) {
        await Project.create(p);
      }
      console.log('🚀 Projects seeded');
    }

    // 5. Seed Services
    const serviceCount = await Service.countDocuments();
    if (serviceCount === 0) {
      await Service.insertMany([
        {
          title: 'Full Stack Web Development',
          icon: 'code',
          description: 'End-to-end custom web applications built with Next.js, Node.js, and modern databases.',
          features: ['Custom REST API', 'Responsive Frontend', 'SEO Optimization', 'Database Architecture'],
          isFeatured: true,
          order: 1
        },
        {
          title: 'Custom CMS Architecture',
          icon: 'layout',
          description: 'Bespoke admin dashboards and content management backends tailored to your exact business workflow.',
          features: ['JWT Authentication', 'Media Upload System', 'Flexible Schemas', 'No vendor lock-in'],
          isFeatured: true,
          order: 2
        }
      ]);
      console.log('💼 Services seeded');
    }

    // 6. Seed Experiences
    const expCount = await Experience.countDocuments();
    if (expCount === 0) {
      await Experience.insertMany([
        {
          title: 'Senior Full Stack Engineer',
          company: 'Nexus Tech Solutions',
          location: 'San Francisco, CA',
          type: 'full-time',
          startDate: '2023',
          endDate: 'Present',
          current: true,
          description: [
            'Architected custom internal tools and RESTful API microservices powering 50k+ daily operations.',
            'Mentored junior developers and led frontend performance optimization initiatives.'
          ],
          skillsUsed: ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS'],
          order: 1
        }
      ]);
      console.log('⌛ Experiences seeded');
    }

    // 7. Seed Testimonials
    const testCount = await Testimonial.countDocuments();
    if (testCount === 0) {
      await Testimonial.insertMany([
        {
          clientName: 'Sarah Jenkins',
          position: 'VP of Product',
          company: 'Apex Media',
          quote: 'Alex delivered our custom CMS platform ahead of schedule with immaculate code quality and stunning UI. Highly recommended!',
          rating: 5,
          order: 1
        }
      ]);
      console.log('⭐ Testimonials seeded');
    }

    // 8. Seed Blog
    const blogCount = await Blog.countDocuments();
    if (blogCount === 0) {
      await Blog.create({
        title: 'Building a Custom Headless CMS with Node.js and Express',
        excerpt: 'Why building your own CMS from scratch can give you total freedom, better performance, and zero third-party lock-in.',
        content: `Building a custom headless CMS gives you 100% control over content schemas, authentication, performance, and user interface design.\n\nIn this article, we cover setting up Express routes, Mongoose models, JWT authentication, and Multer file uploads for a complete backend system.`,
        tags: ['Node.js', 'Express', 'CMS', 'JavaScript'],
        status: 'published',
        publishedAt: new Date()
      });
      console.log('📝 Blogs seeded');
    }

  } catch (error) {
    console.error('⚠️ Seeding error:', error.message);
  }
};

module.exports = { seedInitialData };

if (require.main === module) {
  const { connectDB, disconnectDB } = require('../config/db');
  (async () => {
    await connectDB();
    await seedInitialData();
    await disconnectDB();
    process.exit(0);
  })();
}
