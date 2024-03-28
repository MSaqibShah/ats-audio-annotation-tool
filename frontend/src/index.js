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
import Intent from "./views/intent";
import Emotions from "./views/emotions";
import Responses from "./views/response";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Page} />
        <Route path="/intent" component={Intent} />
        <Route path="/emotion" component={Emotions} />
        <Route path="/response" component={Responses} />
        <Route path="/404" component={NotFound} />
        <Redirect from="*" to="/404" />
      </Switch>
    </Router>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
