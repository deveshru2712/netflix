import mongoose from "mongoose";

const connectToDb = async () => {
  try {
    await mongoose.connect(process.env.Mongo_Uri);
    console.log("Successfully connected to the database ✅");
  } catch (error) {
    console.log(
      "An error occurred while connecting to the database:",
      error.message
    );
    process.exit(1);
  }
};

export default connectToDb;
