const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
    {
        userId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User', // User 모델과 연결
            required: true 
        },
        answers: { 
            type: [String], // 설문 응답 배열 (예: ['y', 'n', 'y', ...])
            required: true 
        },
        result: { 
            type: String // 분석 결과 메시지
        }
    }, 
    { 
        timestamps: true 
    }
);

const Question = mongoose.model('Question', questionSchema);
module.exports = Question;