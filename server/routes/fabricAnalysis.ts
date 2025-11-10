import { RequestHandler } from "express";
import { FabricAnalysis } from "../models";

// Create a new fabric analysis
export const createFabricAnalysis: RequestHandler = async (req, res) => {
  try {
    const { userId, clothingItemId, imageUrl, fabricType, components, sustainabilityScore, recommendations } = req.body;
    
    const fabricAnalysis = new FabricAnalysis({
      userId,
      clothingItemId: clothingItemId || null,
      imageUrl,
      fabricType,
      components: components || [],
      sustainabilityScore,
      recommendations: recommendations || [],
    });
    
    await fabricAnalysis.save();
    
    res.status(201).json({
      success: true,
      data: fabricAnalysis,
    });
  } catch (error) {
    console.error("Create fabric analysis error:", error);
    res.status(500).json({ error: "Failed to create fabric analysis" });
  }
};

// Get all fabric analyses for a user
export const getUserFabricAnalyses: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const fabricAnalyses = await FabricAnalysis.find({ userId })
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: fabricAnalyses,
    });
  } catch (error) {
    console.error("Fetch user fabric analyses error:", error);
    res.status(500).json({ error: "Failed to fetch fabric analyses" });
  }
};

// Get a specific fabric analysis by ID
export const getFabricAnalysis: RequestHandler = async (req, res) => {
  try {
    const { analysisId } = req.params;
    
    const fabricAnalysis = await FabricAnalysis.findById(analysisId);
    
    if (!fabricAnalysis) {
      return res.status(404).json({ error: "Fabric analysis not found" });
    }
    
    res.json({
      success: true,
      data: fabricAnalysis,
    });
  } catch (error) {
    console.error("Fetch fabric analysis error:", error);
    res.status(500).json({ error: "Failed to fetch fabric analysis" });
  }
};

// Update a fabric analysis
export const updateFabricAnalysis: RequestHandler = async (req, res) => {
  try {
    const { analysisId } = req.params;
    const updateData = req.body;
    
    const fabricAnalysis = await FabricAnalysis.findByIdAndUpdate(
      analysisId,
      updateData,
      { new: true }
    );
    
    if (!fabricAnalysis) {
      return res.status(404).json({ error: "Fabric analysis not found" });
    }
    
    res.json({
      success: true,
      data: fabricAnalysis,
    });
  } catch (error) {
    console.error("Update fabric analysis error:", error);
    res.status(500).json({ error: "Failed to update fabric analysis" });
  }
};

// Delete a fabric analysis
export const deleteFabricAnalysis: RequestHandler = async (req, res) => {
  try {
    const { analysisId } = req.params;
    
    const fabricAnalysis = await FabricAnalysis.findByIdAndDelete(analysisId);
    
    if (!fabricAnalysis) {
      return res.status(404).json({ error: "Fabric analysis not found" });
    }
    
    res.json({
      success: true,
      message: "Fabric analysis deleted successfully",
    });
  } catch (error) {
    console.error("Delete fabric analysis error:", error);
    res.status(500).json({ error: "Failed to delete fabric analysis" });
  }
};

// Simulate AI fabric analysis (in a real app, this would call an AI service)
export const analyzeFabric: RequestHandler = async (req, res) => {
  try {
    const { imageUrl } = req.body;
    
    // This would typically call an AI service to analyze the fabric
    // For now, we'll return mock data
    const mockAnalysis = {
      fabricType: "Cotton Blend",
      components: [
        {
          material: "Organic Cotton",
          percentage: 70,
          sustainabilityScore: 85,
          environmentalImpact: "low"
        },
        {
          material: "Polyester",
          percentage: 30,
          sustainabilityScore: 40,
          environmentalImpact: "high"
        }
      ],
      sustainabilityScore: 65,
      recommendations: [
        "This item is made with 70% organic cotton, which is a sustainable choice",
        "The 30% polyester content has a higher environmental impact",
        "Consider washing in cold water to extend the life of this garment",
        "When disposing, look for textile recycling programs in your area"
      ]
    };
    
    res.json({
      success: true,
      data: mockAnalysis,
    });
  } catch (error) {
    console.error("Analyze fabric error:", error);
    res.status(500).json({ error: "Failed to analyze fabric" });
  }
};