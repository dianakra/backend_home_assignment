import { Pool } from "pg";
import { Procurement } from "../models/procurement";
import { ProcurementStatus } from "../models/ProcurementStatus";
import axios from "axios";

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

export const getProcurements = async (params: {
  minQuantity?: number;
  status?: ProcurementStatus;
}): Promise<Procurement[]> => {
  const client = await pool.connect();
  const { status, minQuantity } = params;

  let query = `SELECT 
        id,
        title,
        description,
        items,
        status,
        createdat AS "createdAt"
        FROM procurements`;

  let whereConditions: string[] = [];

  if (status) {
    whereConditions.push(`status = $${status}`);
  }

  if (minQuantity) {
    whereConditions.push(`EXISTS (
        SELECT 1
        FROM jsonb_array_elements(items::jsonb) AS item
        WHERE (item->>'quantity')::int > ${minQuantity}
    )`);
  }

  if (whereConditions.length > 0) {
    query += " WHERE " + whereConditions.join(" AND ");
  }

  try {
    const result = await client.query(query);
    return result.rows;
  } finally {
    client.release();
  }
};

export const getProcurementsByVendorData = async (params: {
  minVendorRating: number;
  isoCertification: string;
}) => {
  const { minVendorRating, isoCertification } = params;
  const client = await pool.connect();

  try {
    const result = await client.query(`SELECT 
        p.id As id,
        title,
        description,
        items,
        status,
        createdat AS "createdAt"
        FROM procurements p
        JOIN vendors ON p.vendorid = vendors.id
        WHERE rating >= ${minVendorRating} AND '${isoCertification}' = ANY(certifications)`);
    return result.rows;
  } finally {
    client.release();
  }
};

export const generateProcurments = async (
  vendorId: string
): Promise<Procurement[]> => {
  const { data } = await axios.get(
    "https://a51164b0-afe6-4682-9b32-1e570ed9049f.mock.pstmn.io/product"
  );

  const items = new Array(5).fill(0).map((_, index: number) => ({
    title: `Request ${String.fromCharCode(65 + index)}`,
    description: `Need ${data.amount} units of ${data.name}`,
    items: [{ itemName: data.name, quantity: data.amount }],
    vendorId,
  }));

  const result = await Promise.all(
    items.map((item) => addProcurement({ ...item }))
  );

  return result;
};

export const addProcurement = async (
  procurement: Partial<Procurement>
): Promise<Procurement> => {
  const client = await pool.connect();
  try {
    const { title, description, items, status, vendorId } = procurement;
    const result = await client.query(
      "INSERT INTO procurements (title, description, items, status, createdAt, vendorId) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [
        title,
        description,
        JSON.stringify(items || []),
        status || ProcurementStatus.OPEN,
        new Date(),
        vendorId,
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
