import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import loadUser from "./components/auth/loadUser";

loadUser(); // app호출 전에 유저가 로그인 한 상태인지 인증

ReactDOM.render(<App />, document.getElementById("root"));
