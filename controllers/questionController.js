const asyncHandler = require('express-async-handler');
const questionService = require('../services/questionService');
const Question = require("../models/questionModel");
const { sendPushNotification } = require("../services/alarmService"); // 알림 서비스 가져오기

const processResults = asyncHandler(async (req, res) => {
    const userId = req.session.userId;
    const answers = req.body.answers; // [y,y,y,y,n,n,y,n,y,n] 형태의 배열

    if (!Array.isArray(answers) || answers.length !== 14) {
        return res.status(400).send('유효한 답변 배열이 아닙니다.');
    }

    const result = questionService.analyzeResults(answers);

    // 결과를 데이터베이스에 저장
    await questionService.saveQuestionResult(userId, answers, result);

    // 결과가 '가까운 보건소에 방문하여 더 정확한 치매검진을 받아보세요'일 때 보호자에게 알림 전송
    if (result === '가까운 보건소에 방문하여 더 정확한 치매검진을 받아보세요') {
        // 알림 전송
        try {
            const title = '치매 검진 필요 알림';
            const body = '가까운 보건소에 방문하여 더 정확한 치매검진을 받아보세요';
            
            // 보호자에게 알림 전송
            await sendPushNotification(userId, title, body); // userId를 이용해 알림 전송
        } catch (error) {
            console.error('알림 전송 중 오류 발생:', error);
        }
    }
    res.status(200).send(result);
});

// @desc Get all results by userId
// @route GET /results
// 전체 결과 보기
const getAllQuestionResults = asyncHandler(async (req, res) => {
    const userId = req.session.userId;
    
    // userId 일치하는 모든 문서 검색
    const questionResults = await Question.find({ userId });
    res.status(200).json(questionResults);
});



module.exports = {
    processResults,
    getAllQuestionResults
};