// gptController.js - Using OpenRouter instead of OpenAI SDK
const axios = require('axios');
require('dotenv').config();

async function getAdvice(mood) {
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-4o',
        messages: [
          { role: 'system', content: 'You are a mood advisor bot.' },
          { role: 'user', content: `Give a short one-line advice for someone feeling ${mood}` }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://moodmate-akshara.com', // or http://localhost:3000
          'X-Title': 'MoodMate-AI'
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('❌ OpenRouter Error:', error.response?.data || error.message);
    return 'Sorry, I couldn’t fetch advice right now.';
  }
}

module.exports = { getAdvice };
