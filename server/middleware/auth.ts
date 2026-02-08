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
      console.warn("No authorization token provided");
      return res.status(401).json({ error: "Access token required" });
    }

    let decoded: { userId: string; email: string; name: string };
    
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret") as {
        userId: string;
        email: string;
        name: string;
      };
      console.log("Token verified successfully for userId:", decoded.userId);
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
      const user = await (User.findOne as any)({ userId: decoded.userId }).lean();
      if (user) {
        req.user = decoded;
        next();
      } else {
        console.warn("User not found in database, userId:", decoded.userId);
        // In fallback mode, allow the request to proceed with decoded token
        console.log("Using fallback mode - allowing request with decoded token");
        req.user = decoded;
        next();
      }
    } catch (dbError) {
      console.error("Database error in auth middleware:", dbError);
      // If database is not connected, allow request to proceed with decoded token
      // This allows the app to work in fallback/demo mode
      console.log("Using fallback mode - database unavailable");
      req.user = decoded;
      next();
    }
  } catch (error: any) {
    console.error("Auth middleware error:", error);
    return res.status(403).json({ error: "Authentication failed", details: error.message });
  }
};