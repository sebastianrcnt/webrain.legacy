const PublicRestrictor = () => (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.render("utils/message", { message: "허가되지 않은 접근입니다." });
  }
};

// 100 and over => researcher
// 200 and over => admin

const LevelRestrictor = level => (req, res, next) => {
  if (req.user && req.user.level >= level) {
    next()
  } else {
    res.render("utils/message", { message: "허가되지 않은 접근입니다." });
  }
}

module.exports = {
  LevelRestrictor,
  PublicRestrictor
}
// usage app.use(LevelResctrictor(100));
