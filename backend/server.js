// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'Server is running!' });
});

// Quiz generation route
app.post('/api/generate-quiz', async (req, res) => {
  const { topic, numQuestions, difficulty } = req.body;

  // Validation
  if (!topic || !numQuestions || !difficulty) {
    return res.status(400).json({ error: 'Topic, numQuestions, difficulty required' });
  }

  const systemPrompt = `
    You are a quiz generator AI.
    Generate ${numQuestions} multiple-choice questions.
    Rules:
    - Topic: ${topic}
    - Difficulty: ${difficulty}
    - Each question must have 4 options
    - Only ONE correct answer
    Return ONLY raw JSON array. No explanation. No markdown.
    Format:
    [
      {
        "question": "",
        "options": ["", "", "", ""],
        "answer": ""
      }
    ]
  `;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`, // ✅ Key sirf server pe
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-small-3.2-24b-instruct',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Generate quiz on ${topic}` }
        ]
      })
    });

    const data = await response.json();
if (!data.choices || !data.choices[0]) {
  console.error("OpenRouter Error Response:", data);
  return res.status(500).json({
    error: "AI response failed",
    details: data
  });
}

let content = data.choices[0].message.content;
    // Clean JSON
    content = content.replace(/```json/g, '').replace(/```/g, '').trim();
    const start = content.indexOf('[');
    const end = content.lastIndexOf(']') + 1;
    const clean = content.slice(start, end);
    const quizData = JSON.parse(clean);

    res.json({ quiz: quizData }); // ✅ Frontend ko sirf quiz data milta hai

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to generate quiz' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});