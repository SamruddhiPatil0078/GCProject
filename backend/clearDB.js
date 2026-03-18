const mongoose = require('mongoose');
require('dotenv').config();

const Assignment = require('./models/Assignment');

async function clearDatabase() {
  try {

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");

    const result = await Assignment.deleteMany({});

    console.log("Deleted assignments:", result.deletedCount);

    process.exit();

  } catch (error) {

    console.error("Error:", error);
    process.exit(1);

  }
}

clearDatabase();