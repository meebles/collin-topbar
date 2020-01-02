const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoUtils = require("../mongodb/mongoUtils.js");
const db = require("../postgres");
const mountRoutes = require("../routes");
// const mongoQueries = require("../mongodb/mongoQueries.js");
// const model = require('../db/model');

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static("dist"));

// --- POSTGRES ROUTES

app.get("/pgtest/:id", (req, res) => {
  const id = req.params.id;
  db.testPG(id, result => res.send(result))
});

app.get("/handskars", (req, res) => {
  db.getHandskar(result => res.send(result))
});

// --- TOM'S OLD ROUTES

app.get("/sources/bundle", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist", "bundle.js"));
});

app.get("/sources/styles", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist", "stylesheet.css"));
});

app.get("/sources/fonts/NotoSans-Regular.tff", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../dist", "/fonts", "NotoSans-Regular.tff")
  );
});

app.get("/sources/fonts/NotoSans-Bold.tff", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/fonts/NotoSans-Bold.tff"));
});

// --- MONGO ROUTES

mongoUtils
  .connectToServer()
  .then(result => {
    app.get("/hats", (req, res) => {
      mongoUtils
        .getHats()
        .then(data => res.send(data))
        .catch(err => res.send(err));
    });

    app.get("/products", (req, res) => {
      mongoUtils
        .getProducts()
        .then(data => {
          res.send(data);
        })
        .catch(err => {
          res.send(err);
        });
    });

    app.get("/history", (req, res) => {
      mongoUtils
        .getHistory()
        .then(data => {
          res.send(data);
        })
        .catch(err => {
          res.send(err);
        });
    });

    app.post("/history", (req, res) => {
      mongoUtils
        .addHistory(req.body.searchItem)
        .then(data => {
          res.send(data);
        })
        .catch(err => {
          res.send(err);
        });
    });

    app.delete("/history", (req, res) => {
      mongoUtils
        .clearHistory()
        .then(data => {
          res.send(data);
        })
        .catch(err => {
          res.send(err);
        });
    });

    app.listen(3025, err => {
      if (err) {
        console.log(err);
      } else {
        console.log("Listening on port 3025...");
      }
    });
  })
  .catch(err => {
    console.error(err);
  });
