const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/quiz-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected')).catch(err => console.log(err));

// Serve JSON files
const quizDataPath = path.join(__dirname, 'quiz-data');

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
    res.json(JSON.parse(data));
  });
});

// Default route
app.get('/', (req, res) => {
  res.send('Quiz App Backend');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
