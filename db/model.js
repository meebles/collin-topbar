˜const Promise = require('bluebird');
const db = require('./index.js');

module.exports.getAllProducts = () => new Promise((resolve, reject) => {
  const sqlString = 'SELECT * FROM products;';

  db.query(sqlString, (err, data) => {
    if (err) {
      reject(err);
    } else {
      resolve(data);
    }
  });
});

module.exports.getHistory = () => new Promise((resolve, reject) => {
  const sqlString = 'SELECT * FROM history;';

  db.query(sqlString, (err, data) => {
    if (err) {
      reject(err);
    } else {
      resolve(data);
    }
  });
});

module.exports.clearHistory = () => new Promise((resolve, reject) => {
  const sqlString = 'DELETE FROM history;';

  db.query(sqlString, (err, data) => {
    if (err) {
      reject(err);
    } else {
      resolve(data);
    }
  });
});

module.exports.addHistory = (searchItem) => new Promise((resolve, reject) => {
  const sqlString = 'INSERT INTO history (searchItem) VALUES (?);';
  const options = [searchItem];

  db.query(sqlString, options, (err, data) => {
    if (err) {
      reject(err);
    } else {
      resolve(data);
    }
  });
});
