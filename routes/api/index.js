const express = require("express");
const ApiRouter = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const respondWithError = require("../../middlewares/error");

// ApiRouter.use('/api/:name', (req, res) => {
//   const name = req.params.name;
//   res.render(`admin/${name}`)
// });

ApiRouter.get("/login", async (req, res) => {
  const { email, password } = req.query;

  if (email && password) {
    prisma.user.findOne({ where: { email } }).then((found) => {
      if (found) {
        if (found.password === password) {
          const token = jwt.sign(
            {
              email,
            },
            "secret",
            { expiresIn: "1d" }
          );

          req.cookie("webrain-token", token);
          res.status(200).json(token);
        } else {
          res.status(401).send("wrong password");
        }
      } else {
        res.status(404).send("No user find with the email");
      }
    });
  } else {
    res.status(400).send("Email and Password is not provided");
  }
});

ApiRouter.get("/process/connect-experiment-to-project", (req, res) => {
  const { projectId, experimentId } = req.query;
  if (projectId && experimentId) {
    prisma.project
      .update({
        where: { id: projectId },
        data: {
          Experiments: {
            connect: [{ id: experimentId }],
          },
        },
      })
      .then((success) => {
        res.status(200).send("success");
      })
      .catch(respondWithError(res));
  } else {
    res.status(400).send();
  }
});

ApiRouter.get("/process/disconnect-experiment-to-project", (req, res) => {
  const { projectId, experimentId } = req.query;
  if (projectId && experimentId) {
    prisma.project
      .update({
        where: { id: projectId },
        data: {
          Experiments: {
            disconnect: [{ id: experimentId }],
          },
        },
      })
      .then((success) => {
        res.status(200).send("success");
      })
      .catch(respondWithError(res));
  } else {
    res.status(400).send();
  }
});

ApiRouter.get("/game/:id", (req, res) => {
  const { id } = req.params;
  prisma.result
    .findOne({
      where: { id },
      include: {
        Experiment: true,
        Project: true,
        User: true,
      },
    })
    .then((result) => {
      if (result) {
        res.json(JSON.parse(result.Experiment.json));
      } else {
        throw {
          intended: true,
          message: "게임을 찾을 수 없습니다",
        };
      }
    })
    .catch(respondWithError);
});

module.exports = ApiRouter;
