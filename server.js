require('dotenv').config(); // Load .env

const OpenAI = require('openai'); // ✅ Correct import for v4
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // ✅ Uses .env securely
});

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Static asset routes
app.use(express.static(path.join(__dirname, 'public')));
app.use('/resume', express.static(path.join(__dirname, 'public/resume')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use('/3dobjects', express.static(path.join(__dirname, 'public/3dobjects')));
app.use('/pages', express.static(path.join(__dirname, 'public/pages')));
app.use('/pages', express.static(path.join(__dirname, 'public/yaoshi-build')));
app.use('/pages', express.static(path.join(__dirname, 'public/portal-build')));

// Return all projects
app.get('/api/projects', (req, res) => {
  const projectDir = path.join(__dirname, 'data/projects');
  const files = fs.readdirSync(projectDir);
  const projects = files.map(file => {
    const data = fs.readFileSync(path.join(projectDir, file), 'utf8');
    return JSON.parse(data);
  });
  res.json(projects);
});

// Return resume + social links
app.get('/api/meta', (req, res) => {
  res.json({
    resume: '/resume/AnuragGotety_resume.pdf',
    socials: {
      github: 'https://github.com/anuraggotety',
      linkedin: 'https://linkedin.com/in/anurag-gotety',
      email: 'mailto:anurag10gotety@gmail.com',
      youtube: 'https://www.youtube.com/@anuraggotety7680/videos',
      instagram: 'https://www.instagram.com/goat80_productions/'
    }
  });
});

// Construct context from project JSONs
app.get('/api/context', (req, res) => {
  console.log("📥 /api/context route hit!");
  const projectDir = path.join(__dirname, 'data/projects');
  const files = fs.readdirSync(projectDir);
  const projects = files.map(file => {
    const data = fs.readFileSync(path.join(projectDir, file), 'utf8');
    return JSON.parse(data);
  });

  const context = {
    name: "Anurag Gotety",
    role: "Full-Stack Engineer",
    skills: [
      "React Native", "Three.js", "Node.js", "TensorFlow", "MongoDB",
      "Unity", "C#", "UI/UX", "Express.js", "Django", "AWS"
    ],
    projects: projects.map(p => ({
      title: p.title,
      description: p.short || '',
      long: p.long || ''
    }))
  };

  res.json(context);
});

// OpenAI MCP chat endpoint
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful AI assistant for a developer portfolio website." },
        { role: "user", content: message }
      ]
    });

    res.json({
  reply: completion.choices?.[0]?.message?.content || "No response."
});

  } catch (err) {
  console.error("❌ OpenAI error:", err.response?.data || err.message || err);
  res.status(500).json({ error: "OpenAI API error", detail: err.response?.data || err.message });
}
});

app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
