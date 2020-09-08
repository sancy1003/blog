import mongoose from "mongoose";
import moment from "moment";

// Create Schema
// mongoDB에 스키마를 생성해주는 model 파트, 데이터가 들어가면 자동으로 _id필드에 고유 값이 들어간다.
// 다른 스키마를 참조해야 하는 경우 "ref:참조스키마" 를 사용해야 한다.
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["Admin", "SubAdmin", "User"],
    default: "User",
  },
  register_date: {
    type: Date,
    default: moment().format("YYYY-MM-DD hh:mm:ss"),
  },
  comments: [
    {
      post_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
      comment_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    },
  ],
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post",
    },
  ],
});

const User = mongoose.model("user", UserSchema);

export default User;
