const express = require("express");
const AdminRouter = express.Router();
const { LevelRestrictor } = require("../../middlewares/filter-access");
const { RESEARCHER } = require("../../levels/levels");
const {
  loginAndSignToken,
  eraseTokenAndRedirectToLogin,
} = require("../../controllers/users");
const render = require("../../controllers/render");
const {
  usersContextProvider,
  experimentsContextProvider,
  experimentContextProvider,
} = require("../../providers");

// Pages
AdminRouter.get("/login", render("admin/pages/login"));
AdminRouter.get(
  "/experiments",
  LevelRestrictor(RESEARCHER),
  usersContextProvider(),
  experimentsContextProvider(),
  render("admin/pages/experiments")
);

AdminRouter.get(
  "/experiments/:id",
  experimentContextProvider(),
  usersContextProvider(),
  render("admin/pages/experiment")
);

// Actions
AdminRouter.post("/login", loginAndSignToken);
AdminRouter.get("/logout", eraseTokenAndRedirectToLogin);

module.exports = AdminRouter;
