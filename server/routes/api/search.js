import express from "express";
const router = express.Router();

import Post from "../../models/post";

router.get("/:searchTerm", async (req, res, next) => {
  try {
    const result = await Post.find({
      // title에 검색어가 포함되어 있는지 확인하고 결과를 돌려줌
      title: {
        $regex: req.params.searchTerm,
        $options: "i",
      },
    });
    console.log(result, "Search result");
    res.send(result);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

export default router;
