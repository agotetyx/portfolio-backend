const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/resume', express.static(path.join(__dirname, 'public/resume')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use('/3dobjects', express.static(path.join(__dirname, 'public/3dobjects')));
app.use('/pages', express.static(path.join(__dirname, 'public/pages')));
app.use('/pages', express.static(path.join(__dirname, 'public/yaoshi-build')));
app.use('/pages', express.static(path.join(__dirname, 'public/portal-build')));



app.get('/api/projects', (req, res) => {
  const projectDir = path.join(__dirname, 'data/projects');
  const files = fs.readdirSync(projectDir);
  const projects = files.map(file => {
    const data = fs.readFileSync(path.join(projectDir, file), 'utf8');
    return JSON.parse(data);
  });
  res.json(projects);
});

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

app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
