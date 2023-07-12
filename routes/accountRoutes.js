/*
    Checking the authentication of the current user
*/

const express = require('express');
const isAuth = require('../middleware/isAuth');
//Controller for login routes
const accountController = require('../controller/accountController');
const { route } = require('./loginRoutes');

const router = express.Router();

router.post('/accountList',isAuth,accountController.fetchAccounts);
router.post('/mediaList',isAuth,accountController.fetchMedia);
router.post('/account/geo-location',isAuth, accountController.updateGeolocation);



module.exports = router;