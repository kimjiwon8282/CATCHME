const asyncHandler = require('express-async-handler');
const User = require('../models/member');
const admin = require('firebase-admin');

// 푸시 토큰을 저장하는 함수
const savePushToken = asyncHandler(async (req, res) => {
  const userId = req.session.userId; // 세션에서 사용자 ID 가져오기
  console.log(userId);

  try {
    // 사용자 데이터베이스에서 해당 유저를 찾음
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // 유저의 pushToken 업데이트
    user.pushToken = req.body.token; // 요청 본문에서 토큰 가져오기
    await user.save();

    return res.status(200).json({ message: 'Push token updated' });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating push token', error: error.message });
  }
});

// 푸시 알림을 전송하는 함수
const sendPushNotification = asyncHandler(async (req, res) => {
  const userId = req.session.userId; // 세션에서 사용자 ID 가져오기
  console.log(userId);

  try {
    // 사용자 데이터베이스에서 해당 유저를 찾음
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // contactId로 사용자의 푸시 토큰 찾기
    const guardian = await User.findById(user.contactId); // contactId로 사용자 조회
    if (!guardian) {
      return res.status(404).json({ message: 'Guardian not found' });
    }

    // 보호자의 토큰을 받음
    const target_token = guardian.pushToken;
    console.log('Guardian Push Token:', target_token);

    // 푸시 메시지 내용 구성
    const message = {
      data: {
        title: '푸시알림 테스트',
        body: '푸시알림 테스트합니다.',
        style: '테스트',
      },
      token: target_token, // 전달받은 푸시 토큰 사용
    };

    // Firebase를 통해 메시지 발송
    const response = await admin.messaging().send(message);
    console.log('Successfully sent message:', response);
    res.status(200).json({ success: true, message: '푸시 알림 전송 성공', response });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ success: false, message: '푸시 알림 전송 실패', error: error.message });
  }
});

module.exports = {
  savePushToken,
  sendPushNotification,
};