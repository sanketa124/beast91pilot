/*
    Fetching Home Page Dashboard data
*/

const express = require('express');
const isAuth = require('../middleware/isAuth');
//Controller for login routes
const payOutController = require("../controller/payOutSlabController")

const router = express.Router();

router.post('/salesOrderPayOut',isAuth,payOutController.fetchPayOutSlabs);
router.post('/accountGoals',isAuth,payOutController.fetchAccountGoals);
router.post('/sample',isAuth,payOutController.fetchSample)
router.post('/posmItems',isAuth,payOutController.postPOSMItems);
router.post('/salesOrder/push',isAuth,payOutController.postSalesOrder);


module.exports = router;