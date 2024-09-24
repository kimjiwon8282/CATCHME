const axios = require('axios');
const asyncHandler = require("express-async-handler"); //try catch (err)

const searchHospitals = asyncHandler(async (req, res) => {
    //앱으로부터 사용자의 위치를 받음
    const { latitude, longitude, query } = req.query;
    const radius = 5000; // 반경 5km

    // 사용자가 query를 입력하지 않았을 때 디폴트 값 설정
    const defaultQuery = '신경과 치매 치료 병원';
    const searchQuery = query || defaultQuery;
    
    try {
        const response = await axios.get(
            `https://dapi.kakao.com/v2/local/search/keyword.json`,
            {
                headers: {
                    Authorization: `KakaoAK ${process.env.CLIENT_ID}`
                },
                params: {
                    query: searchQuery,
                    x: longitude,
                    y: latitude,
                    radius: radius
                }
            }
        );

        res.json(response.data.documents); // 병원 목록 반환
    } catch (error) {
        console.error(error);
        res.status(500).send('서버 오류');
    }
});

module.exports = {
    searchHospitals
};
