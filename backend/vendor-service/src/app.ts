import express from "express";
import vendorRoutes from "./controllers/vendorController";
import cors from "cors";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes with /api prefix
app.use("/api/vendors", vendorRoutes);

export default app;
