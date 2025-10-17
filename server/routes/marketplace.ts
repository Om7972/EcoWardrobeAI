import { RequestHandler } from "express";
import { SwapListing, SwapRequest } from "../models/index";

// Create swap listing
export const createSwapListing: RequestHandler = async (req, res) => {
  try {
    const {
      userId,
      itemId,
      title,
      description,
      condition,
      size,
      brand,
      category,
      imageUrl,
      desiredItems,
    } = req.body;

    if (!userId || !itemId || !title || !condition) {
      res.status(400).json({
        error: "Missing required fields",
      });
      return;
    }

    const listing = new SwapListing({
      userId,
      itemId,
      title,
      description,
      condition,
      size,
      brand,
      category,
      imageUrl,
      desiredItems: desiredItems || [],
      status: "active",
    });

    await listing.save();

    res.status(201).json({
      success: true,
      data: listing,
    });
  } catch (error) {
    console.error("Create listing error:", error);
    res.status(500).json({ error: "Failed to create listing" });
  }
};

// Get all active listings
export const getAllListings: RequestHandler = async (req, res) => {
  try {
    const { category, condition, sort } = req.query;

    const query: Record<string, any> = { status: "active" };

    if (category) query.category = category;
    if (condition) query.condition = condition;

    const listings = await SwapListing.find(query)
      .sort(sort === "recent" ? { createdAt: -1 } : { rating: -1 })
      .limit(50);

    res.json({
      success: true,
      count: listings.length,
      data: listings,
    });
  } catch (error) {
    console.error("Fetch listings error:", error);
    res.status(500).json({ error: "Failed to fetch listings" });
  }
};

// Get user's listings
export const getUserListings: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;

    const listings = await SwapListing.find({ userId }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      count: listings.length,
      data: listings,
    });
  } catch (error) {
    console.error("Fetch user listings error:", error);
    res.status(500).json({ error: "Failed to fetch listings" });
  }
};

// Get single listing
export const getListing: RequestHandler = async (req, res) => {
  try {
    const { listingId } = req.params;

    const listing = await SwapListing.findById(listingId).populate(
      "swapRequests"
    );

    if (!listing) {
      res.status(404).json({ error: "Listing not found" });
      return;
    }

    res.json({
      success: true,
      data: listing,
    });
  } catch (error) {
    console.error("Fetch listing error:", error);
    res.status(500).json({ error: "Failed to fetch listing" });
  }
};

// Create swap request
export const createSwapRequest: RequestHandler = async (req, res) => {
  try {
    const { listingId, fromUserId, offeredItemId, desiredItemId, message } =
      req.body;

    if (!listingId || !fromUserId || !offeredItemId || !desiredItemId) {
      res.status(400).json({
        error: "Missing required fields",
      });
      return;
    }

    const listing = await SwapListing.findById(listingId);
    if (!listing) {
      res.status(404).json({ error: "Listing not found" });
      return;
    }

    const request = new SwapRequest({
      listingId,
      fromUserId,
      toUserId: listing.userId,
      offeredItemId,
      desiredItemId,
      message,
      status: "pending",
    });

    await request.save();

    // Add to listing's swap requests
    listing.swapRequests.push(request._id);
    await listing.save();

    res.status(201).json({
      success: true,
      data: request,
    });
  } catch (error) {
    console.error("Create request error:", error);
    res.status(500).json({ error: "Failed to create swap request" });
  }
};

// Get swap requests for user
export const getUserSwapRequests: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;

    const requests = await SwapRequest.find({
      $or: [{ fromUserId: userId }, { toUserId: userId }],
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    console.error("Fetch requests error:", error);
    res.status(500).json({ error: "Failed to fetch requests" });
  }
};

// Accept swap request
export const acceptSwapRequest: RequestHandler = async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await SwapRequest.findByIdAndUpdate(
      requestId,
      { status: "accepted" },
      { new: true }
    );

    if (!request) {
      res.status(404).json({ error: "Request not found" });
      return;
    }

    res.json({
      success: true,
      data: request,
    });
  } catch (error) {
    console.error("Accept request error:", error);
    res.status(500).json({ error: "Failed to accept request" });
  }
};

// Reject swap request
export const rejectSwapRequest: RequestHandler = async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await SwapRequest.findByIdAndUpdate(
      requestId,
      { status: "rejected" },
      { new: true }
    );

    if (!request) {
      res.status(404).json({ error: "Request not found" });
      return;
    }

    res.json({
      success: true,
      data: request,
    });
  } catch (error) {
    console.error("Reject request error:", error);
    res.status(500).json({ error: "Failed to reject request" });
  }
};

// Rate listing
export const rateListing: RequestHandler = async (req, res) => {
  try {
    const { listingId } = req.params;
    const { rating, review } = req.body;

    if (rating < 1 || rating > 5) {
      res.status(400).json({ error: "Rating must be between 1 and 5" });
      return;
    }

    const listing = await SwapListing.findById(listingId);

    if (!listing) {
      res.status(404).json({ error: "Listing not found" });
      return;
    }

    // Update rating (simple average)
    const currentTotal = listing.rating * (listing.reviews.length || 1);
    listing.rating = (currentTotal + rating) / (listing.reviews.length + 1);

    if (review) {
      listing.reviews.push(review);
    }

    await listing.save();

    res.json({
      success: true,
      data: listing,
    });
  } catch (error) {
    console.error("Rate listing error:", error);
    res.status(500).json({ error: "Failed to rate listing" });
  }
};
