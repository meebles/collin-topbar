const { Pool } = require("pg");

const pool = new Pool({
  user: "collin",
  host: "ec2-18-219-128-13.us-east-2.compute.amazonaws.com",
  database: "collin",
  password: "hau boue",
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
      .catch(err => callback(err)),
  getKnid: callback =>
    pool
      .query("SELECT * FROM products WHERE real_name = 'Vermicious Knid'")
      .then(data => callback(data))
      .catch(err => callback(err))
};
