import React from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";

import "./style.css";
import Page from "./views/page";
import NotFound from "./views/not-found";

const App = () => {
  return <Page />;
};

ReactDOM.render(<App />, document.getElementById("app"));
