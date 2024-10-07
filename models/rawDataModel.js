const mongoose = require('mongoose');

const rawDataSchema = new mongoose.Schema(
    {
        userId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User', 
            required: true 
        },
        filePath: { 
            type: String, 
            required: true 
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

const RawData = mongoose.model("RawData", rawDataSchema);
module.exports = RawData;
