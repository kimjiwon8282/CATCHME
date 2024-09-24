const Question = require('../models/questionModel.js');

const analyzeResults = (answers) => {
    // 전체 14개의 답변에서 'y'의 개수를 계산
    const totalYCount = answers.filter(answer => answer === 'y').length;

    // 조건에 따라 적절한 메시지 반환
    if (totalYCount >= 1 && totalYCount <= 5) {
        return '운동과 외부 사회 활동을 유지하세요';
    } else if (totalYCount >= 6) {
        return '가까운 보건소에 방문하여 더 정확한 치매검진을 받아보세요';
    } else {
        return '결과를 기반으로 추가 권장사항이 없습니다.';
    }
};

const saveQuestionResult = async (userId, answers, result) => {
    try {
        const question = new Question({
            userId,
            answers,
            result
        });
        await question.save();
    } catch (error) {
        onsole.error(`Error saving question result for userId ${userId}:`, error);
        throw new Error('설문 결과를 저장하는 중 오류가 발생했습니다.');
    }
};

module.exports = {
    analyzeResults,
    saveQuestionResult
}