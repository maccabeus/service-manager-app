import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch } from "react-router-dom";

import "assets/scss/styles.scss?v=1.9.0";

// pages for this product
// import Components from "views/Components/Components.js";
import WelcomePage from "views/WelcomePage/WelcomePage";
import SchedulePage from "views/SchedulePage/SchedulePage";

var hist = createBrowserHistory();

ReactDOM.render(
  <Router history={hist}>
    <Switch>
      <Route path="/schedule" component={SchedulePage} />
      <Route exact path="/" component={WelcomePage} />
    </Switch>
  </Router>,
  document.getElementById("root")
);
