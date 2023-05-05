const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();
app.set("view-engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

/////////////////////////////////////  Connecting to mongoose ////////////////////////////////////

let wikiSchema, Article;
async function main() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/wikiDB", {
      useNewUrlParser: true,
    });
    console.log("Connected");
    wikiSchema = new mongoose.Schema({
      title: String,
      content: String,
    });

    Article = mongoose.model("Article", wikiSchema);
  } catch (err) {
    console.log(err);
  }
}

main();

/////////////////////////////////////  Routing for /articles page  ////////////////////////////////////

app
  .route("/articles")
  .get(async (req, res) => {
    let pri = await Article.find();
    // console.log(pri);
    res.send(pri);
  })
  .post(async (req, res) => {
    let newArt = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    try {
      await newArt.save();
      res.send("Everything is OK");
    } catch (err) {
      res.send(err);
    }
  })
  .delete(async (req, res) => {
    try {
      await Article.deleteMany();
      res.send("correct");
    } catch (err) {
      res.send(err);
    }
  });

/////////////////////////////////////  Routing to the article subpage  ////////////////////////////////////

app
  .route("/articles/:root")
  .get(async (req, res) => {
    let root = req.params.root;
    try {
      let artFound = await Article.findOne({ title: root });
      res.send(artFound);
    } catch (err) {
      res.send(err);
    }
  })
  .put(async (req, res) => {
    let root = req.params.root;
    try {
      let artFound = await Article.findOneAndUpdate(
        { title: root },
        { title: req.body.title, content: req.body.content },
        { overwrite: true },
      );
      res.send(await Article.find());
    } catch (err) {
      res.send(err);
    }
  });

/////////////////////////////////////  Listening to port  ////////////////////////////////////

app.listen("3000", () => {
  console.log("Server started at port 3000.");
});
