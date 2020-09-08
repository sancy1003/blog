import mongoose, { mongo } from "mongoose";
import moment from "moment"; // 세계 평균 시간 사용을 위한 라이브러리

// Create Schema
// mongoDB에 스키마를 생성해주는 model 파트, 데이터가 들어가면 자동으로 _id필드에 고유 값이 들어간다.
// 다른 스키마를 참조해야 하는 경우 "ref:참조스키마" 를 사용해야 한다.
const CommentSchema = new mongoose.Schema({
  contents: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    default: moment().format("YYYY-MM-DD hh:mm:ss"),
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "post",
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  creatorName: {
    type: String,
  },
});

const Comment = mongoose.model("comment", CommentSchema);

export default Comment;
