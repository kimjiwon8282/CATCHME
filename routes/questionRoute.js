const express = require("express");
const router = express.Router();
const { processResults, getAllQuestionResults } = require("../controllers/questionController");
const { requireLogin } = require('../middlewares/authMiddleware');

// 자가 문진 결과 저장
router.route("/question/result").post(requireLogin, processResults);

// 자가 문진 결과 조회
router.route("/question/results").get(requireLogin, getAllQuestionResults);

module.exports = router;
