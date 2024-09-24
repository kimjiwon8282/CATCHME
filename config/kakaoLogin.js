const authURL = 'https://kauth.kakao.com/oauth/authorize';
const tokenURL = 'https://kauth.kakao.com/oauth/token';
const userInfoURL = 'https://kapi.kakao.com/v2/user/me';
const clientId = process.env.CLIENT_ID;
const redirectUri = 'http://localhost:3000/callback'; // 고정된 포트 3000 사용

module.exports = {
    authURL,
    tokenURL,
    userInfoURL,
    clientId,
    redirectUri
};