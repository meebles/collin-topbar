const mongoUtils = require("./mongoUtils");
const db = mongoUtils.getDB();
console.log("Db in mongoQueries file: ", db);

module.exports.getProducts = () => db.collection("products").find().limit(100).toArray();