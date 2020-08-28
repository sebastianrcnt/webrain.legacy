const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.usersContextProvider = () => async (req, res, next) => {
  const users = await prisma.user.findMany({ where: {} });
  req.context.users = users;
  next()
};

exports.experimentsContextProvider = () => async (req, res, next) => {
  const experiments = await prisma.experiment.findMany({ where: {} });
  req.context.experiments = experiments;
  next()
};
