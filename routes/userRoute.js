const express = require('express');
const { requireLogin } = require('../middlewares/authMiddleware');
const { getUserInfo, updateUserInfo } = require('../controllers/userController');
const router = express.Router();

router.route('/userinfo')
    .get(requireLogin, getUserInfo)
    .patch(requireLogin, updateUserInfo);

module.exports = router;
