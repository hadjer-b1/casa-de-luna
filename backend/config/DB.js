const mongoose = require("mongoose");
const dbuser = process.env.DBUSER;
const dbpassword = process.env.DBPASSWORD;
const atlasUri =
  dbuser && dbpassword
    ? `mongodb+srv://${dbuser}:${dbpassword}@cluster0.bfvzzvd.mongodb.net/Restaurant?retryWrites=true&w=majority&appName=Cluster0`
    : null;

const dbURI = atlasUri || process.env.URIDB;

const connectDB = async () => {
  try {
    // Hide the password
    const safeUri = dbURI.replace(/:[^:@]+@/, ":****@");
    console.log("Attempting to connect to:", safeUri);

    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully to:", safeUri);

  } catch (error) {
     console.error("MongoDB connection failed:", error.message);
    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
