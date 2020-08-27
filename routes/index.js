var express = require('express');
const AdminRouter = require('./admin');
const ApiRouter = require('./api');
var router = express.Router();

/* GET home page. */
router.use('/admin', AdminRouter)
router.use('/api', ApiRouter)

module.exports = router;