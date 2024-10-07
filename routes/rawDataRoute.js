const express = require('express');
const router = express.Router();
const { requireLogin } = require('../middlewares/authMiddleware');
const { createRawData } = require('../controllers/rawDataController');

// 센서 데이터 저장 라우트
router.route('/data').post(requireLogin, createRawData);

module.exports = router;