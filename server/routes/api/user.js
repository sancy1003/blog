// 회원 관련 라우터
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import auth from "../../middleware/auth";
import config from "../../config/index";
const { JWT_SECRET } = config;

// Model
import User from "../../models/user";

const router = express.Router();

// @routes     GET api/user
// @desc       Get all user
// @access     public

router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    if (!users) throw Error("No users");
    res.status(200).json(users);
  } catch (e) {
    console.log(e);
    res.status(400).json({ msg: e.message });
  }
});

// @routes     POST api/user
// @desc       Register user
// @access     public

router.post("/", (req, res) => {
  console.log(req);
  const { name, email, password } = req.body; // 가입을 위해 입력한 name, email, password를 가져옴

  // Simple validation
  if (!name || !email || !password) {
    return res.status(400).json({ msg: "모든 필드를 채워주세요." });
  }

  // Check for exising user
  User.findOne({ email }).then((user) => {
    // User model에서 입력한 email 값을 찾고 user를 반환
    if (user)
      return res.status(400).json({ msg: "이미 가입된 유저가 존재합니다." }); // user가 있으면 중복 처리
    const newUser = new User({
      //유저가 없으면 새로운 model 생성
      name,
      email,
      password,
    });

    // bcrypt를 이용한 비밀번호 암호화
    bcrypt.genSalt(10, (err, salt) => {
      // 암호 복잡도 설정
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        // 새로만들 유저 패스워드를 암호화
        if (err) throw err;
        newUser.password = hash; // 암호화 적용
        newUser.save().then((user) => {
          // 암호화한 비밀번호를 저장하고 로그인 시킴
          jwt.sign(
            { id: user.id },
            JWT_SECRET,
            { expiresIn: "30 m" },
            (err, token) => {
              if (err) throw err;
              res.json({
                token,
                user: {
                  id: user.id,
                  name: user.name,
                  email: user.email,
                },
              });
            }
          );
        });
      });
    });
  });
});

// @route    Post   api/user/:username/profile
// @desc     Post   Edit Password
// @access   Private

router.post("/:userName/profile", auth, async (req, res) => {
  try {
    const { previousPassword, password, rePassword, userId } = req.body;
    console.log(req.body, "userName Profile");
    const result = await User.findById(userId, "password"); // userId를 검색하여 패스워드를 찾는다.

    bcrypt.compare(previousPassword, result.password).then((isMatch) => {
      // 이전 패스워드와 유저로 검색한 패스워드가 같을 때 변경 과정 실행
      if (!isMatch) {
        // 이전 암호 미일치
        return res.status(400).json({
          match_msg: "기존 비밀번호와 일치하지 않습니다.",
        });
      } else {
        if (password === rePassword) {
          // 새로 변경할 패스워드 일치 시
          bcrypt.genSalt(10, (err, salt) => {
            // 새로 변경할 패스워드 암호화
            bcrypt.hash(password, salt, (err, hash) => {
              if (err) throw err;
              result.password = hash;
              result.save();
            });
          });
          res
            .status(200)
            .json({ success_msg: "비밀번호 업데이트에 성공했습니다." });
        } else {
          res
            .status(400)
            .json({ fail_msg: "새로운 비밀번호가 일치하지 않습니다." });
        }
      }
    });
  } catch (e) {
    console.log(e);
  }
});

export default router;
