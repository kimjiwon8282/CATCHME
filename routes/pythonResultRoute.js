const express = require("express");
const router = express.Router();
const { createResult, getAllResults, getResult } = require("../controllers/pythonController");
const { requireLogin } = require('../middlewares/authMiddleware');

// AI 모델을 통해 새로운 결과 생성
router.route("/ai/result").post(requireLogin, createResult)
                            .get(requireLogin, getResult);

// AI 모델을 통해 생성된 모든 결과 보기
router.route("/ai/results").get(requireLogin, getAllResults);

// AI 모델을 통해 생성된 최근 결과 보기


module.exports = router;