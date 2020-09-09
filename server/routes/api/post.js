// 포스트 관련 라우터
import express from "express";

// Model
import Post from "../../models/post";
import Category from "../../models/category";
import User from "../../models/user";
import "@babel/polyfill"; // 문법 호환
import Comment from "../../models/comment";
import auth from "../../middleware/auth";

const router = express.Router();

// aws 저장소를 사용하기 위한 라이브러리
import multer from "multer";
import multerS3 from "multer-s3";
import path from "path";
import AWS from "aws-sdk";

import dotenv from "dotenv";
import { isNullOrUndefined } from "util";
import moment from "moment";
dotenv.config();

// AWS S3저장소를 사용하기 위해 생성
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_PRIVATE_KEY,
});

const uploadS3 = multer({
  storage: multerS3({
    s3, // 저장소
    bucket: "frontchanblog/upload", // 저장 위치
    region: "ap-northeast-2", // 지역
    key(req, file, cb) {
      const ext = path.extname(file.originalname);
      const basename = path.basename(file.originalname, ext);
      cb(null, basename + new Date().valueOf() + ext);
    },
  }),
  limits: { fileSize: 100 * 1024 * 1024 }, // 파일 용량 제한
});

// @route    POST api/post/image
// @desc     Create a Post
// @access   Private
router.post("/image", uploadS3.array("upload", 5), async (req, res, next) => {
  try {
    console.log(req.files.map((v) => v.location));
    res.json({ upload: true, url: req.files.map((v) => v.location) }); // 이미지 저장위치 반환
  } catch (e) {
    console.log(e);
    res.json({ upload: false, url: null });
  }
});

// @route    GET    api/post
// @desc     More LoadIng Posts
// @access   public

router.get("/skip/:skip", async (req, res) => {
  // 인피니티 스크롤을 이용해 포스트를 불러옴 skip에 불러올 숫자 설정
  try {
    const postCount = await Post.countDocuments(); // 전체 post 갯수를 저장
    const postFindResult = await Post.find() // 찾은 결과들을 저장
      .skip(Number(req.params.skip))
      .limit(6) // 한번에 불러올 포스트 수
      .sort({ date: -1 });

    // awiat를 사용하여 Post 모델에서 모든 데이터를 찾을 때까지 아래줄로 내려가지 않음.
    const categoryFindResult = await Category.find(); // 카테고리명을 찾아서 담는다.
    const result = { postFindResult, categoryFindResult, postCount };

    res.json(result);
  } catch (e) {
    console.log(e);
    res.json({ msg: "더 이상 포스트가 없습니다." });
  }
});

// @route     POST api/post
// @desc      Create a Post
// @access    Private

router.post("/", auth, uploadS3.none(), async (req, res, next) => {
  try {
    console.log(req, "req");
    const { title, contents, fileUrl, creator, category } = req.body;
    const newPost = await Post.create({
      // 포스트 model을 새로 생성
      title,
      contents,
      fileUrl,
      creator: req.user.id,
      date: moment().format("YYYY-MM-DD hh:mm:ss"),
    });

    const findResult = await Category.findOne({
      // 입력한 카테고리를 검색
      categoryName: category,
    });

    console.log(findResult, "Find Result");

    if (isNullOrUndefined(findResult)) {
      // 카테고리가 없으면 카테고리 를 새로 생성
      const newCategory = await Category.create({
        categoryName: category,
      });
      await Post.findByIdAndUpdate(newPost._id, {
        // 생성할 포스트의 카테고리 값에 새로 생선한 카테고리의 id값을 추가
        $push: { category: newCategory._id },
      });
      await Category.findByIdAndUpdate(newCategory._id, {
        // 생설할 카테고리의 포스트 값에 포스트의 id값 추가
        $push: { posts: newPost._id },
      });
      await User.findByIdAndUpdate(req.user.id, {
        // 요청한 유저에 model 에서 포스트 id값 추가
        $push: {
          posts: newPost._id,
        },
      });
    } else {
      // 기존에 카테고리가 있었을 경우 카테고리를 새로 생성하지 않고 실행
      await Category.findByIdAndUpdate(findResult._id, {
        $push: { posts: newPost._id },
      });
      await Post.findByIdAndUpdate(newPost._id, {
        category: findResult._id,
      });
      await User.findByIdAndUpdate(req.user.id, {
        $push: {
          posts: newPost._id,
        },
      });
    }
    return res.redirect(`/api/post/${newPost._id}`); // 포스트를 읽는 페이지로 넘김
  } catch (e) {
    console.log(e);
  }
});

