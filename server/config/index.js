import dotenv from "dotenv"; // .env사용을 위한 dotenv
dotenv.config(); // dotenv 사용

export default {
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  PORT: process.env.PORT,
};
