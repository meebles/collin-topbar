const { Pool } = require("pg");

const pool = new Pool({
  user: "collinsnyder",
  host: "localhost",
  database: "meeblestopbar",
  password: "postgres",
  port: 5432
});

module.exports = {
  testPG: (id, callback) =>
    pool
      .query("SELECT * FROM products WHERE id = $1", [id])
      .then(data => callback(data.rows))
      .catch(err => callback(err)),
  getHandskar: callback =>
    pool
      .query(
        "SELECT * FROM products WHERE real_name = 'Handskar' AND id > 9000000 LIMIT 10"
      )
      .then(data => callback(data.rows))
      .catch(err => callback(err))
};