// @route    POST api/post/:id
// @desc     Detail Post
// @access   Public
router.get("/:id", async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id) // id값의 포스트를 검색
      .populate("creator", "name")
      .populate({ path: "category", select: "categoryName" });
    post.views += 1; // 포스트 뷰 증가
    post.save(); // 저장
    console.log(post);
    res.json(post); // post 반환
  } catch (e) {
    console.error(e);
    next(e);
  }
});

// [Comments Route]

// @route Get api/post/comments
// @desc  Get All Comments
// @access public

router.get("/:id/comments", async (req, res) => {
  try {
    const comment = await Post.findById(req.params.id).populate({
      // 포스트를 검색하고 댓글들을 가져온다
      path: "comments",
    });
    const result = comment.comments;
    console.log(result, "comment load");
    res.json(result);
  } catch (e) {
    console.log(e);
  }
});

router.post("/:id/comments", async (req, res, next) => {
  const newComment = await Comment.create({
    // 새로운 comment model 생성
    contents: req.body.contents,
    creator: req.body.userId,
    creatorName: req.body.userName,
    post: req.body.id,
    date: moment().format("YYYY-MM-DD hh:mm:ss"),
  });
  console.log(newComment, "newComment");

  try {
    await Post.findByIdAndUpdate(req.body.id, {
      // post를 id값으로 검색하고 comment의 id값을 comments에 추가
      $push: {
        comments: newComment._id,
      },
    });
    await User.findOneAndUpdate(req.body.userId, {
      // user도 id값으로 검색하고 post와 comment id값을 추가
      $push: {
        comments: {
          post_id: req.body.id,
          comment_id: newComment._id,
        },
      },
    });
    res.json(newComment);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

// @route    Delete api/post/:id
// @desc     Delete a Post
// @access   Private

router.delete("/:id", auth, async (req, res) => {
  await Post.deleteMany({ _id: req.params.id }); // Post삭제
  await Comment.deleteMany({ post: req.params.id }); // 관련 댓글들
  await User.findByIdAndUpdate(req.user.id, {
    // 포스트 작성 user의 posts 와 comments를 삭제
    $pull: {
      posts: req.params.id,
      comments: { post_id: req.params.id },
    },
  });
  const CategoryUpdateResult = await Category.findOneAndUpdate(
    // 카테고리에서도 포스트 삭제
    { posts: req.params.id },
    { $pull: { posts: req.params.id } },
    { new: true }
  );

  if (CategoryUpdateResult.posts.length === 0) {
    // 카테고리의 포스트 수가 없으면 카테고리 제거
    await Category.deleteMany({ _id: CategoryUpdateResult });
  }
  return res.json({ success: true });
});

// @route    GET api/post/:id/edit
// @desc     Edit Post
// @access   Private
router.get("./:id/edit", auth, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate("creator", "name");
    res.json(post);
  } catch (e) {
    console.log(e);
  }
});

router.post("/:id/edit", auth, async (req, res, next) => {
  console.log(req, "api/post/:id/edit");
  const {
    body: { title, contents, fileUrl, id },
  } = req;

  try {
    const modified_post = await Post.findByIdAndUpdate(
      // id값으로 찾은 포스트의 데이터를 수정하고 저장
      id,
      {
        title,
        contents,
        fileUrl,
        date: moment().format("YYYY-MM-DD hh:mm:ss"),
      },
      { new: true }
    );
    console.log(modified_post, "edit modified");
    res.redirect(`/api/post/${modified_post.id}`); // 수정된 포스트를 보여준다
  } catch (e) {
    console.log(e);
    next(e);
  }
});

router.get("/category/:categoryName", async (req, res, next) => {
  try {
    const result = await Category.findOne(
      // 요청받은 카테고리를 찾아서 보여준다.
      {
        categoryName: {
          $regex: req.params.categoryName,
          $options: "i",
        },
      },
      "posts"
    ).populate({ path: "posts" });
    console.log(result, "Category Find result");
    res.send(result);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

export default router;
