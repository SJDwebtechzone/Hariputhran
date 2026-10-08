const { Pool } = require("pg");

const poolConfig = {
  max: parseInt(process.env.DB_POOL_MAX || "10", 10),
  idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT_MS || "30000", 10),
  connectionTimeoutMillis: parseInt(process.env.DB_CONNECT_TIMEOUT_MS || "10000", 10),
};

if (process.env.DATABASE_URL) {
  poolConfig.connectionString = process.env.DATABASE_URL;
} else {
  poolConfig.host = process.env.DB_HOST || "localhost";
  poolConfig.port = parseInt(process.env.DB_PORT || "5432", 10);
  poolConfig.user = process.env.DB_USER || "postgres";
  poolConfig.password = process.env.DB_PASSWORD || "";
  poolConfig.database = process.env.DB_NAME || "Hariputhiran";
}

if (process.env.DB_SSL === "true" || process.env.DATABASE_URL?.includes("sslmode=require")) {
  poolConfig.ssl = {
    rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED === "true",
  };
}

const pool = new Pool(poolConfig);

module.exports = pool;

