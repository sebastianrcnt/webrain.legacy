const respondWithError = (response) => (error) => {
  if (error.intended) {
    res.status(401).render("utils/message", {
      message: error.message,
    });
  } else {
    console.error(error);
    res.status(500).render("utils/message-with-link", {
      message: "알 수 없는 오류가 발생했습니다.",
      link: "javascript:history.back()",
      linkname: "뒤로가기",
    });
  }
};

module.exports = respondWithError;
