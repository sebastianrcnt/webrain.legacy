const extract = require("extract-zip");
const respondWithError = require("../middlewares/error");
const { resolve } = require("path");
const { PrismaClient } = require("@prisma/client");
const { transformDocument } = require("@prisma/client/runtime");
const prisma = new PrismaClient();

const createExperiment = async (req, res) => {
  const { fieldname, originalname, destination, filename } = req.file;
  console.log({
    fieldname,
    originalname,
    destination,
    filename,
  });

  const extractZip = (req) =>
    new Promise((resolve_promise, reject) => {
      extract(req.file.path, { dir: resolve(req.file.destination) })
        .then(() => {
          resolve_promise(req);
        })
        .catch((err) => {
          console.log(err);
          throw {
            intended: true,
            message: "압축 파일(zip)을 푸는 데 실패하였습니다.",
          };
        });
    });

  const writeToDatabase = (req) => {
    prisma.experiment
      .create({
        data: {
          id: req.fileId,
          User: { connect: { email: req.user.email } },
          name: req.body.name,
          description: req.body.description,
          fileId: req.fileId,
          fileName: req.file.originalname,
        },
      })
      .then((experiment) => {
        console.log("experiment created", experiment);
        res.render("utils/message-with-link", {
          message: "생성이 완료되었습니다",
          link: "/admin/experiments",
          linkname: "실험 목록 페이지로 이동",
        });
      })
      .catch((err) => {
        console.log(err);
        res.render("utils/message", { message: "Error code 1213" });
      });
  };

  extractZip(req).then(writeToDatabase).catch(respondWithError);
};

const ExperimentControllers = { createExperiment };

module.exports = ExperimentControllers;
