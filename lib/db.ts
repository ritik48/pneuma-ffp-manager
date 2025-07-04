import mongoose from "mongoose";

const MONGODB_URI =
  (process.env.MONGODB_URI as string) || "mongodb://localhost:27017/pneuma";

export const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;

  console.log({ MONGODB_URI });
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw new Error("MongoDB connection failed");
  }
};
