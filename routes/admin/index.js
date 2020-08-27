const express = require("express");
const AdminRouter = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const { PublicRestrictor, LevelRestrictor } = require("../../middlewares/filter-access");
const { RESEARCHER } = require("../../levels/levels");
// AdminRouter.use('/:name', (req, res) => {
//   const name = req.params.name;
//   res.render(`admin/pages/${name}`)
// });

// Pages
AdminRouter.get("/login", (req, res) => {
  res.render("admin/pages/login");
});

AdminRouter.get("/experiments", LevelRestrictor(RESEARCHER), (req, res) => {
  prisma.experiment.findMany({ where: {} }).then((experiments) => {
    res.render("admin/pages/experiments", { experiments, user: req.user });
  });
});

// Actions
AdminRouter.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email && password) {
    prisma.user.findOne({ where: { email } }).then((found) => {
      if (found) {
        if (found.password === password) {
          const token = jwt.sign(
            {
              email,
            },
            "secret",
            { expiresIn: "1d" }
          );

          res.cookie("webrain-token", token);
          res.render("utils/message-with-link", {
            message: "정상적으로 로그인 되었습니다.",
            link: "/admin/login",
            linkname: "관리자 페이지로 이동",
          });
        } else {
          res.status(401).render("utils/message-with-link", {
            message: "로그인에 실패하였습니다. 비밀번호가 일치하지 않습니다",
            link: "/admin/login",
            linkname: "로그인 페이지로 이동",
          });
        }
      } else {
        res.status(401).render("utils/message-with-link", {
          message:
            "로그인에 실패하였습니다. 해당 이메일에 대한 유저가 없습니다.",
          link: "/admin/login",
          linkname: "로그인 페이지로 이동",
        });
      }
    });
  } else {
    res.status(401).render("utils/message-with-link", {
      message: "잘못된 요청입니다.",
      link: "/admin/login",
      linkname: "로그인 페이지로 이동",
    });
  }
});

AdminRouter.get("/logout", (req, res) => {
  res.clearCookie("webrain-token");
  res.redirect("/admin/login");
});

module.exports = AdminRouter;
