import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import type { Model } from "mongoose";
import { User as UserRaw, IUser } from "../models/User";
import { executeWithFallback } from "../config/database";
import { z } from "zod";
const UserModel = UserRaw as unknown as Model<IUser>;

// Mock user data for fallback
const mockUser = {
  userId: "mock-user-123",
  email: "demo@ecowardrobe.com",
  name: "Demo User",
  profile: {
    bio: "Fashion enthusiast passionate about sustainable style",
    avatar: "",
    phone: "",
    location: "Demo City",
    stylePreferences: ["sustainable", "minimalist", "vintage"],
    favoriteColors: ["navy", "white", "beige"],
    preferences: {
      notifications: true,
      privacy: "public",
      newsletter: true
    }
  },
  sustainability: {
    totalWaterSaved: 150,
    totalCO2Reduced: 25,
    totalGarmentsDonated: 8,
    cardsEarned: 3,
    points: 450,
  },
  createdAt: new Date(),
  updatedAt: new Date()
};

const UpdateProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  email: z.string().email().max(254).optional(),
  bio: z.string().max(500).optional(),
  avatar: z.string().max(500000).optional(),
  phone: z.string().max(30).optional(),
  location: z.string().max(120).optional(),
  preferences: z
    .object({
      topSize: z.string().max(10).optional(),
      bottomSize: z.string().max(10).optional(),
      shoeSize: z.string().max(10).optional(),
      preferredMaterials: z.array(z.string()).max(50).optional(),
      avoidMaterials: z.array(z.string()).max(50).optional(),
      favoriteColors: z.array(z.string()).max(50).optional(),
      stylePreferences: z.array(z.string()).max(50).optional(),
      sustainabilityGoals: z.array(z.string()).max(50).optional(),
    })
    .optional(),
  notifications: z
    .object({
      emailNotifications: z.boolean().optional(),
      outfitSuggestions: z.boolean().optional(),
      communityUpdates: z.boolean().optional(),
      sustainabilityTips: z.boolean().optional(),
      marketplaceAlerts: z.boolean().optional(),
    })
    .optional(),
}).strict();

