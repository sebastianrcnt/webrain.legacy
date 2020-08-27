const express = require('express')
const AdminRouter = express.Router();

AdminRouter.use('/:name', (req, res) => {
  const name = req.params.name;
  res.render(`admin/${name}`)
});

module.exports = AdminRouter;