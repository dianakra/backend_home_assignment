import { Pool } from "pg";
import { Procurement } from "../models/procurement";
import { ProcurementStatus } from "../models/ProcurementStatus";

const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "procurement_db",
  password: process.env.DB_PASSWORD || "password",
  port: parseInt(process.env.DB_PORT || "5432"),
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

export const getProcurements = async (): Promise<Procurement[]> => {
  const client = await pool.connect();
  try {
    const result = await client.query("SELECT * FROM procurements");
    return result.rows;
  } finally {
    client.release();
  }
};

export const addProcurement = async (
  procurement: Partial<Procurement>
): Promise<Procurement> => {
  const client = await pool.connect();
  try {
    const { title, description, items, status } = procurement;
    const result = await client.query(
      "INSERT INTO procurements (title, description, items, status, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [
        title,
        description,
        JSON.stringify(items),
        status || ProcurementStatus.OPEN,
        new Date(),
      ]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
};

export const cleanup = async () => {
  await pool.end();
};
