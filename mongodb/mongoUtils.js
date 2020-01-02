const Promise = require("bluebird");
const Mongo = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017";
const dbName = "meeblesTopbar";

let _db;

module.exports = {
  connectToServer: () =>
    Mongo.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
      .then(client => {
        console.log("Connected to server!");
        _db = client.db(dbName);
      })
      .catch(err => console.error),

  getDB: () => {
    return _db;
  },

  getProducts: () =>
    _db
      .collection("products")
      .find({}, { real_name: 1, category: 1, description: 1, image_address: 1 })
      .limit(1)
      .toArray(),

  getHistory: () =>
    _db
      .collection("history")
      .find({})
      .toArray(),

  addHistory: searchItem => _db.collection("history").insertOne({ searchItem }),

  clearHistory: () => _db.collection("history").deleteMany({}),

  getHats: () =>
    _db
      .collection("products")
      .find(
        { real_name: "Hat", id: { $gt: 9000000} },
        { real_name: 1, category: 1, description: 1, image_address: 1 }
      )
      .limit(10)
      .toArray()
};

// client.connect(err => {
//   if (err) {
//     console.error(err);
//     return;
//   }
//   console.log("Connected to database server!");

//   const db = client.db(dbName);

//   // doTestQueries(collection);
//   // deleteAll(collection);
//   // console.time("insertionTimer");
//   const collection = db.collection("products");
//   seedDatabase(collection);
// });
