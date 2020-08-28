const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");

exports.verifyUser = (email, password) => {
  const checkExists = (user) => {
    if (user) {
      return Promise.resolve(user);
    } else {
      throw {
        intended: true,
        message: "해당 이메일에 대한 유저를 찾지 못했습니다.",
      };
    }
  };

  const checkPassword = (user, password) => {
    if (user.password === password) {
      return Promise.resolve(user);
    } else {
      throw {
        intended: true,
        message: "해당 이메일은 존재하나 비밀번호가 일치하지 않습니다.",
      };
    }
  };

  const signToken = (user) => {
    const token = jwt.sign({ email: user.email }, "secret", {
      expiresIn: "1d",
    });
    return Promise.resolve(token);
  };

  return prisma.user
    .findOne({ where: { email } })
    .then(checkExists)
    .then((user) => checkPassword(user, password))
    .then(signToken);
};
