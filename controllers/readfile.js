// const fs = require("fs");
// const Parser = require("../parser/parser.js");

// const data = fs.readFileSync("../uploads/C3AZPcy9k/test/exp.txt", "utf-8");
// const parser = new Parser(data);
// const result = parser.execute().json();
// console.log(result);

const decompress = require("decompress")
const { resolve } = require("path")
decompress(
  // resolve("uploads/jicraYVe-/holy_shit2.zip"),
  "/Users/sebastianrcnt/Desktop/data/Archive.zip",
  "uploads/extracted/"
).then((files) => {
  console.log(files)
})
