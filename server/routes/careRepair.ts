import { RequestHandler } from "express";
import {
  getCareLabel,
  generateRepairLog,
  searchNearbyServices,
  getLocalServices,
} from "../services/careRepairService";

export const getCareInstructions: RequestHandler = async (req, res) => {
  try {
    const { fabricType } = req.query;

    if (!fabricType) {
      res.status(400).json({
        error: "fabricType is required",
      });
      return;
    }

    const careLabel = getCareLabel(String(fabricType));

    res.json({
      success: true,
      data: careLabel,
    });
  } catch (error) {
    console.error("Care instructions error:", error);
    res.status(500).json({ error: "Failed to fetch care instructions" });
  }
};

export const getRepairHistory: RequestHandler = async (req, res) => {
  try {
    const { garmentId, garmentName } = req.query;

    if (!garmentName) {
      res.status(400).json({
        error: "garmentName is required",
      });
      return;
    }

    const repairLogs = generateRepairLog(
      String(garmentId) || "default",
      String(garmentName)
    );

    res.json({
      success: true,
      count: repairLogs.length,
      data: repairLogs,
    });
  } catch (error) {
    console.error("Repair history error:", error);
    res.status(500).json({ error: "Failed to fetch repair history" });
  }
};

export const getNearbyServices: RequestHandler = async (req, res) => {
  try {
    const { serviceType, maxDistance } = req.query;

    const services = searchNearbyServices(
      String(serviceType) || "tailor",
      maxDistance ? parseInt(String(maxDistance)) : 5
    );

    res.json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    console.error("Nearby services error:", error);
    res.status(500).json({ error: "Failed to fetch services" });
  }
};

export const getAllServices: RequestHandler = async (req, res) => {
  try {
    const { type } = req.query;

    const services = getLocalServices(
      type as "tailor" | "cobbler" | "cleaner" | "leather-repair" | undefined
    );

    res.json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    console.error("All services error:", error);
    res.status(500).json({ error: "Failed to fetch services" });
  }
};
