const PublicRestrictor = () => (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.render("utils/message-with-link", {
      message: "허가되지 않은 접근입니다.",
      link: "/admin/login",
      linkname: "로그인 페이지로 돌아가기",
    });
  }
};

// 100 and over => researcher
// 200 and over => admin

const LevelRestrictor = (level) => (req, res, next) => {
  if (req.user && req.user.level >= level) {
    next();
  } else {
    res.render("utils/message-with-link", {
      message: "허가되지 않은 접근입니다.",
      link: "/admin/login",
      linkname: "로그인 페이지로 돌아가기",
    });
  }
};

module.exports = {
  LevelRestrictor,
  PublicRestrictor,
};
// usage app.use(LevelResctrictor(100));
