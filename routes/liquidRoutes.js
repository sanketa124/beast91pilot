const isAuth = require('../middleware/isAuth');
const express = require('express');
const liquidController = require('../controller/liquidController');

const router = express.Router();

router.post('/liquid-layer',isAuth,liquidController.fetchAllLiquids);
module.exports = router;