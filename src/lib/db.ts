import { Pool } from "pg";

const pool = new Pool({
  database: import.meta.env.VITE_PG_DBNAME,
  user: import.meta.env.VITE_PG_USERNAME,
  host: import.meta.env.VITE_PG_HOST,
  port: Number(import.meta.env.VITE_PG_PORT || 5432)
});

/**
 * Connect to the PostgreSQL database.
 * @returns {Promise<import("pg").Client>} A new client from the connection pool.
 */

export const connectToDB = async () => await pool.connect();