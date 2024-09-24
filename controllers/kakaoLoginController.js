const asyncHandler = require('express-async-handler');
const { getAuthURL, getToken, getUserInfo, findOrCreateUser } = require('../services/kakaoLoginService');

const getKakaoLogin = asyncHandler(async (req, res) => {
    const authURL = getAuthURL();
    console.log(authURL);
    res.redirect(authURL);
});

const getTokenResponse = asyncHandler(async (req, res) => {
    try {
        const { code } = req.query;
        const accessToken = await getToken(code);
        const userInfo = await getUserInfo(accessToken);
        console.log(userInfo); // 응답 데이터 전체 출력

        const { id: kakaoId, properties: { nickname: name }, kakao_account: { age_range: ageRange, gender } } = userInfo;

        // 추가 동의가 필요한 경우 처리 (선택적)
        if (!ageRange || !gender) {
            const requiredScopes = [];
            if (!ageRange) requiredScopes.push('age_range');
            if (!gender) requiredScopes.push('gender');
            if (requiredScopes.length) {
                return res.redirect(getAuthURL() + `&scope=${requiredScopes.join(',')}`);
            }
        }
        
        console.log(kakaoId, name, ageRange, gender);

        const user = await findOrCreateUser(kakaoId, name, ageRange, gender);

        // 세션에 사용자 정보 저장
        req.session.userId = user._id;

        //console.log(userInfo);
        console.log(req.session)
        console.log('kakaoLogin success');
        res.redirect("/memberinfo")
    } catch (error) {
        console.error('Error during Kakao login:', error.response?.data || error.message);
        res.status(500).send('Kakao login failed');
    }
});

const kakaoLogout = asyncHandler(async (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send("로그아웃 중 오류가 발생했습니다.");
        }
        // 로그아웃 후 로그인 페이지로 리디렉션
        console.log('kakaoLogout');
        res.redirect("/");
    });
});

module.exports = {
    getKakaoLogin,
    getTokenResponse,
    kakaoLogout
};