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

  // 푸시 알림을 전송하는 함수 (파라미터로 제목과 본문을 받음)
const sendPushNotification = asyncHandler(async (userId, title = '공란', body = '공란') => {
  console.log(userId);

  try {
    // 사용자 데이터베이스에서 해당 유저를 찾음
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // contactId로 사용자의 푸시 토큰 찾기
    const guardian = await User.findById(user.contactId); // contactId로 사용자 조회
    if (!guardian || !guardian.pushToken) {
      throw new Error('Guardian or Push token not found');
    }

    // 보호자의 토큰을 받음
    const target_token = guardian.pushToken;
    console.log('Guardian Push Token:', target_token);

    // 푸시 메시지 내용 구성
    const message = {
      notification: {
        title: title,
        body: body,
      },
      token: target_token, // 전달받은 푸시 토큰 사용
    };

    // Firebase를 통해 메시지 발송
    const response = await admin.messaging().send(message);
    console.log('Successfully sent message:', response);
  } catch (error) {
    console.error('Error sending message:', error);
    throw new Error('Push notification failed');
  }
});

module.exports = {
  savePushToken,
  sendPushNotification,
};