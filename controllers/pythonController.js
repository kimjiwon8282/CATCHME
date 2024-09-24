const asyncHandler = require("express-async-handler"); 
const Result = require("../models/pythonResultModel");
const { runPythonScript } = require("../services/runPythonService");

// @desc 파이썬 결과 저장하고 응답으로 주기
// @route POST /result
// @access Public
const createResult = asyncHandler(async (req, res) => {
    const userId = req.session.userId;

    // Python 스크립트를 실행하고 결과를 받아옴
    const result = await runPythonScript();
    console.log(`Python Output: ${result}`);
    console.log({ userId, result });

    // 데이터베이스에 결과를 저장
    const savedResult = await Result.create({ userId, result });
    res.status(201).json({ message: "Result created successfully", result: savedResult });
});

// @desc Get all results by userId
// @route GET /result/all
// 전체 결과 보기
const getAllResults = asyncHandler(async (req, res) => {
    const userId = req.session.userId;

    // userId에 해당하는 모든 결과를 검색
    const results = await Result.find({ userId });

    if (results.length === 0) {
        return res.status(404).json({ message: '결과를 찾을 수 없습니다.' });
    }

    res.status(200).json(results);
});

// @desc Get the latest result by userId
// @route GET /result
// 최근 결과 하나 보기
const getResult = asyncHandler(async (req, res) => {
    const userId = req.session.userId;

    const result = await Result.findOne({ userId }).sort({ createdAt: -1 }); // 최신 결과 검색

    if (!result) {
        return res.status(404).json({ message: '결과를 찾을 수 없습니다.' });
    }

    res.status(200).json(result);
});

module.exports = {
    createResult,
    getAllResults,
    getResult
};
