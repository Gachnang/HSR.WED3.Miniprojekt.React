import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  withRouter, Redirect
} from "react-router-dom";
import PropTypes from 'prop-types'

import AccountTransactions from "./components/AccountTransactions";
import Dashboard from "./components/Dashboard";
import Welcome from "./components/Welcome";
import Login from "./components/Login";
import Signup from "./components/Signup";

import PrivateRoute from "./components/common/PrivateRoute";

import { User } from "./api";
import {Button, Nav, Navbar} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.css';
import {connect} from "react-redux";
import { State as AuthState } from "./reducers/Auth";
import { State as TransactionState } from "./reducers/Transaction";
import {LogOut} from "./actions/Auth";
import {Dispatch} from "redux";

type Props = {
  dispatch: Dispatch,
  Auth: AuthState,
  Transaction: TransactionState
};

type State = {
  isAuthenticated: boolean,
  token?: string,
  user?: User
};

class App extends React.Component<Props, State> {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    Auth: PropTypes.any.isRequired,
    Transaction: PropTypes.any.isRequired
  };
  updater: number;

  constructor(props: any) {
    super(props);
  }

  componentDidMount(): void {
    const self = this;
    /* TimedFetch disabled!
    // @ts-ignore
    this.updater = setInterval(() => {
      if (self.props.Auth.isAuthenticated) {
        FetchTimedTransactions(self.props);
      }
    }, 10*1000);*/
  }

  componentWillUnmount(): void {
    /* TimedFetch disabled!
    clearInterval(this.updater);*/
  }

  render() {
    const { isAuthenticated, account } = this.props.Auth;
    const { firstname, lastname } = account && account.owner ? account.owner : {firstname: undefined, lastname: undefined};
    const accountNr = account && account.owner ? account.owner.accountNr : undefined;

    const MenuBar = withRouter(({ history, location: { pathname } }) => {
      return (
          <Navbar variant="dark" bg="dark" collapseOnSelect expand="md">
            <Navbar.Brand as={Link} to="/">Bank of Rapperswil</Navbar.Brand>
            <Navbar.Toggle label={"Collapse"} aria-controls="navbarContent"/>
            <Navbar.Collapse>
              <Nav className="mr-auto">
                {(isAuthenticated && account) ? (
                  <>
                    <Nav.Item>
                      <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link as={Link} to="/transactions">Konto Bewegungen</Nav.Link>
                    </Nav.Item>
                  </>
                ) : (
                  <Nav.Item>
                    <Nav.Link as={Link} to="/">Home</Nav.Link>
                  </Nav.Item>
                )}
              </Nav>

              <Nav>
              { (isAuthenticated && account) ? (
                  <>
                    <Nav.Item>
                      <Navbar.Text>{firstname} {lastname} &ndash; {accountNr}</Navbar.Text>
                      <Button variant="outline-light" className={"ml-1"} onClick={event => {
                        event.preventDefault();
                        LogOut(this.props);
                      }}>LogOut</Button>
                    </Nav.Item>
                  </>
              ) : (
                  <Nav.Item>
                    <Button variant="outline-light" as={Link} to={"/signup"}>Registrieren</Button>
                  </Nav.Item>
              )}
              </Nav>
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
              <Redirect to="/dashboard"/>
              ) : (
              <Login {...props} />
            )} />
          <Route
            path="/signup"
            render={props => isAuthenticated ? (
              <Redirect to="/dashboard"/>
              ) : (
              <Signup {...props} />
              )} />
          {/*
            This is a comment inside JSX! It's a bit ugly, but works fine.

            The following are protected routes that are only available for logged-in users. We also pass the user and token so
            these components can do API calls. PrivateRoute is not part of react-router but our own implementation.
          */}
          <PrivateRoute
            path="/dashboard"
            isAuthenticated={isAuthenticated}
            component={Dashboard}
          />
          <PrivateRoute
            path="/transactions"
            isAuthenticated={isAuthenticated}
            component={AccountTransactions}
          />
        </div>
        </>
      </Router>
    );
  }
}

export default connect((state:any) => {
  return {
    Auth: state.Auth,
    Transaction: state.Transaction
  };
})(App);
