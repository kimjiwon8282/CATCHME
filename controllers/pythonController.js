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
    let searchUserId;

    if (req.session.role === 'USER') {
        // USER인 경우: userId에 해당하는 모든 결과를 검색
        searchUserId = userId;
    } else if (req.session.role === 'GUARDIAN') {
        // GUARDIAN인 경우: contactId에 해당하는 모든 결과를 검색
        const guardian = await User.findById(userId);
        
        if (!guardian || !guardian.contactId) {
            return res.status(404).json({ message: '보호자 정보를 찾을 수 없습니다.' });
        }

        searchUserId = guardian.contactId;
    } else {
        return res.status(403).json({ message: '권한이 없습니다.' });
    }

    //searchUserId에 해당하는 모든 결과를 검색
    const results = await Result.find({ userId: searchUserId });

    if (results.length === 0) {
        return res.status(404).json({ message: '결과를 찾을 수 없습니다.' });
    }

    return res.status(200).json(results);
});

// @desc Get the latest result by userId
// @route GET /result
// 최근 결과 하나 보기
const getResult = asyncHandler(async (req, res) => {
    const userId = req.session.userId;
    let searchUserId;

    if (req.session.role === 'USER') {
        // USER인 경우: userId에 해당하는 모든 결과를 검색
        searchUserId = userId;
    } else if (req.session.role === 'GUARDIAN') {
        // GUARDIAN인 경우: contactId에 해당하는 모든 결과를 검색
        const guardian = await User.findById(userId);
        if (!guardian || !guardian.contactId) {
            return res.status(404).json({ message: '보호자 정보를 찾을 수 없습니다.' });
        }
        searchUserId = guardian.contactId;
    } else {
        return res.status(403).json({ message: '권한이 없습니다.' });
    }

    const result = await Result.findOne({ userId:searchUserId }).sort({ createdAt: -1 }); // 최신 결과 검색

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
