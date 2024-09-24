const mongoose = require('mongoose');

const rawDataSchema = new mongoose.Schema(
    {
        userId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User', // User 모델과 연결
            required: true 
        },
        sensor:{
            type:[Number],
            required:true
        }
    },
    {
        timestamps:true
    }
);
//스키마->모델
//mongoose.model(모델명, 스키마명)

const RawData = mongoose.model("RawData",rawDataSchema);
module.exports = RawData;