import axios from "axios";
import { push } from "connected-react-router";
import { call, put, takeEvery, all, fork } from "redux-saga/effects";
import {
  LOGIN_FAILURE,
  LOGIN_SUCCESS,
  LOGIN_REQUEST,
  LOGOUT_FAILURE,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  USER_LOADING_SUCCESS,
  USER_LOADING_FAILURE,
  USER_LOADING_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  REGISTER_REQUEST,
  CLEAR_ERROR_REQUEST,
  CLEAR_ERROR_FAILURE,
  CLEAR_ERROR_SUCCESS,
  PASSWORD_EDIT_UPLOADING_SUCCESS,
  PASSWORD_EDIT_UPLOADING_FAILURE,
  PASSWORD_EDIT_UPLOADING_REQUEST,
} from "../types";

// Login
const loginUserAPI = (loginData) => {
  console.log(loginData, "loginData");
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  return axios.post("api/auth", loginData, config);
};

function* loginUser(action) {
  try {
    const result = yield call(loginUserAPI, action.payload);
    console.log(result);
    yield put({
      type: LOGIN_SUCCESS,
      payload: result.data,
    });
  } catch (e) {
    yield put({
      type: LOGIN_FAILURE,
      payload: e.response,
    });
  }
}

function* watchLoginUser() {
  yield takeEvery(LOGIN_REQUEST, loginUser);
}

// LOGOUT
function* logout() {
  try {
    yield put({
      type: LOGOUT_SUCCESS,
    });
  } catch (e) {
    yield put({
      type: LOGOUT_FAILURE,
    });
    console.log(e);
  }
}

function* watchLogout() {
  yield takeEvery(LOGOUT_REQUEST, logout);
}

// User Loading
const userLodingAPI = (token) => {
  console.log(token);
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  if (token) {
    config.headers["x-auth-token"] = token;
  }
  return axios.get("api/auth/user", config);
};

function* userLoding(action) {
  try {
    console.log(action, "userLoading");
    const result = yield call(userLodingAPI, action.payload);
    yield put({
      type: USER_LOADING_SUCCESS,
      payload: result.data,
    });
  } catch (e) {
    yield put({
      type: USER_LOADING_FAILURE,
      payload: e.response,
    });
  }
}

function* watchUserLoading() {
  yield takeEvery(USER_LOADING_REQUEST, userLoding);
}

// Register
const registerUserAPI = (req) => {
  console.log(req, "req");
  return axios.post("api/user", req);
};

function* registerUser(action) {
  try {
    const result = yield call(registerUserAPI, action.payload);
    console.log(result, "RegisterUser Data");
    yield put({
      type: REGISTER_SUCCESS,
      payload: result.data,
    });
  } catch (e) {
    yield put({
      type: REGISTER_FAILURE,
      payload: e.response,
    });
  }
}

function* watchRegisterUser() {
  yield takeEvery(REGISTER_REQUEST, registerUser);
}

// Clear Error
function* clearError() {
  try {
    yield put({
      type: CLEAR_ERROR_SUCCESS,
    });
  } catch (e) {
    yield put({
      type: CLEAR_ERROR_FAILURE,
    });
  }
}

function* watchClearError() {
  yield takeEvery(CLEAR_ERROR_REQUEST, clearError);
}

// Edit Password

const editPasswordAPI = (payload) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const token = payload.token;

  if (token) {
    config.headers["x-auth-token"] = token;
  }
  return axios.post(`/api/user/${payload.userName}/profile`, payload, config);
};

function* editPassword(action) {
  try {
    console.log(action, "EditPassword");
    const result = yield call(editPasswordAPI, action.payload);
    yield put({
      type: PASSWORD_EDIT_UPLOADING_SUCCESS,
      payload: result.data,
    });
    yield put(push("/"));
  } catch (e) {
    console.log(e, "e");
    yield put({
      type: PASSWORD_EDIT_UPLOADING_FAILURE,
      payload: e.response.data,
    });
  }
}

function* watchEditPassword() {
  yield takeEvery(PASSWORD_EDIT_UPLOADING_REQUEST, editPassword);
}

export default function* authSaga() {
  yield all([
    fork(watchLoginUser),
    fork(watchLogout),
    fork(watchUserLoading),
    fork(watchRegisterUser),
    fork(watchClearError),
    fork(watchEditPassword),
  ]);
}
