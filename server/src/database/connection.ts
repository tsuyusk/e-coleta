import knex from "knex";
import path from "path";

const connection = knex({
  client: "sqlite3",
  connection: {
    filename: path.resolve(__dirname, "database.sqlite"),
  },
  pool: {
    min: 0,
    max: 30,
  },
  useNullAsDefault: true,
});

export default connection;

/**
 * Migrations = Histórico do banco de dados
 * pessoa 1 : create table points
 * pessoa 2 : create table users
 * (pessoa 1 não tem users e pesosa 2 não tem points)
 */