// Sign up
export const signUp: RequestHandler = async (req, res) => {
  try {
    const { email, name, password, stylePreferences } = req.body;

    const result = await executeWithFallback(
      async () => {
        // Check if user already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
          throw new Error("User with this email already exists");
        }

        // Create new user
        const user = new UserModel({
          userId: `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          email,
          name,
          password,
          profile: {
            stylePreferences: stylePreferences || [],
            favoriteColors: [],
          },
          sustainability: {
            totalWaterSaved: 0,
            totalCO2Reduced: 0,
            totalGarmentsDonated: 0,
            cardsEarned: 0,
            points: 0,
          },
        });

        await user.save();
        return user;
      },
      () => { throw new Error("Database unavailable"); },
      "Create user account"
    );

    if (result instanceof Error) {
      return res.status(400).json({ error: result.message });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: result.userId, email: result.email, name: result.name },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "7d" }
    );

    res.status(201).json({
      success: true,
      data: {
        userId: result.userId,
        email: result.email,
        name: result.name,
        token,
      },
    });
  } catch (error) {
    console.error("Sign up error:", error);
    res.status(500).json({ error: "Failed to create account" });
  }
};

// Sign in
export const signIn: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const result = await executeWithFallback(
      async () => {
        // Find user by email
        const user = await UserModel.findOne({ email });
        if (!user) {
          throw new Error("Invalid email or password");
        }

        // Check if password is provided and user has a password
        if (!password || !user.password) {
          throw new Error("Invalid email or password");
        }

        // Compare password
        const isPasswordValid = await (user as any).comparePassword(password);
        if (!isPasswordValid) {
          throw new Error("Invalid email or password");
        }

        return user;
      },
      () => { throw new Error("Database unavailable"); },
      "User authentication"
    );

    if (result instanceof Error) {
      return res.status(401).json({ error: result.message });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: result.userId, email: result.email, name: result.name },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "7d" }
    );

    console.log("Sign-in successful for:", result.email, "token generated:", !!token);

    res.json({
      success: true,
      data: {
        userId: result.userId,
        email: result.email,
        name: result.name,
        token,
      },
    });
  } catch (error) {
    console.error("Sign in error:", error);
    res.status(500).json({ error: "Failed to sign in" });
  }
};

// Get current user profile
export const getProfile: RequestHandler = async (req, res) => {
  try {
    if (!req.user) {
      console.error("No user in request");
      return res.status(401).json({ error: "Unauthorized" });
    }

    console.log("Fetching profile for userId:", req.user.userId);

    const result = await executeWithFallback(
      async () => {
        console.log("Attempting to fetch user from database");
        const user = await UserModel.findOne({ userId: req.user!.userId });
        if (!user) {
          throw new Error("User not found in database");
        }
        console.log("User found in database:", user.email);
        return user;
      },
      () => { throw new Error("Database unavailable"); },
      "Fetch user profile"
    );

    console.log("✅ Profile fetched successfully for:", result.email);

    res.json({
      success: true,
      data: {
        userId: result.userId,
        email: result.email,
        name: result.name,
        // Return phone/location at top-level
        phone: (result as any).phone,
        location: (result as any).location,
        // Also include inside profile for backward compatibility
        profile: {
          ...(result.profile || {}),
          phone: (result as any).phone,
          location: (result as any).location,
        },
        sustainability: (result as any).sustainability || {},
        preferences: (result as any).preferences || {},
        notifications: (result as any).notifications || {},
      },
    });
  } catch (error) {
    console.error("❌ Fetch profile error:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

// Update user profile
export const updateProfile: RequestHandler = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const parsed = UpdateProfileSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
    }
    const { 
      name, 
      email, 
      bio, 
      avatar, 
      phone, 
      location,
      preferences,
      notifications 
    } = parsed.data;

    const result = await executeWithFallback(
      async () => {
        const updateData: any = {};
        
        // Ensure identity fields are always present (needed for upsert)
        updateData.name = name ?? req.user!.name;
        updateData.email = email ?? req.user!.email;
        
        // Prevent email collisions
        if (email && email !== req.user!.email) {
          const existing = await UserModel.findOne({ email });
          if (existing && existing.userId !== req.user!.userId) {
            throw new Error("EMAIL_ALREADY_IN_USE");
          }
        }

        // Update profile fields (bio, avatar live under profile)
        if (bio !== undefined || avatar !== undefined) {
          updateData.profile = {};
          const user = await UserModel.findOne({ userId: req.user!.userId });
          if (user && user.profile) {
            updateData.profile = { ...user.profile };
          }
          if (bio !== undefined) updateData.profile.bio = bio;
          if (avatar !== undefined) updateData.profile.avatar = avatar;
        }
        // phone and location are top-level fields in schema
        if (phone !== undefined) updateData.phone = phone;
        if (location !== undefined) updateData.location = location;
        
        // Update preferences
        if (preferences) {
          updateData.preferences = preferences;
        }
        
        // Update notifications
        if (notifications) {
          updateData.notifications = notifications;
        }

        const user = await UserModel.findOneAndUpdate(
          { userId: req.user!.userId },
          updateData,
          { new: true, runValidators: true, upsert: true, setDefaultsOnInsert: true }
        );

        if (!user) {
          throw new Error("User not found");
        }

        return user;
      },
      () => { throw new Error("Database unavailable"); },
      "Update user profile"
    );
    
    res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        userId: (result as any).userId,
        email: (result as any).email,
        name: (result as any).name,
        bio: (result as any).profile?.bio,
        avatar: (result as any).profile?.avatar,
        phone: (result as any).phone,
        location: (result as any).location,
        preferences: (result as any).preferences,
        notifications: (result as any).notifications,
        profile: (result as any).profile,
        sustainability: (result as any).sustainability,
      },
    });
  } catch (error) {
    if ((error as any)?.message === "EMAIL_ALREADY_IN_USE") {
      return res.status(409).json({ error: "Email already in use" });
    }
    console.error("Update profile error:", error);
    return res.status(500).json({ error: "Failed to update profile" });
  }
};

// Change password
export const changePassword: RequestHandler = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { currentPassword, newPassword } = req.body;

    const result = await executeWithFallback(
      async () => {
        const user = await UserModel.findOne({ userId: req.user!.userId });
        if (!user || !user.password) {
          throw new Error("User not found");
        }

        // Verify current password
        const isPasswordValid = await (user as any).comparePassword(currentPassword);
        if (!isPasswordValid) {
          throw new Error("Current password is incorrect");
        }

        // Update password
        user.password = newPassword;
        await user.save();
        return { success: true };
      },
      () => { throw new Error("Database unavailable"); },
      "Change password"
    );

    if (result instanceof Error) {
      if (result.message === "User not found") {
        return res.status(404).json({ error: result.message });
      }
      return res.status(400).json({ error: result.message });
    }

    res.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ error: "Failed to change password" });
  }
};