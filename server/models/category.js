import mongoose from "mongoose";

// Create Schema
// mongoDB에 스키마를 생성해주는 model 파트, 데이터가 들어가면 자동으로 _id필드에 고유 값이 들어간다.
// 다른 스키마를 참조해야 하는 경우 "ref:참조스키마" 를 사용해야 한다.
const CategorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    default: "미분류",
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post",
    },
  ],
});

const Category = mongoose.model("category", CategorySchema);

export default Category;
