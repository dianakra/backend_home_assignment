import { Pool } from "pg";
import { Vendor } from "../models/vendor";

const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "vendor_db",
  password: process.env.DB_PASSWORD || "password",
  port: Number(process.env.DB_PORT) || 5432,
});

export const getVendors = async (): Promise<Vendor[]> => {
  const result = await pool.query("SELECT * FROM vendors");
  return result.rows;
};

export const addVendor = async (vendor: Partial<Vendor>): Promise<Vendor> => {
  const { name, location, certifications, rating } = vendor;
  const result = await pool.query(
    "INSERT INTO vendors (name, location, certifications, rating) VALUES ($1, $2, $3, $4) RETURNING *",
    [name, location, certifications || [], rating || 0]
  );
  return result.rows[0];
};
