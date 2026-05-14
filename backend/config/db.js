const mongoose = require('mongoose');
// import {MongoClient} from 'mongodb';

const connectDB = async () => {
  // console.log('Connecting to:', process.env.MONGO_URI);
  
  try {
    const conn= await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`❌ DB Error: ${err.message}`);
    process.exit(1);   // crash server if DB fails — intentional
  }
};

module.exports = connectDB;