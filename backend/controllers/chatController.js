// const OpenAI  = require('openai');
// const Message = require('../models/Message');

// // ── OpenAI client (or Groq — just change baseURL) ────
// const client = new OpenAI({
//   apiKey:  process.env.GROQ_API_KEY,
//   // For Groq (free), uncomment these two lines:
//   // apiKey:  process.env.GROQ_API_KEY,
//   baseURL: 'https://api.groq.com/openai/v1',
// });

// const SYSTEM_PROMPT = `You are Botify, a friendly and helpful AI assistant.
// Be concise, warm, and conversational.
// Keep responses under 3 sentences unless more detail is needed.`;

// // ── POST /api/chat ───────────────────────────────────
// const sendMessage = async (req, res, next) => {
//   try {
//     const { message } = req.body;


//     if (!message?.trim()) {
//       return res.status(400).json({ error: 'Message cannot be empty' });
//     }

//     // Fetch recent history to give LLM context (last 10 messages)
//     // const history = await Message
//     //   .find()
//     //   .sort({ createdAt: -1 })
//     //   .limit(10)
//     //   .lean();

//     const history=  await Message.find().sort({ createdAt: -1 }).limit(10);

//     // Build message array for OpenAI (reverse to get oldest-first)
//     const contextMessages = history
//       .reverse()
//       .map(m => ({
//         role:    m.role === 'bot' ? 'assistant' : 'user',
//         content: m.content
//       }));

//     // Final messages array sent to LLM
//     const messages = [
//       { role: 'system',    content: SYSTEM_PROMPT },
//       ...contextMessages,
//       { role: 'user',      content: message }
//     ];

//     // Call LLM
//     const response = await client.chat.completions.create({
//       model:       'llama-3.3-70b-versatile',  // or 'llama3-8b-8192' for Groq
//       messages,
//       max_tokens:  300,             // limit response length
//       temperature: 0.7             // 0=robotic, 1=creative
//     });

//     // console.log(response);

//     const reply = response.choices[0].message.content.trim();

//     // console.log(message);
//     // console.log(reply);


//     // Save both messages to MongoDB
//     await Message.insertMany([
//       { role: 'user', content: message, userId: req.user?.id },
//       { role: 'assistant',  content: reply, userId: req.user?.id }
//     ]);
    

//     res.status(200).json({ reply });

//   } catch (err) {
//     // Handle rate limit specifically
//     if (err.status === 429) {
//       return res.status(429).json({ error: 'Rate limit hit. Try again in a moment.' });
//     }
//     next(err);
//   }
// };

// const getChatHistory = async (req, res, next) => {
//   try {
//     const messages = await Message.find().sort({ createdAt: 1 }).limit(50);
//     res.json({ messages });
//   } catch (err) { next(err); }
// };

// const clearChatHistory = async (req, res, next) => {
//   try {
//     await Message.deleteMany({});
//     res.json({ message: 'Chat history cleared' });
//   } catch (err) { next(err); }
// };

// module.exports = { sendMessage, getChatHistory, clearChatHistory };





// backend/controllers/chatController.js

const OpenAI = require('openai');

const Message = require('../models/Message');

const client = new OpenAI({
  apiKey:  process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

const SYSTEM_PROMPT = `You are Botify, a friendly and helpful AI assistant.
Be concise, warm, and conversational.
Keep responses under 3 sentences unless more detail is needed.`;

const getRoleData = (userRole) => {

    if(userRole=='bot') return 'assistant';
    return userRole;
};

// =========================
// SEND MESSAGE
// =========================
exports.sendMessage = async (req, res, next) => {
    try {



        const userId = req.user.id;

        // console.log();

        // console.log('User ID from JWT:', userId);

        // Save user message
        await Message.create({
            userId,
            role: 'user',
            content: req.body.message
        });

        // Get previous conversation
        const history = await Message.find({ userId })
            .sort({ createdAt: 1 })
            .limit(20);

        // Format for OpenAI
        const formattedMessages = history.reverse().map(msg => ({
            role: getRoleData(msg.role),
            content: msg.content
        }));
        
        const messages = [
            { role: 'system', content: SYSTEM_PROMPT },
            ...formattedMessages,
            { role: 'user', content: req.body.message }
        ];

        //     const contextMessages = history
//       .reverse()
//       .map(m => ({
//         role:    m.role === 'bot' ? 'assistant' : 'user',
//         content: m.content
//       }));

//     // Final messages array sent to LLM
//     const messages = [
//       { role: 'system',    content: SYSTEM_PROMPT },
//       ...contextMessages,
//       { role: 'user',      content: message }
//     ];

        // AI response
        const completion = await client.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages,
            max_tokens: 300,
            temperature: 0.7
        });

        //     const response = await client.chat.completions.create({
//       model:       'llama-3.3-70b-versatile',  // or 'llama3-8b-8192' for Groq
//       messages,
//       max_tokens:  300,             // limit response length
//       temperature: 0.7             // 0=robotic, 1=creative
//     });


        const aiReply = completion.choices[0].message.content;

        // Save AI reply
        await Message.create({
            userId,
            role: 'assistant',
            content: aiReply
        });

        res.status(200).json({
            success: true,
            reply: aiReply
        });

    } catch (error) {
        next(error);
    }
};



// =========================
// GET CHAT HISTORY
// =========================
exports.getChatHistory = async (req, res, next) => {
    try {

        const userId = req.user.id;

        const messages = await Message.find({ userId })
            .sort({ createdAt: 1 });

        res.status(200).json({
            success: true,
            messages
        });

    } catch (error) {
        next(error);
    }
};



// =========================
// CLEAR CHAT HISTORY
// =========================
exports.clearChatHistory = async (req, res, next) => {
    try {

        const userId = req.user.id;

        await Message.deleteMany({ userId });

        res.status(200).json({
            success: true,
            message: 'Chat history cleared'
        });

    } catch (error) {
        next(error);
    }
};