require('dotenv').config();                  // MUST be line 1
// require('dotenv').config({ path: './config/.env' });  // specify path to .env file
const express    = require('express');
const cors       = require('cors');
const connectDB  = require('./config/db');
const chatRoutes = require('./routes/chatRoutes');
const errorHandler = require('./middleware/errorHandler');

// 1. Connect Database
connectDB();

const app = express();

// 2. Middleware
app.use(cors());                         // allow React frontend
app.use(express.json());               // parse JSON request body

// 3. Routes
app.use('/api/chat', chatRoutes);

// 4. Health check (test if server is alive)
app.get('/', (req, res) => {
  res.json({ status: 'Backend is running ✅' });
});

// 5. Global error handler (must be LAST)
app.use(errorHandler);

// 6. Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});