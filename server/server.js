import app from "./app"; // express 서버를 설정한 app.js
import config from "./config/index"; // dotenv 설정을 해둔 config

const { PORT } = config; // config에서 PORT 값 추출

// 설정해둔 포트번호를 사용하여 서버를 실행 시, 로그 출력
app.listen(PORT, () => {
  console.log(`Server started on Port ${PORT}`);
});
