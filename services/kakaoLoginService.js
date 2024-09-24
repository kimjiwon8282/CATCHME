const axios = require('axios');
const qs = require('qs');
const { authURL, tokenURL, userInfoURL, clientId, redirectUri } = require('../config/kakaoLogin');
const User = require('../models/member');

const getAuthURL = () => 
    `${authURL}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=profile_nickname,age_range,gender`;
  

const getToken = async (code) => {
    const response = await axios.post(tokenURL, qs.stringify({
        grant_type: 'authorization_code',
        client_id: clientId,
        redirect_uri: redirectUri,
        code: code
    }), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    return response.data.access_token;
};

const getUserInfo = async (accessToken) => {
    const response = await axios.get(userInfoURL, {
        headers: { Authorization: `Bearer ${accessToken}` }
    });
    return response.data;
};

const findOrCreateUser = async (kakaoId, name, ageRange, gender) => {
    let user = await User.findOne({kakaoId});
    if (!user) {
        user = await User.create({ kakaoId, name, ageRange, gender });
    }
    return user;
};

module.exports = {
    getAuthURL,
    getToken,
    getUserInfo,
    findOrCreateUser
};