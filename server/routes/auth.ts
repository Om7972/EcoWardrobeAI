import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models";
import { IUser } from "../models/User";

// Sign up
export const signUp: RequestHandler = async (req, res) => {
  try {
    const { email, name, password, stylePreferences } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User with this email already exists" });
    }

    // Create new user
    const user = new User({
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

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.userId, email: user.email, name: user.name },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "7d" }
    );

    res.status(201).json({
      success: true,
      data: {
        userId: user.userId,
        email: user.email,
        name: user.name,
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

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Check if password is provided and user has a password
    if (!password || !user.password) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.userId, email: user.email, name: user.name },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      data: {
        userId: user.userId,
        email: user.email,
        name: user.name,
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
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await User.findOne({ userId: req.user.userId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      success: true,
      data: {
        userId: user.userId,
        email: user.email,
        name: user.name,
        profile: user.profile,
        sustainability: user.sustainability,
      },
    });
  } catch (error) {
    console.error("Fetch profile error:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

// Update user profile
export const updateProfile: RequestHandler = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
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
    } = req.body;

    const updateData: any = {};
    
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    
    // Update profile fields
    if (bio !== undefined || avatar !== undefined || phone !== undefined || location !== undefined) {
      updateData.profile = {};
      const user = await User.findOne({ userId: req.user.userId });
      if (user && user.profile) {
        updateData.profile = { ...user.profile };
      }
      if (bio !== undefined) updateData.profile.bio = bio;
      if (avatar !== undefined) updateData.profile.avatar = avatar;
      if (phone !== undefined) updateData.profile.phone = phone;
      if (location !== undefined) updateData.profile.location = location;
    }
    
    // Update preferences
    if (preferences) {
      if (!updateData.profile) {
        const user = await User.findOne({ userId: req.user.userId });
        updateData.profile = user?.profile || {};
      }
      updateData.profile.preferences = preferences;
    }
    
    // Update notifications
    if (notifications) {
      if (!updateData.profile) {
        const user = await User.findOne({ userId: req.user.userId });
        updateData.profile = user?.profile || {};
      }
      updateData.profile.notifications = notifications;
    }

    const user = await User.findOneAndUpdate(
      { userId: req.user.userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        userId: user.userId,
        email: user.email,
        name: user.name,
        bio: user.profile?.bio,
        avatar: user.profile?.avatar,
        phone: user.profile?.phone,
        location: user.profile?.location,
        preferences: user.profile?.preferences,
        notifications: user.profile?.notifications,
        profile: user.profile,
        sustainability: user.sustainability,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
};

// Change password
export const changePassword: RequestHandler = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { currentPassword, newPassword } = req.body;

    const user = await User.findOne({ userId: req.user.userId });
    if (!user || !user.password) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ error: "Failed to change password" });
  }
};