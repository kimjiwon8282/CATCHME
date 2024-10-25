require('dotenv').config(); // 환경 변수 설정 -> 모든 파일에서 환경 변수 사용 가능
const express = require('express');
const session = require('express-session'); // 로그인 시 세션 필요
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const path = require('path');

let serviceAccount = require('./firebase-adminsdk.json');

// Express 애플리케이션 초기화
const app = express();
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' })); // 요청 본문 크기 제한 설정
app.use(bodyParser.json({ limit: '10mb' })); // JSON 요청 본문 크기 제한 설정

// Firebase 초기화
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

// 세션 미들웨어 설정
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false, // HTTPS 사용 시 true로 설정
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7일 동안 세션 유지
    }
}));

// 데이터베이스 연결
const dbConnect = require('./config/dbConnect'); // 데이터베이스 연결 함수 불러오기
dbConnect(); // MongoDB 연결

// 미들웨어
const { requireLogin } = require('./middlewares/authMiddleware');

// 서버 시작
const PORT = 3000;
app.listen(PORT, function() {
    console.log(`Server listening on port ${PORT}`);
});

// 라우트 설정
const routes = [
    './routes/authRoute',
    './routes/emailRoute',
    './routes/userRoute',
    './routes/hospitalRoute',
    './routes/kakaoLoginRoute',
    './routes/pythonResultRoute',
    './routes/roleRoute',
    './routes/alarmRoute',
    './routes/rawDataRoute'
];

routes.forEach(route => {
    app.use('/', require(route));
});

// 정적 파일 제공 경로 설정
app.use(express.static(path.join(__dirname, 'views')));

// 게임 URL 리디렉트 라우트
app.get('/game', (req, res) => {
    res.redirect('https://www.youtube.com/watch?v=Qw6gnRgwyWo');
});

// 정적 HTML 파일 라우트 설정
const routesToViews = [
    { path: '/', file: 'home.html' },
    { path: '/register', file: 'register.html' },
    { path: '/login', file: 'login.html' },
    { path: '/login/reissuepass', file: 'reissuePass.html' }
];

const authenticatedRoutesToViews = [
    { path: '/memberinfo', file: 'memberInfo.html' },
    { path: '/memberinfo/more', file: 'memberInfoMore.html' },
    { path: '/memberinfo/more/update', file: 'memberUpdate.html' },
    { path: '/memberinfo/more/updatepassword', file: 'updatePassword.html' },
    { path: '/memberinfo/more/memberdelete', file: 'memberDelete.html' }
];

// 공용 라우트 설정
routesToViews.forEach(route => {
    app.get(route.path, (req, res) => {
        res.sendFile(path.join(__dirname, 'views', route.file));
    });
});

// 로그인 필요 라우트 설정
authenticatedRoutesToViews.forEach(route => {
    app.get(route.path, requireLogin, (req, res) => {
        res.sendFile(path.join(__dirname, 'views', route.file));
    });
});
