const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const env = require('../config/env');
const { connectDB } = require('../config/db');

const About = require('../models/About');
const Skill = require('../models/Skill');
const Project = require('../models/Project');
const Experience = require('../models/Experience');
const Testimonial = require('../models/Testimonial');
const Service = require('../models/Service');
const User = require('../models/User');

const seedData = async () => {
  try {
    await connectDB();
    console.log('📡 Connected to MongoDB for seeding Ayan Manna portfolio data...');

    const dataDir = path.resolve(__dirname, '../../../CMS_frontend/data/content');

    const aboutRaw = JSON.parse(fs.readFileSync(path.join(dataDir, 'about.json'), 'utf-8'));
    const heroRaw = JSON.parse(fs.readFileSync(path.join(dataDir, 'hero.json'), 'utf-8'));
    const contactRaw = JSON.parse(fs.readFileSync(path.join(dataDir, 'contact.json'), 'utf-8'));
    const skillsRaw = JSON.parse(fs.readFileSync(path.join(dataDir, 'skills.json'), 'utf-8'));
    const projectsRaw = JSON.parse(fs.readFileSync(path.join(dataDir, 'projects.json'), 'utf-8'));
    const journeyRaw = JSON.parse(fs.readFileSync(path.join(dataDir, 'journey.json'), 'utf-8'));
    const testimonialsRaw = JSON.parse(fs.readFileSync(path.join(dataDir, 'testimonials.json'), 'utf-8'));

    // 1. Seed About & Hero
    await About.deleteMany({});
    const socialMap = {};
    (contactRaw.socialLinks || []).forEach(s => {
      socialMap[s.platform.toLowerCase()] = s.href;
    });

    const aboutDoc = await About.create({
      name: aboutRaw.name || "Ayan Manna",
      title: heroRaw.subtitle ? `${heroRaw.subtitle} & CMS Architect` : "Full-Stack Engineer & CMS Architect",
      bio: heroRaw.description || aboutRaw.bio || "I build high-performance web applications that drive business growth. Specializing in React, Node.js, and scalable architecture for startups and enterprises.",
      avatarUrl: aboutRaw.profileImage || "/profile-logo.jpeg",
      resumeUrl: aboutRaw.resumeUrl || heroRaw.resumeUrl || "/uploads/ayan-manna.pdf",
      location: contactRaw.location || "Kolkata, West Bengal, India",
      email: contactRaw.email || "mannaayan777@gmail.com",
      phone: contactRaw.phone || "9907072795",
      socialLinks: {
        github: socialMap.github || "https://github.com/ayanmanna123",
        linkedin: socialMap.linkedin || "https://www.linkedin.com/in/ayan-manna-4a67ab34a/",
        twitter: socialMap.twitter || "https://x.com/@AyanMan13756317",
        instagram: socialMap.instagram || "https://www.instagram.com/ayan.manna.90834",
        website: socialMap.youtube || ""
      },
      stats: (aboutRaw.achievements || []).map(a => ({
        label: a.label,
        value: `${a.number}${a.suffix || '+'}`
      })),
      highlights: [
        "Designed & built custom CMS architecture from scratch",
        "Full-stack React, Next.js, Node.js & Express developer",
        "Focus on performance, SEO, animations, and visual polish",
        "15+ scalable web apps delivered with clean architecture"
      ]
    });
    console.log('✅ About collection seeded for Ayan Manna');

    // 2. Seed Skills
    await Skill.deleteMany({});
    const categoryMapping = {
      frontend: 'Frontend',
      backend: 'Backend',
      tools: 'DevOps & Tools',
      aiml: 'Design & Other',
      appdev: 'Frontend',
      deeplearning: 'Design & Other'
    };

    const skillDocs = (skillsRaw.skillsData || []).map((s, idx) => ({
      name: s.name,
      category: categoryMapping[s.category] || 'Frontend',
      level: s.level || 85,
      icon: s.icon || 'code',
      isFeatured: s.level >= 85 || idx < 6,
      order: idx + 1
    }));
    await Skill.insertMany(skillDocs);
    console.log(`✅ ${skillDocs.length} Skills seeded`);

    // 3. Seed Projects
    await Project.deleteMany({});
    const projectDocs = (projectsRaw.projects || []).map((p, idx) => ({
      title: p.title,
      slug: p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      tagline: p.highlights && p.highlights.length ? p.highlights.slice(0, 2).join(' • ') : p.category,
      description: p.description,
      thumbnail: p.image || '',
      images: p.details?.screenshots?.desktop || (p.image ? [p.image] : []),
      category: p.category.includes('AI') ? 'Artificial Intelligence' : (p.category.includes('Full Stack') || p.category.includes('Web') ? 'Full Stack' : 'Frontend'),
      tags: p.tags || [],
      githubUrl: p.githubUrl || '',
      liveUrl: p.demoUrl || '',
      featured: p.featured !== undefined ? p.featured : true,
      order: idx + 1
    }));
    await Project.insertMany(projectDocs);
    console.log(`✅ ${projectDocs.length} Projects seeded`);

    // 4. Seed Experiences / Journey
    await Experience.deleteMany({});
    const experienceDocs = (journeyRaw.journey || []).map((j, idx) => ({
      title: j.role,
      company: j.company,
      location: 'Kolkata, India',
      type: idx === 0 ? 'freelance' : (idx === 1 ? 'full-time' : 'internship'),
      startDate: j.year,
      endDate: idx === 0 ? 'Present' : j.year,
      current: idx === 0,
      description: [j.description],
      skillsUsed: j.skills || [],
      order: idx + 1
    }));
    await Experience.insertMany(experienceDocs);
    console.log(`✅ ${experienceDocs.length} Experiences seeded`);

    // 5. Seed Testimonials
    await Testimonial.deleteMany({});
    const testimonialDocs = (testimonialsRaw.testimonials || []).map((t, idx) => ({
      clientName: t.name,
      position: t.role.split(' at ')[0] || t.role,
      company: t.role.split(' at ')[1] || '',
      avatar: t.image || '',
      quote: t.content,
      rating: t.rating || 5,
      order: idx + 1
    }));
    await Testimonial.insertMany(testimonialDocs);
    console.log(`✅ ${testimonialDocs.length} Testimonials seeded`);

    // 6. Seed Services
    await Service.deleteMany({});
    const serviceDocs = [
      {
        title: 'Full Stack Web Development',
        icon: 'code',
        description: 'End-to-end custom web applications built with Next.js, Node.js, Express, MongoDB, and modern reactive libraries.',
        features: ['Full Stack Architecture', 'REST & Real-time APIs', 'Responsive High-Performance UI', 'Database Modeling'],
        priceRange: 'Custom Quote',
        isFeatured: true,
        order: 1
      },
      {
        title: 'Custom CMS Architecture',
        icon: 'layout',
        description: 'Bespoke admin dashboards, headless content management backends, and decoupled APIs tailored to custom workflows.',
        features: ['JWT Authentication', 'Media Upload & Cloud Storage', 'Flexible Schemas', 'No vendor lock-in'],
        priceRange: 'Custom Quote',
        isFeatured: true,
        order: 2
      },
      {
        title: 'Real-Time & AI Systems',
        icon: 'zap',
        description: 'Integrating Socket.io real-time streaming, WebRTC audio/video sessions, and generative AI features into web apps.',
        features: ['Socket.io Live Sync', 'WebRTC Video Conferencing', 'AI LLM / Vision Integration', 'Low Latency Infrastructure'],
        priceRange: 'Custom Quote',
        isFeatured: true,
        order: 3
      }
    ];
    await Service.insertMany(serviceDocs);
    console.log(`✅ ${serviceDocs.length} Services seeded`);

    console.log('\n🎉 ALL PORTFOLIO DATA SUCCESSFULLY SYNCHRONIZED WITH CMS DATA FOLDER!\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding data:', err);
    process.exit(1);
  }
};

seedData();
