const express = require('express')
const ApiRouter = express.Router();

ApiRouter.use('/api/:name', (req, res) => {
  const name = req.params.name;
  res.render(`admin/${name}`)
});

module.exports = ApiRouter;