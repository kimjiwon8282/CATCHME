exports.requireLogin = (req, res, next) => {
    if (!req.session.userId) { // 세션에 userId가 없으면 로그인하지 않은 것으로 간주
        return res.status(401).send('로그인이 필요합니다.');
    }
    next();
};
