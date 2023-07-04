/*
    Fetching Home Page Dashboard data
*/

const express = require('express');
const isAuth = require('../middleware/isAuth');
//Controller for routes
const {marketInventories} = require("../controller/marketInventoryController");

const router = express.Router();

router.post('/distributorInventory',isAuth,marketInventories);


module.exports = router;