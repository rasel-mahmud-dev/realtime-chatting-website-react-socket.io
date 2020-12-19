import React from "react";
import ReactDom from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import  store  from "./store";

import "./asserts/fontawesome-pro-5.12.0-web/css/all.css"

ReactDom.render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>,
  document.querySelector("#root")
);

if (module.hot) {
  module.hot.accept();
}
