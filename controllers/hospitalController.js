const axios = require('axios');
const asyncHandler = require('express-async-handler');
require('dotenv').config();

exports.searchHospitals = asyncHandler(async (req, res) => {
    const { lat, lng } = req.query;

    try {
        const apiKey = process.env.KAKAO_API_KEY;
        const searchKeywords = ['신경과', '치매안심센터'];

        let results = [];

        for (const keyword of searchKeywords) {
            const response = await axios.get('https://dapi.kakao.com/v2/local/search/keyword.json', {
                headers: { Authorization: `KakaoAK ${apiKey}` },
                params: {
                    query: keyword,
                    x: lng,
                    y: lat,
                    radius: 2000,
                    size: 6,
                },
            });

            const places = response.data.documents.map(place => ({
                name: place.place_name,
                address: place.road_address_name || place.address_name,
                lat: place.y,
                lng: place.x,
                distance: place.distance // 거리 정보 추가
            }));

            results = results.concat(places);
        }

        // 거리순으로 정렬
        results.sort((a, b) => a.distance - b.distance);

        res.json(results.slice(0, 6));
    } catch (error) {
        console.error('Error fetching hospital data:', error);
        res.status(500).send('병원 데이터를 가져오는 중 오류가 발생했습니다.');
    }
});
