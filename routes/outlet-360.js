const isAuth = require('../middleware/isAuth');
const express = require('express');
const outlet360Controller = require('../controller/outlet-360');

const router = express.Router();

router.post('/outlet-360/account-goals',isAuth,outlet360Controller.populateAccountGoals);
router.post('/outlet-360/events',isAuth,outlet360Controller.populateEvents);
router.post('/outlet-360/records',isAuth,outlet360Controller.populateOutlet360);
router.post('/outlet-360/rate-depletion',isAuth,outlet360Controller.populateRateDepletion);
router.post('/outlet-360/visibility-scores',isAuth,outlet360Controller.fetchVisibilityScores);
router.post('/outlet-360/posm-items',isAuth,outlet360Controller.fetchPilotPosLineItems);
module.exports = router;