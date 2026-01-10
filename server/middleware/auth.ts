import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        name: string;
      };
    }
  }
}

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Access token required" });
    }

    let decoded: { userId: string; email: string; name: string };
    
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret") as {
        userId: string;
        email: string;
        name: string;
      };
    } catch (jwtError: any) {
      console.error("JWT verification error:", jwtError.message);
      if (jwtError.name === "TokenExpiredError") {
        return res.status(401).json({ error: "Token expired. Please sign in again." });
      }
      if (jwtError.name === "JsonWebTokenError") {
        return res.status(401).json({ error: "Invalid token. Please sign in again." });
      }
      return res.status(401).json({ error: "Token verification failed" });
    }

    try {
      const user = await User.findOne({ userId: decoded.userId });
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }

      req.user = decoded;
      next();
    } catch (dbError) {
      console.error("Database error in auth middleware:", dbError);
      // If database is not connected, allow request to proceed with decoded token
      // This allows the app to work in mock mode
      req.user = decoded;
      next();
    }
  } catch (error: any) {
    console.error("Auth middleware error:", error);
    return res.status(403).json({ error: "Authentication failed", details: error.message });
  }
};