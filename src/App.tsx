import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  withRouter
} from "react-router-dom";

import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";

import PrivateRoute from "./components/PrivateRoute";

import * as api from "./api";

import { User } from "./api";
import {Nav} from "react-bootstrap";
import Navbar from "react-bootstrap/Navbar";
// TODO: Move to own files
const AllTransactions = () => <div />;
const Dashboard = () => <div />;

// The following are type definitions for Flow,
// an optional type checker for JavaScript. You
// can safely ignore them for now.
type Props = {};

type State = {
  isAuthenticated: boolean,
  token?: string,
  user?: User
};

class App extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
    const token = sessionStorage.getItem("token");
    const user = sessionStorage.getItem("user");
    // Initialize the state, the constructor is the
    // only place where it's ok to directlly assign
    // a value to this.state. For all other state
    // changes, use this.setState.
    if (token && user) {
      this.state = {
        isAuthenticated: true,
        token,
        user: JSON.parse(user)
      };
    } else {
      this.state = {
        isAuthenticated: false,
        token: undefined,
        user: undefined
      };
    }
  }

  authenticate = (
    login: string,
    password: string,
    callback: (error?: Error) => void
  ) => {
    api
      .login(login, password)
      .then(({ token, owner }) => {
        this.setState({ isAuthenticated: true, token, user: owner });
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("user", JSON.stringify(owner));
        callback(null);
      })
      .catch(error => callback(error));
  };

  signout = (callback: () => void) => {
    this.setState({
      isAuthenticated: false,
      token: undefined,
      user: undefined
    });
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    callback();
  };

  render() {
    const { isAuthenticated, user, token } = this.state;

    const MenuBar = withRouter(({ history, location: { pathname } }) => {
      if (isAuthenticated && user) {
        return (
          <Navbar variant="dark" bg="dark">
            <Navbar.Brand as={Link} to="/">Bänkli</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse>
              <Nav className="mr-auto">
                <Nav.Item as={Link} to="/">Home</Nav.Item>
                <Nav.Item as={Link} to="/dashboard">Kontoübersicht</Nav.Item>
                <Nav.Item as={Link} to="/transactions">Zahlungen</Nav.Item>
              </Nav>
              {/*
              <span>
                {user.firstname} {user.lastname} &ndash; {user.accountNr}
              </span>

              <Link to="/transactions"></Link>
              <a
                href="/logout"
                onClick={event => {
                  event.preventDefault();
                  this.signout(() => history.push("/"));
                }}
              >
                Logout {user.firstname} {user.lastname}
              </a>*/}
            </Navbar.Collapse>
          </Navbar>
        );
      } else {
        return null;
      }
    });

    return (
      <Router>
        <div>
          <MenuBar />
          <Route
            exact
            path="/"
            render={props => (
              <Home {...props} isAuthenticated={isAuthenticated} />
            )}
          />
          <Route
            path="/login"
            render={props => (
              <Login {...props} authenticate={this.authenticate} />
            )}
          />
          <Route path="/signup" component={Signup} />
          {/* 
            This is a comment inside JSX! It's a bit ugly, but works fine.

            The following are protected routes that are only available for logged-in users. We also pass the user and token so 
            these components can do API calls. PrivateRoute is not part of react-router but our own implementation.
          */}
          <PrivateRoute
            path="/dashboard"
            isAuthenticated={isAuthenticated}
            token={token}
            component={Dashboard}
          />
          <PrivateRoute
            path="/transactions"
            isAuthenticated={isAuthenticated}
            token={token}
            user={user}
            component={AllTransactions}
          />
        </div>
      </Router>
    );
  }
}

export default App;
