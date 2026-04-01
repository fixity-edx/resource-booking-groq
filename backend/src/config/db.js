import mongoose from "mongoose";

export default async function connectDB(uri){
  if(!uri) throw new Error("MONGODB_URI missing in .env");

  mongoose.set("strictQuery", true);
  try{
    await mongoose.connect(uri);
    console.log("✅ MongoDB connected");
  }catch(err){
    console.error("❌ MongoDB error:", err.message);
    process.exit(1);
  }
}
