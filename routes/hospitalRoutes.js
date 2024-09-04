const express = require('express');
const { searchHospitals } = require('../controllers/hospitalController');
const router = express.Router();


// 병원 검색 라우트
router.get('/searchhospitals', searchHospitals);

module.exports = router;
