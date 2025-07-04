import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGO_DB_URL || "mongodb://127.0.0.1:27017/passwordManagerApp";
let isConnected: boolean = false;

export const connectDb = async (): Promise<void> => {
  if (isConnected) {
    console.log("Using existing database connection");
    return;
  }

  try {
    console.log("Connecting to MongoDB...");
    console.log("Connection URI:", MONGODB_URI);
    console.log("Current mongoose connection state:", mongoose.connection.readyState);

    if (mongoose.connection.readyState >= 1) {
      isConnected = true;
      console.log("Using existing mongoose connection");
      return;
    }

    const options = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    console.log("Attempting to connect with options:", options);
    await mongoose.connect(MONGODB_URI, options);
    console.log("Mongoose connect call completed");

    mongoose.connection.on("connected", () => {
      console.log("✅ MongoDB connected successfully");
      console.log("Database name:", mongoose.connection.name);
      console.log("Host:", mongoose.connection.host);
      isConnected = true;
    });

    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
      console.error("Error details:", {
        name: err.name,
        message: err.message,
        stack: err.stack
      });
      isConnected = false;
    });

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected");
      console.log("Last known state:", {
        readyState: mongoose.connection.readyState,
        host: mongoose.connection.host,
        name: mongoose.connection.name
      });
      isConnected = false;
    });

    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      process.exit(0);
    });
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    console.error("Error details:", {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error;
  }
};
