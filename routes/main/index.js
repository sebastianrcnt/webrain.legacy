const express = require("express");
const MainRouter = express.Router();

// Routes
MainRouter.use("/:name", (req, res) => {
  const name = req.params.name;
  res.render(`main/pages/${name}`)
})


module.exports = MainRouter;