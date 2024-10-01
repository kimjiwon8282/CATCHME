const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /^[가-힣]+$/.test(v); // 한글만 허용
            },
            message: props => `${props.value}는 한글만 입력 가능합니다.`
        }
    },
    contactId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // 이 필드는 다른 User 문서와 연결됩니다.
        sparse: true // 비어 있을 수 있습니다.
    },
    email: {
        type: String,
        required: function() {
            return !this.kakaoId; // 카카오 로그인이 없을 때만 이메일 필수
        },
        unique: true
    },
    password: {
        type: String,
        required: function() {
            return !this.kakaoId; // 카카오 로그인이 없을 때만 비밀번호 필수
        }
    },
    phoneNumber: {
        type: String,
        required: function() {
            return !this.kakaoId; // 카카오 로그인이 없을 때만 이메일 필수
        },
        unique: true,
        validate: {
            validator: function(v) {
                return /^010\d{8}$/.test(v); // 010으로 시작하고 뒤에 8자리 숫자인지 확인
            },
            message: props => `${props.value}는 유효한 핸드폰 번호가 아닙니다.`
        }
    },
    role: {
        type: String,
        enum: ['GUARDIAN', 'USER'],
        required: true,
        default: 'USER'  // 기본값 추가
    },
    kakaoId: {
        type: String,
        unique: true, // 각 사용자는 고유한 카카오 ID를 가집니다.
        sparse: true // 이 필드는 비어 있을 수 있습니다.
    },
    ageRange: {
        type: String,
        enum: [
            '1~9', '10~14', '15~19', '20~29', 
            '30~39', '40~49', '50~59', 
            '60~69', '70~79', '80~89', '90~'
        ], // 유효한 연령대 범위
        required: true // ageRange를 필수로 지정
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        required: true
    },
    pushToken: {
        type: String,
        sparse: true // 이 필드는 비어 있을 수 있습니다.
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
