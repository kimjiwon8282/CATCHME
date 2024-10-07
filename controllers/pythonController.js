const asyncHandler = require("express-async-handler"); 
const Result = require("../models/pythonResultModel");
const { runPythonScript } = require("../services/runPythonService");
const { sendPushNotification } = require('../controllers/alarmController');

// @desc 파이썬 결과 저장하고 응답으로 주기
// @route POST /ai/result
// @access Public
const createResult = asyncHandler(async (req, res) => {
    const userId = req.session.userId;

    // Python 스크립트를 실행하고 결과를 받아옴
    const result = parseInt(await runPythonScript(), 10); // 10진수로 저장
    console.log(`Python Output: ${result}`);
    console.log({ userId, result });

    // 데이터베이스에 결과를 저장
    await Result.create({ userId, result });

    // 결과가 0일 경우 보호자에게 알람 전송 (신속한 전송 위해 분석결과 나오자마자 바로 전송)
    if (result === 0) {
        // 알림 메시지 전송
        try {
            await sendPushNotification(userId, '긴급 알림', '환자의 상태가 비정상입니다. 즉시 확인하세요.');
            // 알림 전송 후 프론트에서 /question으로 리디렉션
            return res.status(201).json({ message: "환자의 상태가 비정상입니다.", redirect: "/question" });
        } catch (error) {
            console.error('Error sending notification:', error.message);
        }
    }

    // 결과가 1일 경우 기본 응답 전송
    res.status(201).json({ message: "환자의 상태가 정상입니다." });
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


// 특정 날짜의 결과 조회
const getResultsByDate = asyncHandler(async (req, res) => {
    const userId = req.session.userId;
    let searchUserId;

    // 사용자의 역할에 따라 검색 대상 결정
    if (req.session.role === 'USER') {
        searchUserId = userId;
    } else if (req.session.role === 'GUARDIAN') {
        const guardian = await User.findById(userId);
        
        if (!guardian || !guardian.contactId) {
            return res.status(404).json({ message: '보호자 정보를 찾을 수 없습니다.' });
        }
        
        searchUserId = guardian.contactId;
    } else {
        return res.status(403).json({ message: '권한이 없습니다.' });
    }

    // 요청된 날짜
    const { date } = req.params;
    const startDate = new Date(date); //요청된 날짜의 자정시간
    const endDate = new Date(date); 
    endDate.setDate(endDate.getDate() + 1); // 요청된 날짜의 다음날 자정시간

    try {
        // 주어진 날짜 범위에 있는 결과 조회 
        const results = await Result.find({
            userId: searchUserId,
            createdAt: { 
                $gte: startDate, // 해당 날짜의 시작
                $lt: endDate // 다음 날 이전
            }
        });

        if (results.length === 0) {
            return res.status(404).json({ message: '해당 날짜에 결과를 찾을 수 없습니다.' });
        }

        res.status(200).json(results); // 
    } catch (error) {
        res.status(500).json({ message: '서버 오류', error: error.message });
    }
});

module.exports = {
    createResult,
    getAllResults,
    getResult,
    getResultsByDate,
};
