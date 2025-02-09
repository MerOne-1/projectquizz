const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// Serve JSON files
const quizDataPath = path.join(__dirname, 'quiz-data', 'themes');

app.get('/api/themes', (req, res) => {
  fs.readdir(quizDataPath, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Unable to read quiz data' });
    }
    const themes = files.map(file => file.replace('.json', ''));
    res.json(themes);
  });
});

app.get('/api/quiz/:theme', (req, res) => {
  const theme = req.params.theme;
  const filePath = path.join(quizDataPath, `${theme}.json`);
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(404).json({ error: 'Theme not found' });
    }
    try {
      const quizData = JSON.parse(data);
      res.json(quizData);
    } catch (error) {
      res.status(500).json({ error: 'Invalid quiz data' });
    }
  });
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
