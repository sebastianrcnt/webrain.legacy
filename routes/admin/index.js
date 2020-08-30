const express = require("express");
const AdminRouter = express.Router();
const { LevelRestrictor } = require("../../middlewares/filter-access");
const { RESEARCHER } = require("../../levels/levels");
const UserControllers = require("../../controllers/users");
const RenderControllers = require("../../controllers/render");
const ContextProviders = require("../../providers");
const multer = require("multer");
const ExperimentControllers = require("../../controllers/experiments");
const shortid = require("shortid");
const fs = require("fs");

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      req.fileId = shortid.generate();
      fs.mkdirSync("uploads/" + req.fileId);
      cb(null, "uploads/" + req.fileId);
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
});
const respondWithError = require("../../middlewares/error");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Pages
AdminRouter.use(ContextProviders.usersContextProvider());
AdminRouter.use(ContextProviders.experimentsContextProvider());

AdminRouter.get("/login", RenderControllers.render("admin/pages/login"))
  .get("/register", RenderControllers.render("admin/pages/register"))
  .get("/logout", UserControllers.eraseTokenAndRedirectToLogin)
  .post("/register", UserControllers.createUser)
  .post("/login", UserControllers.loginAndSignToken);

AdminRouter.get("/users", RenderControllers.render("admin/pages/users"))
  .get(
    "/users/:email",
    LevelRestrictor(200),
    ContextProviders.userContextProviderByEmail(),
    RenderControllers.render("admin/pages/user")
  )
  .post("/users/:email", LevelRestrictor(200), (req, res, next) => {
    prisma.user
      .update({
        where: { email: req.params.email },
        data: { ...req.body, level: +req.body.level },
      })
      .then((user) => {
        res.render("utils/message", { message: "성공적으로 수정되었습니다." });
      })
      .catch(respondWithError);
  });

AdminRouter.get(
  "/experiments",
  LevelRestrictor(RESEARCHER),
  RenderControllers.render("admin/pages/experiments")
)
  .get(
    "/experiments/new",
    LevelRestrictor(RESEARCHER),
    RenderControllers.render("admin/pages/experiment-new")
  )
  .get(
    "/experiments/:id",
    ContextProviders.experimentContextProviderById(),
    RenderControllers.render("admin/pages/experiment")
  )
  .post(
    "/experiments",
    upload.single("experiment-file"),
    ExperimentControllers.createExperiment
  )
  .post("/experiments/:id", (req, res) => {
    prisma.experiment
      .update({ where: { id: req.params.id }, data: req.body })
      .then((experiment) => {
        res.render("utils/message-with-link", {
          message: "실험이 성공적으로 저장되었습니다",
          link: "/admin/experiments",
          linkname: "실험 목록 페이지로 이동",
        });
      })
      .catch(respondWithError);
  })
  .delete("/experiments/:id", LevelRestrictor(100), (req, res, next) => {
    prisma.experiment
      .delete({ where: { id: req.params.id } })
      .then((experiment) => {
        res.status(200).json("성공적으로 삭제되었습니다");
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  });

AdminRouter.get(
  "/projects",
  ContextProviders.projectsContextProvider(),
  (req, res) => {
    res.render("admin/pages/projects", req.context);
  }
).get("/projects/:id", (req, res) => {
  res.render("admin/pages/projects", req.context);
});

module.exports = AdminRouter;
