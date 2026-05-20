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



// const mongoose = require('mongoose');

// const connectDB = async () => {
//     try {
//         const conn = await mongoose.connect(process.env.MONGO_URI);

//         console.log(`MongoDB Connected: ${conn.connection.host}`);
//     } catch (error) {
//         console.error('MongoDB Connection Error:', error.message);

//         process.exit(1);
//     }
// };

// module.exports = connectDB;