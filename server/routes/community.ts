import { RequestHandler } from "express";
import {
  getStyleCircles,
  getStyleCircleById,
  getCirclePosts,
  getAllPosts,
  getBadges,
  getUserBadges,
} from "../services/styleCommunityService";

export const getCircles: RequestHandler = async (req, res) => {
  try {
    const circles = getStyleCircles();

    res.json({
      success: true,
      count: circles.length,
      data: circles,
    });
  } catch (error) {
    console.error("Get circles error:", error);
    res.status(500).json({ error: "Failed to fetch style circles" });
  }
};

export const getCircleById: RequestHandler = async (req, res) => {
  try {
    const { circleId } = req.params;

    if (!circleId) {
      res.status(400).json({ error: "circleId is required" });
      return;
    }

    const circle = getStyleCircleById(circleId);

    if (!circle) {
      res.status(404).json({ error: "Style circle not found" });
      return;
    }

    res.json({
      success: true,
      data: circle,
    });
  } catch (error) {
    console.error("Get circle error:", error);
    res.status(500).json({ error: "Failed to fetch style circle" });
  }
};

export const getCircleFeed: RequestHandler = async (req, res) => {
  try {
    const { circleId } = req.params;

    if (!circleId) {
      res.status(400).json({ error: "circleId is required" });
      return;
    }

    const posts = getCirclePosts(circleId);

    res.json({
      success: true,
      count: posts.length,
      data: posts,
    });
  } catch (error) {
    console.error("Get circle feed error:", error);
    res.status(500).json({ error: "Failed to fetch circle feed" });
  }
};

export const getCommunityFeed: RequestHandler = async (req, res) => {
  try {
    const posts = getAllPosts();

    res.json({
      success: true,
      count: posts.length,
      data: posts,
    });
  } catch (error) {
    console.error("Get community feed error:", error);
    res.status(500).json({ error: "Failed to fetch community feed" });
  }
};

export const getAvailableBadges: RequestHandler = async (req, res) => {
  try {
    const badges = getBadges();

    res.json({
      success: true,
      count: badges.length,
      data: badges,
    });
  } catch (error) {
    console.error("Get badges error:", error);
    res.status(500).json({ error: "Failed to fetch badges" });
  }
};

export const getUserBadgesHandler: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      res.status(400).json({ error: "userId is required" });
      return;
    }

    const badges = getUserBadges(userId);

    res.json({
      success: true,
      count: badges.length,
      data: badges,
    });
  } catch (error) {
    console.error("Get user badges error:", error);
    res.status(500).json({ error: "Failed to fetch user badges" });
  }
};
