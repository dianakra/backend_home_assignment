import { Pool } from "pg";
import { Vendor } from "../models/vendor";

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

export const addVendor = async (vendor: Vendor): Promise<Vendor> => {
  const client = await pool.connect();
  try {
    const { id, certifications, rating } = vendor;
    const result = await client.query(
      "INSERT INTO vendors (id, certifications, rating) VALUES ($1, $2, $3) RETURNING *",
      [id, certifications, rating]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
};

export const cleanup = async () => {
  await pool.end();
};
