const isAuth = require('../middleware/isAuth');
const express = require('express');
//Controller for login routes
const recommendationController = require('../controller/recommendationController');

const router = express.Router();

router.post('/recommendations',isAuth,recommendationController.fetchAllRecommendations);
router.post('/sell-sheet',isAuth,recommendationController.fetchSellSheet)
router.post('/sfdc/push-recommendations',isAuth,recommendationController.processAcceptedRecommnedations)
router.post('/sfdc/push-samples',isAuth,recommendationController.processSamples)
module.exports = router;