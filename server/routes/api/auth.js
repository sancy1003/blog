// 회원 인증 관련 라우터
import express from "express";
import bcrypt from "bcryptjs"; // 비밀번호 암호화를 위해 bcrypt 라이브러리 사용
import jwt from "jsonwebtoken"; // token을 이용한 회원 인증 사용을 위해 jwt 라이브러리 사용
import auth from "../../middleware/auth"; // 인증 관련 미들웨어
import config from "../../config/index";
const { JWT_SECRET } = config;

// Model
import User from "../../models/user";

const router = express.Router(); // 서버 라우터 선언

// @route     POST  api/auth
// @desc      Auth  user
// @access    public
router.post("/", (req, res) => {
  const { email, password } = req.body; // req.body에 담겨있는 emai, password 값을 받음.

  // Simple Validation
  if (!email || !password) {
    return res.status(400).json({ msg: "모든 필드를 채워주세요." });
  }

  // Check for existing user
  User.findOne({ email }).then((user) => {
    // User 스키마에서 email값을 검색해서 user 값으로 넘긴다.
    if (!user)
      // 검색한 user값이 없으면 반환
      return res.status(400).json({ msg: "유저가 존재하지 않습니다." });

    // Validate password
    bcrypt.compare(password, user.password).then((isMatched) => {
      // 받아온 유저 정보와 비밀번호를 비교하여 일치 확인
      if (!isMatched)
        return res.status(400).json({ msg: "비밀번호가 일치하지 않습니다." }); // 미일치 시 반환
      jwt.sign(
        // 일치하면 로그인을 위해 jwt 라이브러리를 이용
        { id: user.id }, // id는 검색 유저값의 id
        JWT_SECRET,
        { expiresIn: "30 m" }, // 유효 시간
        (err, token) => {
          if (err) throw err;
          res.json({
            // 토큰 값과 유저 정보를 반환한다.
            token,
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            },
          });
        }
      );
    });
  });
});

router.post("/logout", (req, res) => {
  res.json("로그아웃 성공");
  // 로그아웃은 front end 파트에서 적용
});

router.get("/user", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // 요청받은 id를 User model 에 검색
    if (!user) throw Error("유저가 존재하지 않습니다.");
    res.json(user); // user 반환
  } catch (e) {
    console.log(e);
    res.status(400).json({ msg: e.message });
  }
});

export default router;
