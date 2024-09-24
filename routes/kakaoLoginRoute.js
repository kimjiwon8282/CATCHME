const express = require("express");
const router = express.Router();
const {getKakaoLogin,getTokenResponse,kakaoLogout} = require("../controllers/kakaoLoginController")

router.route("/login/kakao").get(getKakaoLogin);
router.route("/callback").get(getTokenResponse);
router.route("/logout/kakao").get(kakaoLogout);

module.exports = router;