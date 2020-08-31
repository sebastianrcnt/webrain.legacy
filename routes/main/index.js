const express = require("express");
const MainRouter = express.Router();

// Routes
MainRouter.get("/list");

module.exports = MainRouter;
