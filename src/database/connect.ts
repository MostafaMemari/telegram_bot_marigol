import mongoose from "mongoose";

export async function connectDB() {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/jobs";

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000, // 10s timeout
    });
    console.log("✅ MongoDB connected successfully!");
  } catch (err: any) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
}
