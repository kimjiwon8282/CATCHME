const axios = require('axios');
const asyncHandler = require("express-async-handler"); //try catch (err)

const searchHospitals = asyncHandler(async (req, res) => {
    //앱으로부터 사용자의 위치를 받음
    const latitude = req.query.latitude;
    const longitude = req.query.longitude;
    const radius = 5000; // 반경 5km
    const defaultQuery = '학교';
    console
    
    try {
        const response = await axios.get(
            `https://dapi.kakao.com/v2/local/search/keyword.json`,
            {
                headers: {
                    Authorization: `KakaoAK ${process.env.CLIENT_ID}`
                },
                params: {
                    query: defaultQuery,
                    x: longitude,
                    y: latitude,
                    radius: radius
                }
            }
        );
        console.log(response.data.documents);
        res.json(response.data.documents); // 병원 목록 반환
    } catch (error) {
        console.error(error);
        res.status(500).send('서버 오류');
    }
});

module.exports = {
    searchHospitals
};
