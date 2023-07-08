const isAuth = require('../middleware/isAuth');
const express = require('express');
//Controller for login routes
const recommendationController = require('../controller/recommendationController');
const { route } = require('./loginRoutes');

const router = express.Router();

router.post('/recommendations',isAuth,recommendationController.fetchAllRecommendations);
router.post('/sell-sheet',isAuth,recommendationController.fetchSellSheet)
router.post('/sfdc/push-recommendations',isAuth,recommendationController.processAcceptedRecommnedations)
router.post('/sfdc/push-samples',isAuth,recommendationController.processSamples);
router.post('/recommendation/week-filter',isAuth, recommendationController.completedEvents);
router.post('/recommendation-feedback-meta',isAuth, recommendationController.feedbackMetadata);
module.exports = router;