import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/ecommerceroute", {
      // very important
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("DB connected!");
  } catch (error) {
    console.error("Database error:", error);
  }
};
