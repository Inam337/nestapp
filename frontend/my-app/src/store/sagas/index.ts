// store/sagas/index.ts
import { all, fork } from "redux-saga/effects";
import { authSaga } from "../auth/auth.saga";

// Example watcher saga
function* watchDrawerSaga() {
  // You can put drawer-related saga logic here, e.g., logging, analytics, async actions
  // yield takeEvery('drawer/openDrawer', yourWorkerSaga);
}

export default function* rootSaga() {
  yield all([fork(watchDrawerSaga), fork(authSaga)]);
}
