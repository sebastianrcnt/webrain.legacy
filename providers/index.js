const { PrismaClient } = require("@prisma/client");
const respondWithError = require("../middlewares/error");
const prisma = new PrismaClient();

exports.usersContextProvider = () => async (req, res, next) => {
  prisma.user
    .findMany({ where: {} })
    .then((users) => {
      req.context.users = users;
      next();
    })
    .catch(respondWithError);
};

exports.userContextProviderByEmail = () => async (req, res, next) => {
  prisma.user.findOne({where: {email: req.params.email}}).then(user => {
    if (user) {
      req.context.user = user;
      next();
    } else {
      res.render('utils/message', {
        message: "존재하지 않거나 삭제된 유저입니다"
      })
    }
  }).catch(respondWithError);
};

exports.experimentsContextProvider = () => async (req, res, next) => {
  prisma.experiment
    .findMany({ where: {} })
    .then((experiments) => {
      req.context.experiments = experiments;
      next();
    })
    .catch(respondWithError);
};

exports.experimentContextProviderById = () => async (req, res, next) => {
  prisma.experiment
    .findOne({
      where: { id: req.params.id },
    })
    .then((experiment) => {
      if (experiment) {
        req.context.experiment = experiment;
        next();
      } else {
        res.render("utils/message", {
          message: "존재하지 않거나 삭제된 실험입니다.",
        });
      }
    })
    .catch(respondWithError);
};
