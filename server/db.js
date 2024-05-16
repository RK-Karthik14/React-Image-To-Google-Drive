const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  password: "3228",
  host: "localhost",
  port: 5432,
  database: "test",
});

module.exports = pool;

