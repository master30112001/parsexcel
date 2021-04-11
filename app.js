const express = require("express");
const parsexcel = require("./index");
var app = express();

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/upload", function (req, res) {
  const result = parsexcel({
    path: "./uploads",
    doWhatever: () => console.log("worked"),
    req: req,
    res: res,
    deleteExcel: true,
  });

  console.log(result);

  res.sendFile(__dirname + "/haha.html");
});

app.listen("3000", function () {
  console.log("running on 3000...");
});
