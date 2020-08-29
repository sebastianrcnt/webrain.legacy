const UsersService = require("../services/users");
const respondWithError = require("../middlewares/error");

const loginAndSignToken = async (req, res, next) => {
  const { email, password } = req.body;

  UsersService.verifyUser(email, password)
    .then((token) => {
      res.cookie("webrain-token", token);
      res.render("utils/message-with-link", {
        message: "정상적으로 로그인 되었습니다.",
        link: "/admin/experiments",
        linkname: "관리자 페이지로 이동",
      });
    })
    .catch(respondWithError);
};

const eraseTokenAndRedirectToLogin = async (req, res, next) => {
  res.clearCookie("webrain-token");
  res.redirect("/admin/login");
};

const createUser = async (req, res, next) => {
  UsersService.createUser(req.body)
    .then((user) => {
      res.render("utils/message-with-link", {
        message: "회원가입이 완료되었습니다.",
        link: "/admin/projects",
        linkname: "대시보드로 이동",
      });
    })
    .catch(respondWithError);
};

const UserControllers = {
  loginAndSignToken,
  eraseTokenAndRedirectToLogin,
  createUser,
};

module.exports = UserControllers;