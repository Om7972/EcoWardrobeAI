import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://odhumkekar_db_user:dFuOwKHF1RdvQY2t@ecowardrobeai.sumcyzx.mongodb.net/?appName=EcowardrobeAI";

let isConnected = false;
let connectionAttempted = false;

export async function connectDatabase() {
  if (connectionAttempted && isConnected) {
    return mongoose.connection;
  }

  connectionAttempted = true;

  try {
    // Configure mongoose with better timeout settings
    mongoose.set('bufferCommands', false);
    
    await mongoose.connect(MONGODB_URI, {
      dbName: "ecowardrobe",
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      maxPoolSize: 10, // Maintain up to 10 socket connections
      minPoolSize: 5, // Maintain a minimum of 5 socket connections
      maxIdleTimeMS: 30000, // Close connections after 30s of inactivity
      bufferCommands: false, // Disable mongoose buffering
    });
    
    isConnected = true;
    console.log("✅ MongoDB connected successfully");
    
    // Handle connection events
    mongoose.connection.on('error', (error) => {
      console.error("❌ MongoDB connection error:", error);
      isConnected = false;
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn("⚠️ MongoDB disconnected");
      isConnected = false;
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log("🔄 MongoDB reconnected");
      isConnected = true;
    });
    
    return mongoose.connection;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    isConnected = false;
    throw error;
  }
}

export function getDatabase() {
  return mongoose.connection;
}

export function isDatabaseConnected(): boolean {
  return isConnected && mongoose.connection.readyState === 1;
}

// Helper function to execute database operations with timeout and fallback
export async function executeWithFallback<T>(
  operation: () => Promise<T>,
  fallback: () => T,
  operationName: string = "Database operation"
): Promise<T> {
  if (!isDatabaseConnected()) {
    console.warn(`⚠️ Database not connected, using fallback for ${operationName}`);
    return fallback();
  }

  try {
    // Set a timeout for the operation
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Operation timeout')), 5000);
    });

    const result = await Promise.race([operation(), timeoutPromise]);
    return result;
  } catch (error: any) {
    console.error(`❌ ${operationName} failed:`, error.message);
    console.warn(`⚠️ Using fallback for ${operationName}`);
    return fallback();
  }
}
