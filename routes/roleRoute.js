const express = require("express");
const router = express.Router();
const {setGuardianRole,setUserRole,linkGuardianAndUser,giveQrCodeInfo } = require("../controllers/roleController");
const { requireLogin } = require('../middlewares/authMiddleware');

// 세션 디비 보호자,사용자 등록
router.route("/role/guardian").post(requireLogin, setGuardianRole); //카메라 띄움
router.route("/role/user").post(requireLogin, setUserRole);

// 사용자 -> qr에 userId 정보 전달
router.route("/role/qr").get(requireLogin, giveQrCodeInfo);

router.route("/role/contact").post(requireLogin, linkGuardianAndUser );

module.exports = router;