const express = require("express");
var bodyParser = require("body-parser");
var multer = require("multer");
var xlstojson = require("xls-to-json-lc");
var xlsxtojson = require("xlsx-to-json-lc");

var app = express();
app.use(bodyParser.json());

/* parameters in options - 
1. path- 
2. 
*/

// options = {
//   path: "./uploads",
//   doWhatever: () => console.log("worked"),
// };

var resultToReturn;

const parsexcel = ({ path, doWhatever, req, res }) => {
  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path); // path input from user
    },
    filename: function (req, file, cb) {
      var datetimestamp = Date.now();
      cb(
        null,
        file.fieldname +
          "-" +
          datetimestamp +
          "." +
          file.originalname.split(".")[file.originalname.split(".").length - 1]
      );
    },
  });

  var upload = multer({
    //multer settings
    storage: storage,
    fileFilter: function (req, file, callback) {
      //file filter
      if (
        ["xls", "xlsx"].indexOf(
          file.originalname.split(".")[file.originalname.split(".").length - 1]
        ) === -1
      ) {
        return callback(new Error("Wrong extension type"));
      }
      callback(null, true);
    },
  }).single("file");

  var exceltojson;
  upload(req, res, function (err) {
    if (err) {
      res.json({ error_code: 1, err_desc: err });
      return;
    }
    /** file info in req.file object */
    if (!req.file) {
      res.json({ error_code: 1, err_desc: "No file passed" }); // custom page
      return;
    }
    //    checking the type of extension and choosing the appropriate package

    if (
      req.file.originalname.split(".")[
        req.file.originalname.split(".").length - 1
      ] === "xlsx"
    ) {
      exceltojson = xlsxtojson;
    } else {
      exceltojson = xlstojson;
    }
    try {
      exceltojson(
        {
          input: req.file.path,
          output: null, // we don't require output.json, add sheet name functionality as well
          lowerCaseHeaders: true,
        },
        function (err, result) {
          if (err) {
            return res.json({ error_code: 1, err_desc: err, data: null });
          }
          resultToReturn = result;
          //   console.log(resultToReturn);
          doWhatever(); // function
          // console.log(result);
          //   const resulttwo = result;
          return result;
        }
      );
    } catch (e) {
      res.json({ error_code: 1, err_desc: "Corupted excel file" });
    }
  });
  console.log(resultToReturn);
  return resultToReturn;
};

module.exports = parsexcel;
