import { RequestHandler } from "express";
import { StyleCircle } from "../models";
import { executeWithFallback } from "../config/database";

// Mock data for fallback
const mockStyleCircles = [
  {
    _id: "mock-circle-1",
    name: "Sustainable Fashion Lovers",
    description: "A community for those passionate about eco-friendly fashion choices",
    category: "sustainability",
    privacy: "public",
    tags: ["sustainable", "eco-friendly", "ethical"],
    members: [
      { userId: "user1", role: "admin", joinedAt: new Date() },
      { userId: "user2", role: "member", joinedAt: new Date() }
    ],
    posts: [
      {
        _id: "post1",
        userId: "user1",
        content: "Check out this amazing thrift find!",
        images: [],
        likes: 5,
        comments: 2,
        createdAt: new Date()
      }
    ],
    memberCount: 2,
    postCount: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: "mock-circle-2",
    name: "Vintage Vibes",
    description: "Celebrating timeless vintage fashion and styling tips",
    category: "vintage",
    privacy: "public",
    tags: ["vintage", "retro", "classic"],
    members: [
      { userId: "user3", role: "admin", joinedAt: new Date() }
    ],
    posts: [],
    memberCount: 1,
    postCount: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Create a new style circle
export const createStyleCircle: RequestHandler = async (req, res) => {
  try {
    const { name, description, category, privacy, tags, adminUserId } = req.body;
    
    const result = await executeWithFallback(
      async () => {
        // Check if circle with this name already exists
        const existingCircle = await StyleCircle.findOne({ name });
        if (existingCircle) {
          throw new Error("A style circle with this name already exists");
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
        return styleCircle;
      },
      () => {
        // Fallback: return mock created circle
        return {
          _id: `mock-${Date.now()}`,
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
          createdAt: new Date(),
          updatedAt: new Date()
        };
      },
      "Create style circle"
    );
    
    if (result instanceof Error) {
      return res.status(400).json({ error: result.message });
    }
    
    res.status(201).json({
      success: true,
      data: result,
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
    
    const result = await executeWithFallback(
      async () => {
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
        
        return {
          styleCircles,
          total,
          page: pageNum,
          limit: limitNum
        };
      },
      () => {
        // Fallback: return mock data
        let filteredCircles = [...mockStyleCircles];
        
        // Apply filters
        if (category) {
          filteredCircles = filteredCircles.filter(circle => circle.category === category);
        }
        if (tag) {
          filteredCircles = filteredCircles.filter(circle => 
            circle.tags.includes(tag as string)
          );
        }
        if (privacy) {
          filteredCircles = filteredCircles.filter(circle => circle.privacy === privacy);
        }
        
        const limitNum = parseInt(limit as string);
        const pageNum = parseInt(page as string);
        const skip = (pageNum - 1) * limitNum;
        
        const paginatedCircles = filteredCircles.slice(skip, skip + limitNum);
        
        return {
          styleCircles: paginatedCircles,
          total: filteredCircles.length,
          page: pageNum,
          limit: limitNum
        };
      },
      "Fetch style circles"
    );
    
    res.json({
      success: true,
      data: result.styleCircles,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        pages: Math.ceil(result.total / result.limit)
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
    
    const result = await executeWithFallback(
      async () => {
        const styleCircle = await StyleCircle.findById(circleId);
        if (!styleCircle) {
          throw new Error("Style circle not found");
        }
        return styleCircle;
      },
      () => {
        // Fallback: return mock circle if ID matches
        const mockCircle = mockStyleCircles.find(circle => circle._id === circleId);
        if (!mockCircle) {
          throw new Error("Style circle not found");
        }
        return mockCircle;
      },
      "Fetch style circle"
    );
    
    if (result instanceof Error) {
      return res.status(404).json({ error: result.message });
    }
    
    res.json({
      success: true,
      data: result,
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
    
    const result = await executeWithFallback(
      async () => {
        const styleCircle = await StyleCircle.findByIdAndUpdate(
          circleId,
          updateData,
          { new: true }
        );
        
        if (!styleCircle) {
          throw new Error("Style circle not found");
        }
        return styleCircle;
      },
      () => {
        // Fallback: return mock updated circle
        const mockCircle = mockStyleCircles.find(circle => circle._id === circleId);
        if (!mockCircle) {
          throw new Error("Style circle not found");
        }
        return {
          ...mockCircle,
          ...updateData,
          updatedAt: new Date()
        };
      },
      "Update style circle"
    );
    
    if (result instanceof Error) {
      return res.status(404).json({ error: result.message });
    }
    
    res.json({
      success: true,
      data: result,
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
    
    const result = await executeWithFallback(
      async () => {
        const styleCircle = await StyleCircle.findByIdAndDelete(circleId);
        
        if (!styleCircle) {
          throw new Error("Style circle not found");
        }
        return styleCircle;
      },
      () => {
        // Fallback: check if mock circle exists
        const mockCircle = mockStyleCircles.find(circle => circle._id === circleId);
        if (!mockCircle) {
          throw new Error("Style circle not found");
        }
        return mockCircle;
      },
      "Delete style circle"
    );
    
    if (result instanceof Error) {
      return res.status(404).json({ error: result.message });
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
    
    const result = await executeWithFallback(
      async () => {
        const styleCircle = await StyleCircle.findById(circleId);
        
        if (!styleCircle) {
          throw new Error("Style circle not found");
        }
        
        // Check if user is already a member
        const isMember = styleCircle.members.some(member => member.userId === userId);
        if (isMember) {
          throw new Error("User is already a member of this circle");
        }
        
        // Add user to members
        styleCircle.members.push({
          userId,
          role,
          joinedAt: new Date()
        });
        
        styleCircle.memberCount = styleCircle.members.length;
        
        await styleCircle.save();
        return styleCircle;
      },
      () => {
        // Fallback: return mock updated circle
        const mockCircle = mockStyleCircles.find(circle => circle._id === circleId);
        if (!mockCircle) {
          throw new Error("Style circle not found");
        }
        
        // Check if user is already a member
        const isMember = mockCircle.members.some(member => member.userId === userId);
        if (isMember) {
          throw new Error("User is already a member of this circle");
        }
        
        return {
          ...mockCircle,
          members: [
            ...mockCircle.members,
            { userId, role, joinedAt: new Date() }
          ],
          memberCount: mockCircle.memberCount + 1,
          updatedAt: new Date()
        };
      },
      "Join style circle"
    );
    
    if (result instanceof Error) {
      return res.status(400).json({ error: result.message });
    }
    
    res.json({
      success: true,
      data: result,
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
    
    const result = await executeWithFallback(
      async () => {
        const styleCircle = await StyleCircle.findById(circleId);
        
        if (!styleCircle) {
          throw new Error("Style circle not found");
        }
        
        // Check if user is a member
        const memberIndex = styleCircle.members.findIndex(member => member.userId === userId);
        if (memberIndex === -1) {
          throw new Error("User is not a member of this circle");
        }
        
        // Remove user from members
        styleCircle.members.splice(memberIndex, 1);
        styleCircle.memberCount = styleCircle.members.length;
        
        await styleCircle.save();
        return styleCircle;
      },
      () => {
        // Fallback: return mock updated circle
        const mockCircle = mockStyleCircles.find(circle => circle._id === circleId);
        if (!mockCircle) {
          throw new Error("Style circle not found");
        }
        
        // Check if user is a member
        const memberIndex = mockCircle.members.findIndex(member => member.userId === userId);
        if (memberIndex === -1) {
          throw new Error("User is not a member of this circle");
        }
        
        const updatedMembers = [...mockCircle.members];
        updatedMembers.splice(memberIndex, 1);
        
        return {
          ...mockCircle,
          members: updatedMembers,
          memberCount: updatedMembers.length,
          updatedAt: new Date()
        };
      },
      "Leave style circle"
    );
    
    if (result instanceof Error) {
      return res.status(400).json({ error: result.message });
    }
    
    res.json({
      success: true,
      data: result,
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
    
    const result = await executeWithFallback(
      async () => {
        const styleCircle = await StyleCircle.findById(circleId);
        
        if (!styleCircle) {
          throw new Error("Style circle not found");
        }
        
        // Check if user is a member
        const isMember = styleCircle.members.some(member => member.userId === userId);
        if (!isMember) {
          throw new Error("Only members can post in this circle");
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
        return styleCircle;
      },
      () => {
        // Fallback: return mock updated circle
        const mockCircle = mockStyleCircles.find(circle => circle._id === circleId);
        if (!mockCircle) {
          throw new Error("Style circle not found");
        }
        
        // Check if user is a member
        const isMember = mockCircle.members.some(member => member.userId === userId);
        if (!isMember) {
          throw new Error("Only members can post in this circle");
        }
        
        const newPost = {
          _id: `post-${Date.now()}`,
          userId,
          content,
          images: images || [],
          likes: 0,
          comments: 0,
          createdAt: new Date()
        };
        
        return {
          ...mockCircle,
          posts: [...mockCircle.posts, newPost],
          postCount: mockCircle.postCount + 1,
          updatedAt: new Date()
        };
      },
      "Create circle post"
    );
    
    if (result instanceof Error) {
      if (result.message === "Style circle not found") {
        return res.status(404).json({ error: result.message });
      }
      return res.status(403).json({ error: result.message });
    }
    
    res.status(201).json({
      success: true,
      data: result,
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
    
    const result = await executeWithFallback(
      async () => {
        const styleCircle = await StyleCircle.findById(circleId);
        
        if (!styleCircle) {
          throw new Error("Style circle not found");
        }
        
        const limitNum = parseInt(limit as string);
        const pageNum = parseInt(page as string);
        const skip = (pageNum - 1) * limitNum;
        
        // Sort posts by createdAt descending (newest first)
        const posts = styleCircle.posts
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(skip, skip + limitNum);
        
        return {
          posts,
          total: styleCircle.posts.length,
          page: pageNum,
          limit: limitNum
        };
      },
      () => {
        // Fallback: return mock posts
        const mockCircle = mockStyleCircles.find(circle => circle._id === circleId);
        if (!mockCircle) {
          throw new Error("Style circle not found");
        }
        
        const limitNum = parseInt(limit as string);
        const pageNum = parseInt(page as string);
        const skip = (pageNum - 1) * limitNum;
        
        // Sort posts by createdAt descending (newest first)
        const posts = mockCircle.posts
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(skip, skip + limitNum);
        
        return {
          posts,
          total: mockCircle.posts.length,
          page: pageNum,
          limit: limitNum
        };
      },
      "Fetch circle posts"
    );
    
    if (result instanceof Error) {
      return res.status(404).json({ error: result.message });
    }
    
    res.json({
      success: true,
      data: result.posts,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        pages: Math.ceil(result.total / result.limit)
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
    
    const result = await executeWithFallback(
      async () => {
        const styleCircle = await StyleCircle.findById(circleId);
        
        if (!styleCircle) {
          throw new Error("Style circle not found");
        }
        
        // Find the post
        const postIndex = styleCircle.posts.findIndex(
          (post: any) => post._id.toString() === postId
        );
        
        if (postIndex === -1) {
          throw new Error("Post not found");
        }
        
        // Increment likes
        styleCircle.posts[postIndex].likes += 1;
        
        await styleCircle.save();
        return { likes: styleCircle.posts[postIndex].likes };
      },
      () => {
        // Fallback: return mock like increment
        const mockCircle = mockStyleCircles.find(circle => circle._id === circleId);
        if (!mockCircle) {
          throw new Error("Style circle not found");
        }
        
        // Find the post
        const post = mockCircle.posts.find((p: any) => p._id === postId);
        if (!post) {
          throw new Error("Post not found");
        }
        
        // Return incremented likes (mock)
        return { likes: post.likes + 1 };
      },
      "Like circle post"
    );
    
    if (result instanceof Error) {
      if (result.message === "Style circle not found") {
        return res.status(404).json({ error: result.message });
      }
      return res.status(404).json({ error: result.message });
    }
    
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Like circle post error:", error);
    res.status(500).json({ error: "Failed to like post" });
  }
};