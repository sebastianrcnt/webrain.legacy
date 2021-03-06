const express = require("express")
const ApiRouter = express.Router()
const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()
const jwt = require("jsonwebtoken")
const respondWithError = require("../../middlewares/error")
const fs = require("fs")
const path = require("path")

ApiRouter.get("/login", async (req, res) => {
  const { email, password } = req.query

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
          )

          req.cookie("webrain-token", token)
          res.status(200).json(token)
        } else {
          res.status(401).send("wrong password")
        }
      } else {
        res.status(404).send("No user find with the email")
      }
    })
  } else {
    res.status(400).send("Email and Password is not provided")
  }
})

ApiRouter.get("/process/connect-experiment-to-project", (req, res) => {
  const { projectId, experimentId } = req.query
  if (projectId && experimentId) {
    prisma.project
      .update({
        where: { id: projectId },
        data: {
          Experiment: {
            connect: [{ id: experimentId }],
          },
        },
      })
      .then((success) => {
        res.status(200).send("success")
      })
      .catch(respondWithError(res))
  } else {
    res.status(400).send()
  }
})

ApiRouter.get("/process/disconnect-experiment-to-project", (req, res) => {
  const { projectId, experimentId } = req.query
  if (projectId && experimentId) {
    prisma.project
      .update({
        where: { id: projectId },
        data: {
          Experiment: {
            disconnect: [{ id: experimentId }],
          },
        },
      })
      .then((success) => {
        res.status(200).send("success")
      })
      .catch(respondWithError(res))
  } else {
    res.status(400).send()
  }
})

ApiRouter.post("/process/edit-home", (req, res) => {
  const data = unescape(req.body.html).trim()
  console.log(data)
  fs.writeFileSync("html/home.html", data, { encoding: "utf-8" })
  res.status(200).send()
})

ApiRouter.get("/game/:id", (req, res) => {
  const { id } = req.params
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
        res.json(JSON.parse(result.Experiment.json))
      } else {
        throw {
          intended: true,
          message: "게임을 찾을 수 없습니다",
        }
      }
    })
    .catch(respondWithError(res))
})

ApiRouter.post("/game/:id", (req, res) => {
  const { id } = req.params
  const { resultJson } = req.body
  if (id && resultJson) {
    prisma.result
      .update({ where: { id }, data: { json: resultJson } })
      .then((result) => {
        res.status(200).send()
      })
      .catch(respondWithError(res))
  } else {
    res.status(400).send()
  }
})

ApiRouter.get("/download/game/:id", (req, res) => {
  const { id } = req.params
  prisma.result
    .findOne({
      where: { id },
    })
    .then((result) => {
      fs.writeFileSync(
        `json/result.json`,
        JSON.stringify(JSON.parse(result.json), null, 4)
      )
      res.download(path.resolve("json/result.json"))
    })
    .catch((err) => {
      console.error(err)
      res.sendStatus(404)
    })
})
module.exports = ApiRouter
