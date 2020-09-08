import jwt from "jsonwebtoken"; // token기반의 회원 인증을 위해 jwt 라이브러리를 사용
import config from "../config/index";

const { JWT_SECRET } = config; // JWT_SECRET 값을 가져옴

const auth = (req, res, next) => {
  const token = req.header("x-auth-token"); // token 값을 req의 헤더의 x-auth-token에서 받는다.

  if (!token) {
    // 토큰값에 따른 res
    return res
      .status(401) // 성공시 401 상태 반환
      .json({ msg: "토큰값이 없어 인증이 거부되었습니다." }); // json 값을 반환한다.
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next(); // next() 함수를 호출하여 스택 내의 그 다음 미들웨어 함수에 요청을 전달
  } catch (e) {
    console.log(e);
    res.status(400).json({ msg: "토큰값이 유효하지 않습니다." }); // json 값을 반환한다.
    // 실패 시 400 상태 반환
  }
};

export default auth;
