const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.usersContextProvider = () => async (req, res, next) => {
  const users = await prisma.user.findMany({ where: {} });
  req.context.users = users;
  next();
};

exports.experimentsContextProvider = () => async (req, res, next) => {
  const experiments = await prisma.experiment.findMany({ where: {} });
  req.context.experiments = experiments;
  next();
};

exports.experimentContextProvider = () => async (req, res, next) => {
  const experiment = await prisma.experiment.findOne({
    where: { id: req.params.id },
  });
  if (experiment) {
    req.context.experiment = experiment;
    next();
  } else {
    res.render("utils/message", {
      message: "존재하지 않거나 삭제된 실험입니다.",
    });
  }
};
