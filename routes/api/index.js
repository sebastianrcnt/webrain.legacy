const express = require("express");
const ApiRouter = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");

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
          res.status(401).send('wrong password')
        }
      } else {
        res.status(404).send("No user find with the email")
      }
    });
  } else {
    res.status(400).send("Email and Password is not provided");
  }
});

module.exports = ApiRouter;
