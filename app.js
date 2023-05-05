const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();
app.set("view-engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

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

app.listen("3000", () => {
  console.log("Server started at port 3000.");
});
