const Mongo = require("mongodb").MongoClient;
const faker = require("faker");
faker.locale = "sv";

const url = "mongodb://localhost:27017";
const dbName = "meeblesTopbar";
// const reviewData = require("./allReviewData.js");
// const moreReviewData = require("./reviewDataGenerator.js");

const generateProducts = (num, count) => {
  let data = [];

  for (i = 1; i <= num; i++) {
    let product = {
      id: count + i,
      real_name: faker.commerce.product(),
      category: faker.commerce.department(),
      description: faker.lorem.words(),
      image_address: faker.image.image()
    };
    data.push(product);
  }

  return data;
};

async function seedDatabase(coll) {
  console.time("insertionTimer");
  let productCount = 0;

  for (var i = 1; i <= 100; i++) {
    let newData = generateProducts(100000, productCount);
    console.log(`${i}00000 records generated!`);
    productCount += 100000;
    

    try {
      let insertResult = await coll.insertMany(newData);
      let totalCount = await coll.countDocuments();
      console.log(`There are now ${totalCount} records in the collection.`);
    } catch (err) {
      console.error(err);
    }
  }

  console.timeEnd("insertionTimer");

  client.close();
}

const client = new Mongo(url, {
  useUnifiedTopology: true
});

client.connect(err => {
  if (err) {
    console.error(err);
    return;
  }
  console.log("Connected to database server!");

  const db = client.db(dbName);

  // doTestQueries(collection);
  // deleteAll(collection);
  // console.time("insertionTimer");
  const collection = db.collection("products");
  seedDatabase(collection);
});
