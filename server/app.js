import express from "express"; // express 서버
import mongoose from "mongoose"; // mongoDB 사용을 위한 mongoose
import config from "./config"; // dotenv 값을 정의한 config/index.js 파일
import morgan from "morgan"; // 로그(log)를 관리하기 위한 별도의 서드파티 라이브러리나 툴 / 로그 관리를 위한 미들웨어
import hpp from "hpp"; // 서버의 각종 취약점을 보완해주는 패키지들. 익스프레스 미들웨어로서 사용할 수 있음.
import helmet from "helmet"; // 서버의 각종 취약점을 보완해주는 패키지들. 익스프레스 미들웨어로서 사용할 수 있음.
import cors from "cors";
import path from "path";

// Routes
import postRoutes from "./routes/api/post";
import userRoutes from "./routes/api/user";
import authRoutes from "./routes/api/auth";
import searchRoutes from "./routes/api/search";

const app = express(); // express 서버를 app으로 선언
const { MONGO_URI } = config; // config에서 MONGO_URI의 값을 가져온다.
const prod = process.env.NODE_ENV === "production";

// 서버사용을 위한 세팅
app.use(hpp());
app.use(helmet());

app.use(cors({ origin: true, credentials: true }));
app.use(morgan("dev"));

app.use(express.json());

// mongoose 세팅, 만들어둔 mongoDB의 URI와 설정들을 세팅
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  }) // 위 작업에 따른 로그를 띄움.
  .then(() => console.log("MongoDB connecting Success!!"))
  .catch((e) => console.log(e));

// Use routes
// 서버에 사용할 라우터들을 연결하는 파트
app.use("/api/post", postRoutes);
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/search", searchRoutes);

// 위의 주소 외의 주소를 받으면
// 아래 소스 실행, client의 index.html 을 보내줌

if (prod) {
  app.use(express.static(path.join(__dirname, "../client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
  });
}

export default app;
