import express from "express";
import procurementRoutes from "./controllers/procurementController";
import cors from "cors";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes with /api prefix
app.use("/api/procurements", procurementRoutes);

export default app;
