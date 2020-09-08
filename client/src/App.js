import React from "react";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import store, { history } from "./store";
import MyRouter from "./routes/Router";

import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/custom.scss";

// store를 사용해 전체 state를 관리, connectedRouter를 사용해 history객체 사용
const App = () => {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <MyRouter />
      </ConnectedRouter>
    </Provider>
  );
};

export default App;
