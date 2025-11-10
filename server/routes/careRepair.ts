import { RequestHandler } from "express";
import { CareInstruction } from "../models/CareInstruction";
import { RepairLog } from "../models/RepairLog";
import { ServiceProvider } from "../models/ServiceProvider";

// Get care instructions for a clothing item
export const getCareInstructions: RequestHandler = async (req, res) => {
  try {
    const { itemId } = req.params;
    
    const instructions = await CareInstruction.findOne({ clothingItemId: itemId });
    
    if (!instructions) {
      return res.status(404).json({ error: "Care instructions not found" });
    }
    
    res.json({
      success: true,
      data: instructions,
    });
  } catch (error) {
    console.error("Fetch care instructions error:", error);
    res.status(500).json({ error: "Failed to fetch care instructions" });
  }
};

// Create or update care instructions for a clothing item
export const upsertCareInstructions: RequestHandler = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { fabricType, washingInstructions, dryingInstructions, ironingInstructions, specialCareNotes } = req.body;
    
    const instructions = await CareInstruction.findOneAndUpdate(
      { clothingItemId: itemId },
      { 
        clothingItemId: itemId,
        fabricType,
        washingInstructions,
        dryingInstructions,
        ironingInstructions,
        specialCareNotes
      },
      { new: true, upsert: true }
    );
    
    res.json({
      success: true,
      data: instructions,
    });
  } catch (error) {
    console.error("Upsert care instructions error:", error);
    res.status(500).json({ error: "Failed to save care instructions" });
  }
};

// Get repair history for a user's clothing item
export const getRepairHistory: RequestHandler = async (req, res) => {
  try {
    const { userId, itemId } = req.params;
    
    const repairLogs = await RepairLog.find({ 
      userId,
      clothingItemId: itemId 
    }).sort({ date: -1 });
    
    res.json({
      success: true,
      data: repairLogs,
    });
  } catch (error) {
    console.error("Fetch repair history error:", error);
    res.status(500).json({ error: "Failed to fetch repair history" });
  }
};

// Add a repair log entry
export const addRepairLog: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    const { clothingItemId, repairType, description, date, cost, serviceProvider, notes } = req.body;
    
    const repairLog = new RepairLog({
      userId,
      clothingItemId,
      repairType,
      description,
      date: new Date(date),
      cost,
      serviceProvider,
      notes,
    });
    
    await repairLog.save();
    
    res.status(201).json({
      success: true,
      data: repairLog,
    });
  } catch (error) {
    console.error("Add repair log error:", error);
    res.status(500).json({ error: "Failed to add repair log" });
  }
};

// Update a repair log entry
export const updateRepairLog: RequestHandler = async (req, res) => {
  try {
    const { logId } = req.params;
    const updateData = req.body;
    
    const repairLog = await RepairLog.findByIdAndUpdate(
      logId,
      updateData,
      { new: true }
    );
    
    if (!repairLog) {
      return res.status(404).json({ error: "Repair log not found" });
    }
    
    res.json({
      success: true,
      data: repairLog,
    });
  } catch (error) {
    console.error("Update repair log error:", error);
    res.status(500).json({ error: "Failed to update repair log" });
  }
};

// Delete a repair log entry
export const deleteRepairLog: RequestHandler = async (req, res) => {
  try {
    const { logId } = req.params;
    
    const repairLog = await RepairLog.findByIdAndDelete(logId);
    
    if (!repairLog) {
      return res.status(404).json({ error: "Repair log not found" });
    }
    
    res.json({
      success: true,
      message: "Repair log deleted successfully",
    });
  } catch (error) {
    console.error("Delete repair log error:", error);
    res.status(500).json({ error: "Failed to delete repair log" });
  }
};

// Get nearby service providers
export const getNearbyServices: RequestHandler = async (req, res) => {
  try {
    const { latitude, longitude, type, radius = "10" } = req.query;
    
    // Convert to numbers
    const lat = parseFloat(latitude as string);
    const lng = parseFloat(longitude as string);
    const rad = parseFloat(radius as string);
    
    // Validate coordinates
    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({ error: "Valid latitude and longitude are required" });
    }
    
    // Find service providers within radius (simplified calculation)
    const serviceProviders = await ServiceProvider.find({
      latitude: { $gte: lat - (rad / 111), $lte: lat + (rad / 111) },
      longitude: { $gte: lng - (rad / (111 * Math.cos(lat * Math.PI / 180))), $lte: lng + (rad / (111 * Math.cos(lat * Math.PI / 180))) },
      ...(type && { type }),
    }).limit(20);
    
    res.json({
      success: true,
      data: serviceProviders,
    });
  } catch (error) {
    console.error("Fetch nearby services error:", error);
    res.status(500).json({ error: "Failed to fetch nearby services" });
  }
};

// Get all service providers
export const getAllServices: RequestHandler = async (req, res) => {
  try {
    const { type } = req.query;
    
    const serviceProviders = await ServiceProvider.find(
      type ? { type } : {}
    ).limit(100);
    
    res.json({
      success: true,
      data: serviceProviders,
    });
  } catch (error) {
    console.error("Fetch all services error:", error);
    res.status(500).json({ error: "Failed to fetch services" });
  }
};

// Add a new service provider
export const addServiceProvider: RequestHandler = async (req, res) => {
  try {
    const { name, type, address, latitude, longitude, phone, website, specialties } = req.body;
    
    const serviceProvider = new ServiceProvider({
      name,
      type,
      address,
      latitude,
      longitude,
      phone,
      website,
      specialties,
    });
    
    await serviceProvider.save();
    
    res.status(201).json({
      success: true,
      data: serviceProvider,
    });
  } catch (error) {
    console.error("Add service provider error:", error);
    res.status(500).json({ error: "Failed to add service provider" });
  }
};