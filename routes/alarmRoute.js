const express = require("express");
const router = express.Router();
const { sendPushNotification, savePushToken} = require("../controllers/alarmController");
const { requireLogin } = require('../middlewares/authMiddleware');

// 사용자 푸쉬토큰 저장
router.route("/alarm").post(requireLogin, savePushToken);

module.exports = router;