const { Pool } = require("pg");
const dbConfig = require("../env/dbconfig.js");

const pool = new Pool(dbConfig);

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
