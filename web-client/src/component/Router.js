import React from "react";
import {
  Route,
  Switch,
  Redirect,
  BrowserRouter as Router,
} from "react-router-dom";
import { Login, DashBoard, Maps } from "../screens";

const PrivateRoute = ({ component, ...rest }) => {
  const isAuthed = localStorage.getItem("AUTH_TOKEN");
  return (
    <Route
      {...rest}
      exact
      render={(props) =>
        isAuthed ? (
          React.createElement(component, props)
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
};

export default () => (
  <Router>
    <Switch>
      <Route exact path="/login" component={Login} />
      <PrivateRoute path='/Maps' component={Maps} />
      <PrivateRoute path="/" component={DashBoard} />
    </Switch>
  </Router>
);
