const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema(
    {
        userId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User', // User 모델과 연결
            required: true 
        },
        result:{
            type:String,
            required:true        
        }
    },
    {
        timestamps:true
    }
);
//스키마->모델
//mongoose.model(모델명, 스키마명)

const Result = mongoose.model("Result",resultSchema);
module.exports = Result;