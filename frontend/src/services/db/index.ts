import { Client } from "pg";
import { getEnv } from "../../utils/getEnv";

export const postgres = new Client({
  connectionString: getEnv("POSTGRES_URL"),
  ssl: {
    rejectUnauthorized: false,
  },
});

postgres.connect();
