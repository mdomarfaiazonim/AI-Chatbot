const OpenAI  = require('openai');
const Message = require('../models/Message');

// ── OpenAI client (or Groq — just change baseURL) ────
const client = new OpenAI({
  apiKey:  process.env.GROQ_API_KEY,
  // For Groq (free), uncomment these two lines:
  // apiKey:  process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

const SYSTEM_PROMPT = `You are Botify, a friendly and helpful AI assistant.
Be concise, warm, and conversational.
Keep responses under 3 sentences unless more detail is needed.`;

// ── POST /api/chat ───────────────────────────────────
const sendMessage = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }

    // Fetch recent history to give LLM context (last 10 messages)
    // const history = await Message
    //   .find()
    //   .sort({ createdAt: -1 })
    //   .limit(10)
    //   .lean();

    const history=  await Message.find().sort({ createdAt: -1 }).limit(10);

    // Build message array for OpenAI (reverse to get oldest-first)
    const contextMessages = history
      .reverse()
      .map(m => ({
        role:    m.role === 'bot' ? 'assistant' : 'user',
        content: m.content
      }));

    // Final messages array sent to LLM
    const messages = [
      { role: 'system',    content: SYSTEM_PROMPT },
      ...contextMessages,
      { role: 'user',      content: message }
    ];

    // Call LLM
    const response = await client.chat.completions.create({
      model:       'llama-3.3-70b-versatile',  // or 'llama3-8b-8192' for Groq
      messages,
      max_tokens:  300,             // limit response length
      temperature: 0.7             // 0=robotic, 1=creative
    });

    // console.log(response);

    const reply = response.choices[0].message.content.trim();

    // Save both messages to MongoDB
    await Message.insertMany([
      { role: 'user', content: message },
      { role: 'bot',  content: reply }
    ]);

    res.status(200).json({ reply });

  } catch (err) {
    // Handle rate limit specifically
    if (err.status === 429) {
      return res.status(429).json({ error: 'Rate limit hit. Try again in a moment.' });
    }
    next(err);
  }
};

const getHistory = async (req, res, next) => {
  try {
    const messages = await Message.find().sort({ createdAt: 1 }).limit(50);
    res.json({ messages });
  } catch (err) { next(err); }
};

const clearHistory = async (req, res, next) => {
  try {
    await Message.deleteMany({});
    res.json({ message: 'History cleared' });
  } catch (err) { next(err); }
};

module.exports = { sendMessage, getHistory, clearHistory };