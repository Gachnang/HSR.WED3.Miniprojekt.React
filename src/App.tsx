import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  withRouter, Redirect
} from "react-router-dom";

import Welcome from "./components/Welcome";
import Login from "./components/Login";
import Signup from "./components/Signup";
import NewPayment from './components/NewPayment';

import PrivateRoute from "./components/PrivateRoute";

import * as api from "./api";

import { User } from "./api";
import {Button, Nav, Navbar} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.css';

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
      return (
          <Navbar variant="dark" bg="dark" collapseOnSelect expand="md">
            <Navbar.Brand as={Link} to="/">Bank of Rapperswil</Navbar.Brand>
            <Navbar.Toggle label={"Collapse"} aria-controls="navbarContent"/>
            <Navbar.Collapse>
              <Nav className="mr-auto">
                <Nav.Item>
                  <Nav.Link as={Link} to="/">Home</Nav.Link>
                </Nav.Item>
                {(isAuthenticated && user) ? (
                  <>
                    <Nav.Item>
                      <Nav.Link as={Link} to="/dashboard">Kontoübersicht</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link as={Link} to="/transactions">Zahlungen</Nav.Link>
                    </Nav.Item>
                  </>
                ) : (null)
                }
              </Nav>

              <Nav>
              { (isAuthenticated && user) ? (
                  <>
                    <Nav.Item>
                      <Navbar.Text>{user.firstname} {user.lastname} &ndash; {user.accountNr}</Navbar.Text>
                      <Button variant="outline-light" className={"ml-1"} onClick={event => {
                        event.preventDefault();
                        this.signout(() => history.push("/"));
                      }}>LogOut</Button>
                    </Nav.Item>
                  </>
              ) : (

                  <Nav.Item>
                    <Button variant="outline-light" as={Link} to={"/signup"}>Registrieren</Button>
                  </Nav.Item>

              )}
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
    });

    return (
      <Router>
        <>
          <MenuBar />
          <div className="m-2">
          <Route
            exact
            path="/"
            render={() => <Redirect to="/welcome"/>}
          />
          <Route
            exact
            path="/welcome"

            render={props => (
              <Welcome {...props} isAuthenticated={isAuthenticated} />
            )}
          />
          <Route
            path="/login"
            render={props => isAuthenticated ? (
              <Redirect to="/"/>
              ) : (
              <Login {...props} authenticate={this.authenticate} />
            )} />
          <Route
            path="/signup"
            render={props => isAuthenticated ? (
              <Redirect to="/"/>
              ) : (
              <Signup {...props} authenticate={this.authenticate} />
              )} />
          {/* 
            This is a comment inside JSX! It's a bit ugly, but works fine.

            The following are protected routes that are only available for logged-in users. We also pass the user and token so 
            these components can do API calls. PrivateRoute is not part of react-router but our own implementation.
          */}
          <PrivateRoute
            path="/dashboard"
            isAuthenticated={isAuthenticated}
            token={token}
            user={user}
            component={() => <div />}
          />
          <PrivateRoute
            path="/transactions"
            isAuthenticated={isAuthenticated}
            token={token}
            user={user}
            component={NewPayment}
          />
        </div>
        </>
      </Router>
    );
  }
}

export default App;
