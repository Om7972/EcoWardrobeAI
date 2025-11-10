import { RequestHandler } from "express";
import { MarketplaceListing, SwapRequest } from "../models";

// Create a new marketplace listing
export const createListing: RequestHandler = async (req, res) => {
  try {
    const { 
      userId, 
      clothingItemId, 
      title, 
      description, 
      price, 
      condition, 
      category, 
      size, 
      brand, 
      color, 
      material, 
      images, 
      listingType,
      ecoScore
    } = req.body;
    
    const listing = new MarketplaceListing({
      userId,
      clothingItemId,
      title,
      description,
      price,
      condition,
      category,
      size,
      brand,
      color,
      material,
      images: images || [],
      listingType,
      ecoScore: ecoScore || 0,
      views: 0,
      likes: 0,
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

// Get all active marketplace listings
export const getAllListings: RequestHandler = async (req, res) => {
  try {
    const { category, size, condition, minPrice, maxPrice, listingType, search } = req.query;
    
    // Build filter object
    const filter: any = { status: "active" };
    
    if (category) filter.category = category;
    if (size) filter.size = size;
    if (condition) filter.condition = condition;
    if (listingType) filter.listingType = listingType;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
      ];
    }
    
    const listings = await MarketplaceListing.find(filter)
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.json({
      success: true,
      data: listings,
    });
  } catch (error) {
    console.error("Fetch listings error:", error);
    res.status(500).json({ error: "Failed to fetch listings" });
  }
};

// Get a specific listing by ID
export const getListing: RequestHandler = async (req, res) => {
  try {
    const { listingId } = req.params;
    
    const listing = await MarketplaceListing.findById(listingId);
    
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }
    
    // Increment view count
    listing.views += 1;
    await listing.save();
    
    res.json({
      success: true,
      data: listing,
    });
  } catch (error) {
    console.error("Fetch listing error:", error);
    res.status(500).json({ error: "Failed to fetch listing" });
  }
};

// Get listings by user ID
export const getUserListings: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const listings = await MarketplaceListing.find({ userId })
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: listings,
    });
  } catch (error) {
    console.error("Fetch user listings error:", error);
    res.status(500).json({ error: "Failed to fetch user listings" });
  }
};

// Update a listing
export const updateListing: RequestHandler = async (req, res) => {
  try {
    const { listingId } = req.params;
    const updateData = req.body;
    
    const listing = await MarketplaceListing.findByIdAndUpdate(
      listingId,
      updateData,
      { new: true }
    );
    
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }
    
    res.json({
      success: true,
      data: listing,
    });
  } catch (error) {
    console.error("Update listing error:", error);
    res.status(500).json({ error: "Failed to update listing" });
  }
};

// Delete a listing
export const deleteListing: RequestHandler = async (req, res) => {
  try {
    const { listingId } = req.params;
    
    const listing = await MarketplaceListing.findByIdAndDelete(listingId);
    
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }
    
    res.json({
      success: true,
      message: "Listing deleted successfully",
    });
  } catch (error) {
    console.error("Delete listing error:", error);
    res.status(500).json({ error: "Failed to delete listing" });
  }
};

// Create a swap request
export const createSwapRequest: RequestHandler = async (req, res) => {
  try {
    const { fromUserId, toUserId, fromListingId, toListingId, message } = req.body;
    
    const swapRequest = new SwapRequest({
      fromUserId,
      toUserId,
      fromListingId,
      toListingId,
      message,
    });
    
    await swapRequest.save();
    
    res.status(201).json({
      success: true,
      data: swapRequest,
    });
  } catch (error) {
    console.error("Create swap request error:", error);
    res.status(500).json({ error: "Failed to create swap request" });
  }
};

// Get swap requests for a user
export const getUserSwapRequests: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const swapRequests = await SwapRequest.find({
      $or: [{ fromUserId: userId }, { toUserId: userId }]
    })
    .sort({ createdAt: -1 })
    .populate("fromListingId")
    .populate("toListingId");
    
    res.json({
      success: true,
      data: swapRequests,
    });
  } catch (error) {
    console.error("Fetch swap requests error:", error);
    res.status(500).json({ error: "Failed to fetch swap requests" });
  }
};

// Accept a swap request
export const acceptSwapRequest: RequestHandler = async (req, res) => {
  try {
    const { requestId } = req.params;
    
    const swapRequest = await SwapRequest.findByIdAndUpdate(
      requestId,
      { status: "accepted" },
      { new: true }
    );
    
    if (!swapRequest) {
      return res.status(404).json({ error: "Swap request not found" });
    }
    
    // Update listings status
    await MarketplaceListing.updateMany(
      { 
        _id: { $in: [swapRequest.fromListingId, swapRequest.toListingId].filter(Boolean) }
      },
      { status: "swapped" }
    );
    
    res.json({
      success: true,
      data: swapRequest,
    });
  } catch (error) {
    console.error("Accept swap request error:", error);
    res.status(500).json({ error: "Failed to accept swap request" });
  }
};

// Reject a swap request
export const rejectSwapRequest: RequestHandler = async (req, res) => {
  try {
    const { requestId } = req.params;
    
    const swapRequest = await SwapRequest.findByIdAndUpdate(
      requestId,
      { status: "rejected" },
      { new: true }
    );
    
    if (!swapRequest) {
      return res.status(404).json({ error: "Swap request not found" });
    }
    
    res.json({
      success: true,
      data: swapRequest,
    });
  } catch (error) {
    console.error("Reject swap request error:", error);
    res.status(500).json({ error: "Failed to reject swap request" });
  }
};

// Mark a swap as completed
export const completeSwap: RequestHandler = async (req, res) => {
  try {
    const { requestId } = req.params;
    
    const swapRequest = await SwapRequest.findByIdAndUpdate(
      requestId,
      { status: "completed" },
      { new: true }
    );
    
    if (!swapRequest) {
      return res.status(404).json({ error: "Swap request not found" });
    }
    
    res.json({
      success: true,
      data: swapRequest,
    });
  } catch (error) {
    console.error("Complete swap error:", error);
    res.status(500).json({ error: "Failed to complete swap" });
  }
};

// Like a listing
export const likeListing: RequestHandler = async (req, res) => {
  try {
    const { listingId } = req.params;
    
    const listing = await MarketplaceListing.findByIdAndUpdate(
      listingId,
      { $inc: { likes: 1 } },
      { new: true }
    );
    
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }
    
    res.json({
      success: true,
      data: { likes: listing.likes },
    });
  } catch (error) {
    console.error("Like listing error:", error);
    res.status(500).json({ error: "Failed to like listing" });
  }
};