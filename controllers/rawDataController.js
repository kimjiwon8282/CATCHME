const asyncHandler = require('express-async-handler');
const { saveRawDataToLocal } = require('../services/rawDataService');
const RawData = require('../models/rawDataModel');

// 로컬에 raw data를 저장하고 메타데이터를 DB에 저장하는 컨트롤러 함수
exports.createRawData = asyncHandler(async (req, res) => {
    const userId = req.session.userId;
    const dataArray = req.body;

    try {
        // 데이터를 로컬 디바이스에 저장하고 파일 경로 반환
        const localPath = await saveRawDataToLocal(userId, dataArray);

        // 메타데이터를 DB에 저장
        await RawData.create({ userId, filePath: localPath, timestamp: new Date() });

        res.status(201).send('Raw data saved successfully');
    } catch (error) {
        res.status(500).json({ message: 'Failed to save raw data', error: error.message });
    }
});