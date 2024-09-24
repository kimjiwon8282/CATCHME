const chatService = require('../services/chatService');

// 사용자가 입력한 메시지를 처리하는 컨트롤러 함수
exports.handleUserMessage = async (req, res) => {
    const userMessage = req.body.message;
    try {
        const aiResponse = await chatService.getAIResponse(userMessage);
        res.status(200).json({ message: aiResponse });
    } catch (error) {
        res.status(500).json({ error: "AI 응답 처리 중 오류 발생" });
    }
};
