import express, { Request, Response, NextFunction } from "express";
import {
  getProcurements,
  addProcurement,
  generateProcurments,
  getProcurementsByVendorData,
} from "../services/procurementService";
import { ProcurementStatus } from "../models/ProcurementStatus";
import { body, query, validationResult } from "express-validator";

const router = express.Router();

export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array().map((e) => e.msg) });
  }
  next();
};

// GET /api/procurements
router.get("/", async (req, res) => {
  try {
    const procurements = await getProcurements({});
    res.json(procurements);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Unknown error occurred" });
    }
  }
});

router.get(
  "/filter-by-quantity",
  [
    query("minQuantity")
      .notEmpty()
      .withMessage("Please provide minQuantity")
      .isNumeric()
      .withMessage("minQuantity must be numeric"),
    handleValidationErrors,
  ],
  async (req: Request<{}, {}, {}, { minQuantity: number }>, res: Response) => {
    try {
      const { minQuantity } = req.query;

      const procurements = await getProcurements({
        minQuantity,
      });
      res.json(procurements);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Unknown error occurred" });
      }
    }
  }
);

router.get(
  "/filter-by-certification-and-rating",
  [
    query("minVendorRating")
      .notEmpty()
      .withMessage("Please provide minVendorRating")
      .isNumeric()
      .withMessage("minVendorRating must be numeric"),
    query("isoCertification")
      .notEmpty()
      .withMessage("Please provide isoCertification"),
    handleValidationErrors,
  ],
  async (
    req: Request<
      {},
      {},
      {},
      { isoCertification: string; minVendorRating: number }
    >,
    res: Response
  ) => {
    try {
      const { isoCertification, minVendorRating } = req.query;
      const procurements = await getProcurementsByVendorData({
        minVendorRating,
        isoCertification,
      });
      res.json(procurements);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Unknown error occurred" });
      }
    }
  }
);

router.get(
  "/filter-by-status",
  [
    query("status")
      .notEmpty()
      .withMessage("Please provide status")
      .isIn(Object.values(ProcurementStatus))
      .withMessage(
        "status must be one of the following:open,in-review,approved,rejected"
      ),
    handleValidationErrors,
  ],
  async (
    req: Request<{}, {}, {}, { status: ProcurementStatus }>,
    res: Response
  ) => {
    try {
      const { status } = req.query;
      const procurements = await getProcurements({
        status: status as ProcurementStatus,
      });
      res.json(procurements);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Unknown error occurred" });
      }
    }
  }
);

router.post(
  "/generate",
  [
    body("vendorId").notEmpty().withMessage("vendorId required"),
    handleValidationErrors,
  ],
  async (req: Request<{}, {}, { vendorId: string }, {}>, res: Response) => {
    try {
      const { vendorId } = req.body;
      const result = await generateProcurments(vendorId);
      res.json(result);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error creating procurement:", error);
        res.status(500).json({ error: "Internal server error" });
      } else {
        res.status(500).json({ error: "Unknown error occurred" });
      }
    }
  }
);

// POST /api/procurements
router.post("/", async (req, res) => {
  try {
    const procurement = await addProcurement({
      ...req.body,
      status: ProcurementStatus.OPEN,
    });
    res.status(201).json(procurement);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error creating procurement:", error);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.status(500).json({ error: "Unknown error occurred" });
    }
  }
});

export default router;
