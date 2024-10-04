const express = require("express");
const router = express.Router();
const { createResult, getAllResults, getResult, getResultsByDate } = require("../controllers/pythonController");
const { requireLogin } = require('../middlewares/authMiddleware');


router.route("/ai/result").post(requireLogin, createResult)// AI 모델을 통해 새로운 결과 생성
                            .get(requireLogin, getResult); //최근 결과 조회

// AI 모델을 통해 생성된 모든 결과 보기
router.route("/ai/results").get(requireLogin, getAllResults);

// 특정 날짜에 생성된 결과 조회 (YYYY-MM-DD 형식의 날짜를 파라미터로 전달)
router.route("/ai/result/:date").get(requireLogin, getResultsByDate);

module.exports = router;