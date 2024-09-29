const asyncHandler = require("express-async-handler"); //try catch (err)
const mongoose = require('mongoose');
const User = require('../models/member');

//세션,디비에 보호자라고 저장, 프론트는 카메라 띄움
const setGuardianRole = asyncHandler(async (req, res) => {
    const userId  = req.session.userId;
    console.log(userId);

    try {
        // 사용자 데이터베이스에서 해당 유저를 찾음
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // 세션에 role 저장
        req.session.role = 'GUARDIAN';
        console.log(req.session)

        // 유저의 role을 업데이트
        user.role = 'GUARDIAN';
        await user.save();

        return res.status(200).json({ message: 'Role updated to guardian' });
    } catch (error) {
        return res.status(500).json({ message: 'Error updating role', error: error.message });
    }
});

//세션,디비에 사용자라고 저장, 리다이랙트
const setUserRole = asyncHandler(async (req, res) => {
    const userId = req.session.userId;
    console.log('User ID:', userId);

    try {
        // 사용자 데이터베이스에서 해당 유저를 찾음
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // 세션에 role 저장
        req.session.role = 'USER';
        console.log(req.session);

        // 유저의 role을 업데이트
        user.role = 'USER';
        await user.save();
        res.redirect('/role/qr');
        // return res.status(200).json({ message: 'Role updated to user', next: '/role/qr' });
    } catch (error) {
        return res.status(500).json({ message: 'Error updating role', error: error.message });
    }
});

//qr코드에 사용자 id 정보 전달
const giveQrCodeInfo = asyncHandler(async (req, res) => {
    try {
        const userId = req.session.userId;
        console.log('User ID:', userId);

        // QR 코드에 포함할 데이터 (예: 사용자 ID 또는 다른 정보)
        const qrData = `User ID: ${userId}`; 
        console.log(qrData)

        // QR 코드를 클라이언트에 반환
        return res.status(200).json({ qrData });
    } catch (error) {
        return res.status(500).json({ message: 'Error generating QR code', error: error.message });
    }
});

const linkGuardianAndUser = asyncHandler(async (req, res) => {
    const userId = req.body.userId; // 보호자가 전달한 사용자 ID
    const guardianId = req.session.userId; // 세션에서 보호자 ID를 가져옵니다.
    console.log(userId)
    console.log(guardianId)

    try {
        // 사용자와 보호자 찾기
        const user = await User.findById(userId);
        const guardian = await User.findById(guardianId);

        // 사용자와 보호자 유무 확인
        if (!user || !guardian) {
            return res.status(404).json({ message: 'User or Guardian not found' });
        }

        // 보호자의 contactId에 사용자 ID 저장
        guardian.contactId = userId;
        await guardian.save();

        // 사용자의 contactId에 보호자 ID 저장
        user.contactId = guardianId;
        await user.save();

        return res.status(200).json({ message: 'Guardian and User linked successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Error linking Guardian and User', error: error.message });
    }
});

module.exports = {
    setGuardianRole,
    setUserRole,
    giveQrCodeInfo,
    linkGuardianAndUser
};