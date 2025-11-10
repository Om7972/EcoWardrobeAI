import { RequestHandler } from "express";
import { StyleCircle } from "../models";

// Create a new style circle
export const createStyleCircle: RequestHandler = async (req, res) => {
  try {
    const { name, description, category, privacy, tags, adminUserId } = req.body;
    
    // Check if circle with this name already exists
    const existingCircle = await StyleCircle.findOne({ name });
    if (existingCircle) {
      return res.status(400).json({ error: "A style circle with this name already exists" });
    }
    
    const styleCircle = new StyleCircle({
      name,
      description,
      category,
      privacy: privacy || "public",
      tags: tags || [],
      members: adminUserId ? [{
        userId: adminUserId,
        role: "admin",
        joinedAt: new Date()
      }] : [],
      posts: [],
      memberCount: adminUserId ? 1 : 0,
      postCount: 0,
    });
    
    await styleCircle.save();
    
    res.status(201).json({
      success: true,
      data: styleCircle,
    });
  } catch (error) {
    console.error("Create style circle error:", error);
    res.status(500).json({ error: "Failed to create style circle" });
  }
};

// Get all style circles
export const getAllStyleCircles: RequestHandler = async (req, res) => {
  try {
    const { category, tag, privacy, limit = "20", page = "1" } = req.query;
    
    // Build filter object
    const filter: any = {};
    if (category) filter.category = category;
    if (tag) filter.tags = { $in: [tag] };
    if (privacy) filter.privacy = privacy;
    
    const limitNum = parseInt(limit as string);
    const pageNum = parseInt(page as string);
    const skip = (pageNum - 1) * limitNum;
    
    const styleCircles = await StyleCircle.find(filter)
      .sort({ memberCount: -1, postCount: -1 })
      .skip(skip)
      .limit(limitNum);
    
    const total = await StyleCircle.countDocuments(filter);
    
    res.json({
      success: true,
      data: styleCircles,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error("Fetch style circles error:", error);
    res.status(500).json({ error: "Failed to fetch style circles" });
  }
};

// Get a specific style circle by ID
export const getStyleCircle: RequestHandler = async (req, res) => {
  try {
    const { circleId } = req.params;
    
    const styleCircle = await StyleCircle.findById(circleId);
    
    if (!styleCircle) {
      return res.status(404).json({ error: "Style circle not found" });
    }
    
    res.json({
      success: true,
      data: styleCircle,
    });
  } catch (error) {
    console.error("Fetch style circle error:", error);
    res.status(500).json({ error: "Failed to fetch style circle" });
  }
};

// Update a style circle
export const updateStyleCircle: RequestHandler = async (req, res) => {
  try {
    const { circleId } = req.params;
    const updateData = req.body;
    
    const styleCircle = await StyleCircle.findByIdAndUpdate(
      circleId,
      updateData,
      { new: true }
    );
    
    if (!styleCircle) {
      return res.status(404).json({ error: "Style circle not found" });
    }
    
    res.json({
      success: true,
      data: styleCircle,
    });
  } catch (error) {
    console.error("Update style circle error:", error);
    res.status(500).json({ error: "Failed to update style circle" });
  }
};

// Delete a style circle
export const deleteStyleCircle: RequestHandler = async (req, res) => {
  try {
    const { circleId } = req.params;
    
    const styleCircle = await StyleCircle.findByIdAndDelete(circleId);
    
    if (!styleCircle) {
      return res.status(404).json({ error: "Style circle not found" });
    }
    
    res.json({
      success: true,
      message: "Style circle deleted successfully",
    });
  } catch (error) {
    console.error("Delete style circle error:", error);
    res.status(500).json({ error: "Failed to delete style circle" });
  }
};

// Join a style circle
export const joinStyleCircle: RequestHandler = async (req, res) => {
  try {
    const { circleId } = req.params;
    const { userId, role = "member" } = req.body;
    
    const styleCircle = await StyleCircle.findById(circleId);
    
    if (!styleCircle) {
      return res.status(404).json({ error: "Style circle not found" });
    }
    
    // Check if user is already a member
    const isMember = styleCircle.members.some(member => member.userId === userId);
    if (isMember) {
      return res.status(400).json({ error: "User is already a member of this circle" });
    }
    
    // Add user to members
    styleCircle.members.push({
      userId,
      role,
      joinedAt: new Date()
    });
    
    styleCircle.memberCount = styleCircle.members.length;
    
    await styleCircle.save();
    
    res.json({
      success: true,
      data: styleCircle,
    });
  } catch (error) {
    console.error("Join style circle error:", error);
    res.status(500).json({ error: "Failed to join style circle" });
  }
};

// Leave a style circle
export const leaveStyleCircle: RequestHandler = async (req, res) => {
  try {
    const { circleId } = req.params;
    const { userId } = req.body;
    
    const styleCircle = await StyleCircle.findById(circleId);
    
    if (!styleCircle) {
      return res.status(404).json({ error: "Style circle not found" });
    }
    
    // Check if user is a member
    const memberIndex = styleCircle.members.findIndex(member => member.userId === userId);
    if (memberIndex === -1) {
      return res.status(400).json({ error: "User is not a member of this circle" });
    }
    
    // Remove user from members
    styleCircle.members.splice(memberIndex, 1);
    styleCircle.memberCount = styleCircle.members.length;
    
    await styleCircle.save();
    
    res.json({
      success: true,
      data: styleCircle,
    });
  } catch (error) {
    console.error("Leave style circle error:", error);
    res.status(500).json({ error: "Failed to leave style circle" });
  }
};

// Create a post in a style circle
export const createCirclePost: RequestHandler = async (req, res) => {
  try {
    const { circleId } = req.params;
    const { userId, content, images } = req.body;
    
    const styleCircle = await StyleCircle.findById(circleId);
    
    if (!styleCircle) {
      return res.status(404).json({ error: "Style circle not found" });
    }
    
    // Check if user is a member
    const isMember = styleCircle.members.some(member => member.userId === userId);
    if (!isMember) {
      return res.status(403).json({ error: "Only members can post in this circle" });
    }
    
    // Create new post
    const newPost = {
      userId,
      content,
      images: images || [],
      likes: 0,
      comments: 0,
      createdAt: new Date()
    };
    
    styleCircle.posts.push(newPost);
    styleCircle.postCount = styleCircle.posts.length;
    
    await styleCircle.save();
    
    res.status(201).json({
      success: true,
      data: styleCircle,
    });
  } catch (error) {
    console.error("Create circle post error:", error);
    res.status(500).json({ error: "Failed to create post" });
  }
};

// Get posts for a style circle
export const getCirclePosts: RequestHandler = async (req, res) => {
  try {
    const { circleId } = req.params;
    const { limit = "10", page = "1" } = req.query;
    
    const styleCircle = await StyleCircle.findById(circleId);
    
    if (!styleCircle) {
      return res.status(404).json({ error: "Style circle not found" });
    }
    
    const limitNum = parseInt(limit as string);
    const pageNum = parseInt(page as string);
    const skip = (pageNum - 1) * limitNum;
    
    // Sort posts by createdAt descending (newest first)
    const posts = styleCircle.posts
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(skip, skip + limitNum);
    
    res.json({
      success: true,
      data: posts,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: styleCircle.posts.length,
        pages: Math.ceil(styleCircle.posts.length / limitNum)
      }
    });
  } catch (error) {
    console.error("Fetch circle posts error:", error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};

// Like a post in a style circle
export const likeCirclePost: RequestHandler = async (req, res) => {
  try {
    const { circleId, postId } = req.params;
    
    const styleCircle = await StyleCircle.findById(circleId);
    
    if (!styleCircle) {
      return res.status(404).json({ error: "Style circle not found" });
    }
    
    // Find the post
    const postIndex = styleCircle.posts.findIndex(
      (post: any) => post._id.toString() === postId
    );
    
    if (postIndex === -1) {
      return res.status(404).json({ error: "Post not found" });
    }
    
    // Increment likes
    styleCircle.posts[postIndex].likes += 1;
    
    await styleCircle.save();
    
    res.json({
      success: true,
      data: { likes: styleCircle.posts[postIndex].likes },
    });
  } catch (error) {
    console.error("Like circle post error:", error);
    res.status(500).json({ error: "Failed to like post" });
  }
};