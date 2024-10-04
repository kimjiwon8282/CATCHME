const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema(
    {
        userId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User', // User 모델과 연결
            required: true 
        },
        result: {
            type: Number, // 정수형으로 변경(결과가 숫자로 나오기때문?)
            required: true        
        }
    },
    {
        timestamps: true // createdAt, updatedAt 필드 자동 생성
    }
);

const Result = mongoose.model("Result", resultSchema);
module.exports = Result;
