const { verifyUser } = require("../services/users");

exports.loginAndSignToken = async (req, res, next) => {
  const { email, password } = req.body;

  verifyUser(email, password)
    .then((token) => {
      res.cookie("webrain-token", token);
      res.render("utils/message-with-link", {
        message: "정상적으로 로그인 되었습니다.",
        link: "/admin/experiments",
        linkname: "관리자 페이지로 이동",
      });
    })
    .catch((error) => {
      if (error.intended) {
        res.status(401).render("utils/message-with-link", {
          message: error.message,
          link: "/admin/login",
          linkname: "로그인 페이지로 이동",
        });
      } else {
        console.error(error);
        res.status(500).render("utils/message", {
          message: "알 수 없는 오류가 발생했습니다.", 
        })
      }
    });
};

exports.eraseTokenAndRedirectToLogin = async (req, res, next) => {
  res.clearCookie("webrain-token");
  res.redirect("/admin/login");
};
