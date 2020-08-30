import express from "express";

// Model
import Post from "../../models/post";
import auth from "../../middleware/auth";

const router = express.Router();

// api/post
router.get("/", async (req, res) => {
  const postFindResult = await Post.find(); // awiat를 사용하여 Post 모델에서 모든 데이터를 찾을 때까지 아래줄로 내려가지 않음.
  console.log(postFindResult, "All Post Get");
  res.json(postFindResult);
});

router.post("/", auth, async (req, res, next) => {
  try {
    console.log(req, "req");
    const { title, contents, fileUrl, creator } = req.body;
    const newPost = await Post.create({
      title,
      contents,
      fileUrl,
      creator,
    });
    res.json(newPost);
  } catch (e) {
    console.log(e);
  }
});

export default router;
