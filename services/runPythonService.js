const { spawn } = require('child_process'); // 자식 프로세스 생성 기능

const runPythonScript = () => {
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python3', ['./test.py']);

        // Python 스크립트의 표준 출력 처리
        pythonProcess.stdout.on('data', (data) => {
            const result = data.toString().trim(); // 결과 문자열로 변환
            resolve(result);
        });

        // Python 스크립트의 오류 출력 처리
        pythonProcess.stderr.on('data', (data) => {
            const error = data.toString().trim(); // 오류 문자열로 변환
            reject(new Error(error));
        });

        // Python 스크립트 종료 코드 처리
        pythonProcess.on('close', (code) => {
            if (code !== 0) { //비정상 종료시 오류메시지.
                reject(new Error(`Python script exited with code ${code}`));
            }
        });
    });
};

module.exports = {
    runPythonScript
};
