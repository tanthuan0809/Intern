import { takeLatest, call, put, all } from "redux-saga/effects";
import axios from "axios";

import CONTANTS, { LIMIT_COMMENTS } from "../contants/contants";
import { CONFIG_CONSTANTS } from "../config";

const {
  API_CALL_SUCCESS,
  API_CALL_FAILURE,
  API_CALL_REQUEST,
  API_LOAD_MORE,
  API_LOAD_MORE_SUCCESS,
  API_LOAD_MORE_FAILURE,
  POST_COMMENT,
  POST_COMMENT_FAILURE,
  POST_COMMENT_SUCCESS,
  DELETE_COMMENT,
  DELETE_COMMENT_SUCCESS,
  DELETE_COMMENT_FAILURE,
  UPDATE_COMMENT,
  UPDATE_COMMENT_SUCCESS,
  UPDATE_COMMENT_FAILURE,
  REPLY_COMMENT,
  REPLY_COMMENT_SUCCESS,
  REPLY_COMMENT_FAILURE
} = CONTANTS.ACTIONS;

const { API_URL } = CONFIG_CONSTANTS;

async function fetchComment(page = 1) {
  const res = await axios.get(
    `${API_URL}/comments?_sort=id&_order=desc&_page=${page}&_limit=${LIMIT_COMMENTS}`
  );
  return res;
}

async function postComment(data) {
  let res = await axios.post(`${API_URL}/comments`, data);
  return res;
}

async function patchComment(comment) {
  let res = await axios.patch(`${API_URL}/comments/${comment.id}`, {
    ...comment
  });
  return res.status;
}

async function deleteComment(id) {
  let res = await axios.delete(`${API_URL}/comments/${id}`);
  return res.status;
}

function* workerFetchMoreComment(action) {
  try {
    const responseMore = yield call(fetchComment, action.page);
    const dataMore = responseMore.data;
    yield put({ type: API_LOAD_MORE_SUCCESS, payload: dataMore });
  } catch (error) {
    // dispatch
    yield put({ type: API_LOAD_MORE_FAILURE, error: error.message });
  }
}

function* workerFetchComment() {
  try {
    const response = yield call(fetchComment);
    const { data } = response;
    const limit = response.headers["x-total-count"];
    // dispatch
    yield put({ type: API_CALL_SUCCESS, payload: data, limit });
  } catch (error) {
    // dispatch
    yield put({ type: API_CALL_FAILURE, error: `Can't get API` });
  }
}

function* workerPostComment(action) {
  try {
    yield call(postComment, action.payload);
    yield put({ type: POST_COMMENT_SUCCESS });
    yield put({ type: API_CALL_REQUEST });
    //call hidden visible
    yield call(action.callback);
  } catch (error) {
    console.log(error);
    yield call(action.callback);
    yield put({
      type: POST_COMMENT_FAILURE,
      error: `${error.response.status} Can't post comment. Try again.`
    });
  }
}

function* workerDeleteComment(action) {
  try {
    yield call(deleteComment, action.payload);
    yield put({ type: DELETE_COMMENT_SUCCESS });
    yield put({ type: API_CALL_REQUEST });
    //call hidden visible
    yield call(action.callback);
  } catch (error) {
    yield put({ type: DELETE_COMMENT_FAILURE, error: error.message });
  }
}

function* workerUpdateComment(action) {
  try {
    yield call(patchComment, action.payload);
    yield put({ type: UPDATE_COMMENT_SUCCESS });
    yield put({ type: API_CALL_REQUEST });
    //call hidden visible
    yield call(action.callback);
  } catch (error) {
    yield call(action.callback);
    yield put({
      type: UPDATE_COMMENT_FAILURE,
      error: `${error.response.status} Try edit comment again`
    });
  }
}

function* workerReplyComment(action) {
  try {
    yield call(patchComment, action.payload);
    yield put({ type: REPLY_COMMENT_SUCCESS });
    yield put({ type: API_CALL_REQUEST });
    //call hidden visible
    yield call(action.callback);
  } catch (error) {
    yield call(action.callback);
    yield put({
      type: REPLY_COMMENT_FAILURE,
      error: `${error.response.status} Try comment again`
    });
  }
}

export function* watchFetch() {
  yield all([
    takeLatest(API_CALL_REQUEST, workerFetchComment),
    takeLatest(API_LOAD_MORE, workerFetchMoreComment),
    takeLatest(POST_COMMENT, workerPostComment),
    takeLatest(DELETE_COMMENT, workerDeleteComment),
    takeLatest(UPDATE_COMMENT, workerUpdateComment),
    takeLatest(REPLY_COMMENT, workerReplyComment)
  ]);
}
