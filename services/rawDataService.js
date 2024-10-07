const fs = require('fs'); // 파일 시스템에 접근
const path = require('path'); // 경로 조작 위해 사용
const { v4: uuidv4 } = require('uuid'); // 고유한 파일 만들기 위해 사용
const { parse } = require('json2csv'); // json 데이터를 csv 형식으로 변환

// 데이터를 CSV로 저장하고 로컬 디바이스에 저장하는 함수
exports.saveRawDataToLocal = async (userId, dataArray) => {
    try {
        // gyroAccelData와 pressureData를 같은 행에 나란히 저장할 수 있도록 변환
        const combinedData = dataArray.gyroAccelData.map((gyroValue, index) => ({
            gyroAccelData: gyroValue,
            pressureData: dataArray.pressureData[index] || 0 // 압력 데이터가 없으면 0으로 설정
        }));

        // 필드 설정
        const fields = ['gyroAccelData', 'pressureData'];
        const csv = parse(combinedData, { fields });

        // 파일 경로 설정
        const dirPath = path.join(__dirname, '../CATCHME/rawDataStorage', userId);

        // 디렉터리 생성 (없을 경우)
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }

        const filePath = path.join(dirPath, `${uuidv4()}.csv`);
        fs.writeFileSync(filePath, csv); // CSV 파일로 저장

        return filePath;
    } catch (error) {
        console.error('Error saving raw data to local device:', error);
        throw new Error('Failed to save raw data to local device');
    }
};
