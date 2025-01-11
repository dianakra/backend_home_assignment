import express from "express";
import { checkVendorData } from "../models/vendor";
import {
  getVendors,
  addVendor,
  getVendorById,
} from "../services/vendorService";
import axios from "axios";

const router = express.Router();

// Get all vendors
router.get("/", async (req, res) => {
  try {
    const vendors = await getVendors();
    res.json(vendors);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Unknown error occurred" });
    }
  }
});

// Add a new vendor
router.post("/", async (req, res) => {
  try {
    const validationError = checkVendorData(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }
    const newVendor = await addVendor(req.body);
    await axios.post("http://procurement-service:3002/api/vendors", {
      id: newVendor.id,
      certifications: newVendor.certifications,
      rating: newVendor.rating,
    });
    res.status(201).json(newVendor);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Unknown error occurred" });
    }
  }
});

router.post("/:id/procurements", async (req, res) => {
  try {
    const { id } = req.params;
    const vendor = await getVendorById(id);

    if (vendor.length === 0) {
      res.status(404).json({ message: "Vendor not found" });
    } else {
      const { data } = await axios.post(
        "http://procurement-service:3002/api/procurements/generate",
        {
          vendorId: vendor[0].id,
        }
      );
      res.json(data);
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Unknown error occurred" });
    }
  }
});

export default router;
