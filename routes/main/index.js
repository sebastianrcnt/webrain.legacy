const express = require("express")
const ResultsProvider = require("../../providers/results")
const ExperimentsProvider = require("../../providers/experiments")
const UserControllers = require("../../controllers/users")
const UsersService = require("../../services/users")
const respondWithError = require("../../middlewares/error")
const MainRouter = express.Router()
// Routes
MainRouter.get(
  "/games",
  ResultsProvider.provideAll(),
  ExperimentsProvider.provideAll(),
  (req, res) => {
    res.render("main/pages/games", req.context)
  }
)
  .get("/game/:id", ResultsProvider.provideOneById(), (req, res) => {
    res.render("main/pages/game-pre", req.context)
  })
  .get("/login", (req, res) => {
    if (req.user) {
      res.redirect("/main/games")
    } else {
      res.render("main/pages/login", req.context)
    }
  })
  .get("/register", (req, res) => {
    if (req.user) {
      res.redirect("/main/games")
    } else {
      res.render("main/pages/register", req.context)
    }
  })
  .get("/logout", UserControllers.eraseTokenAndRedirectToMainLogin)
  .post("/register", (req, res) => {
    UsersService.createUser(req.body)
      .then((user) => {
        res.render("utils/message-with-link", {
          message: "회원가입이 완료되었습니다. 로그인하세요.",
          link: "/main/login",
          linkname: "로그인하기",
        })
      })
      .catch(respondWithError(res))
  })
  .post("/login", (req, res) => {
    const { email, password } = req.body

    UsersService.verifyUser(email, password)
      .then((token) => {
        res.cookie("webrain-token", token)
        res.render("utils/message-with-link", {
          message: "정상적으로 로그인 되었습니다.",
          link: "/main/games",
          linkname: "메인페이지로 이동",
        })
      })
      .catch(respondWithError(res))
  })

module.exports = MainRouter
