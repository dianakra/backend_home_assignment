import express, { Request, Response } from "express";
import { addProcurement } from "../services/procurementService";
import { ProcurementStatus } from "../models/ProcurementStatus";
import { body } from "express-validator";
import { handleValidationErrors } from "./procurementController";
import { addVendor } from "../services/vendorsService";

const router = express.Router();

router.post(
  "/",
  [
    body("id").notEmpty().withMessage("vendorId required"),
    body("certifications")
      .notEmpty()
      .withMessage("certifications required")
      .isArray()
      .withMessage("certifications must be an array"),
    body("rating")
      .notEmpty()
      .withMessage("rating required")
      .isNumeric()
      .withMessage("rating must be numeric"),
    handleValidationErrors,
  ],
  async (
    req: Request<
      {},
      {},
      { id: string; certifications: string[]; rating: number },
      {}
    >,
    res: Response
  ) => {
    try {
      const vendor = await addVendor(req.body);
      res.status(201).json(vendor);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error creating vendor:", error);
        res.status(500).json({ error: "Internal server error" });
      } else {
        res.status(500).json({ error: "Unknown error occurred" });
      }
    }
  }
);

export default router;
