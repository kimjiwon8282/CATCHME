const express = require("express");
const router = express.Router();
const { createRawData} = require("../controllers/rawDataController");
const { requireLogin } = require('../middlewares/authMiddleware');

// 센서 데이터 받기
router.route("/data").post(requireLogin, createRawData);

module.exports = router;