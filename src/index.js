// import React from "react";
// import ReactDOM from "react-dom";
// import { createBrowserHistory } from "history";
// import { Router, Route, Switch } from "react-router-dom";

// import "assets/scss/material-kit-react.scss?v=1.9.0";

// // pages for this product
// import Components from "views/Components/Components.js";
// import LandingPage from "views/LandingPage/LandingPage.js";
// import ProfilePage from "views/ProfilePage/ProfilePage.js";
// import LoginPage from "views/LoginPage/LoginPage.js";

// var hist = createBrowserHistory();

// ReactDOM.render(
//   <Router history={hist}>
//     <Switch>
//       <Route path="/landing-page" component={LandingPage} />
//       <Route path="/profile-page" component={ProfilePage} />
//       <Route path="/login-page" component={LoginPage} />
//       <Route path="/" component={Components} />
//     </Switch>
//   </Router>,
//   document.getElementById("root")
// );


import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch } from "react-router-dom";

import "assets/scss/styles.scss?v=1.9.0";

// pages for this product
// import Components from "views/Components/Components.js";
import WelcomePage from "views/WelcomePage/WelcomePage";
import SchedulePage from "views/SchedulePage/SchedulePage";
import Component from "views/Components/Components";

var hist = createBrowserHistory();

ReactDOM.render(
  <Router history={hist}>
    <Switch>
      <Route path="/schedule" component={SchedulePage} />
      <Route path="/component" component={Component} />
      <Route exact path="/" component={WelcomePage} />
    </Switch>
  </Router>,
  document.getElementById("root")
);
