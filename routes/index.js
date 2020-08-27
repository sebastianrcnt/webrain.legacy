var express = require('express');
const AdminRouter = require('./admin');
const ApiRouter = require('./api');
const MainRouter = require('./main');
var router = express.Router();

/* GET home page. */
router.use('/main', MainRouter)
router.use('/admin', AdminRouter)
router.use('/api', ApiRouter)

module.exports = router;