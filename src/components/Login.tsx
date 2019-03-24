import React, { FormEvent } from "react";
import { Redirect, Link } from "react-router-dom";
import { Jumbotron, Button, Row, Col, Form,  FormControl, FormGroup } from "react-bootstrap";
import PropTypes from 'prop-types';
import {LogIn} from "../actions/Auth";
import { connect } from "react-redux";
import {State as AuthState} from "../reducers/Auth";
import {Dispatch} from "redux";

export type Props = AuthState & {
  dispatch: Dispatch,
  /* We need to know what page the user tried to access so we can 
     redirect after logging in */
  location: {
    state?: {
      from: string
    }
  }
};

type State = {
  login: string;
  password: string;
  validateErrors: {login: string, password: string},
  redirectToReferrer: boolean,
  validated: boolean
}

class Login extends React.Component<Props, State> {
  static propTypes = {
    dispatch: PropTypes.func.isRequired
  };

  constructor(props: Props, ...args) {
    super(props, ...args);

    this.state = {
      login: "",
      password: "",
      validateErrors: {login: "", password: ""},
      redirectToReferrer: false,
      validated: false
    };
  }

  handleLoginChanged = (event: React.FormEvent<FormControl>) => {
    if (event.target instanceof HTMLInputElement) {
      this.handleValidation({ login: event.target.value});
    }
  };

  handlePasswordChanged = (event: FormEvent<FormControl>) => {
    if (event.target instanceof HTMLInputElement) {
      this.handleValidation({ password: event.target.value});
    }
  };

  handleValidation: (any?) => boolean = (value: Partial<State>) => {
    let newState: State = {} as State;
    Object.assign(newState, this.state);
    Object.assign(newState, value);
    newState.validated = newState.validated || typeof value === "undefined";

    let valid: boolean = true;

    // validate login
    if (newState.login.length === 0) {
      newState.validateErrors.login = "Benutzername wird benötigt.";
      valid = false;
    } else if (newState.login.length < 3) {
      newState.validateErrors.login = "Benutzername muss mindestens 3 Zeichen lang sein.";
      valid = false;
    } else {
      newState.validateErrors.login = "";
    }

    // validate password
    if (newState.password.length === 0) {
      newState.validateErrors.password = "Passwort wird benötigt.";
      valid = false;
    } else if (newState.password.length < 3) {
      newState.validateErrors.password = "Passwort muss mindestens 3 Zeichen lang sein.";
      valid = false;
    } else {
      newState.validateErrors.password = "";
    }

    this.setState(newState);
    return valid;
  };

  handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    let valid = this.handleValidation({validated: true, onLogin: true});

    if (valid) {
      LogIn(this.state.login, this.state.password, this.props);
    }
  };

  render() {
    const { from } = this.props.location.state || {
      from: { pathname: "/dashboard" }
    };

    if (this.props.isAuthenticated) {
      return <Redirect to={from} />;
    }

    return (
        <Jumbotron className={"container col-xs-6"}>
          <h2>Login</h2>
          <Form onSubmit={e => this.handleSubmit(e)}>
            <FormGroup as={Row} controlId="Login">
              <Form.Label column className={"col-sm-3"}>
                Benutzername:
              </Form.Label>
              <Col sm="9">
                <Form.Control type="text" placeholder="Benutzername" value={this.state.login} onChange={this.handleLoginChanged}
                              isValid={this.state.validated && this.state.validateErrors.login.length === 0}
                              isInvalid={this.state.validated && this.state.validateErrors.login.length > 0}
                              disabled={this.props.isLoading}/>
                <Form.Control.Feedback type={this.state.validateErrors.login.length === 0 ? 'valid' : 'invalid'}>{this.state.validateErrors.login}</Form.Control.Feedback>
              </Col>
            </FormGroup>
            <FormGroup as={Row} controlId="Password">
              <Form.Label column className={"col-sm-3"}>
                Passwort:
              </Form.Label>
              <Col sm="9">
                <Form.Control type="password"  placeholder="Passwort" value={this.state.password} onChange={this.handlePasswordChanged}
                              isValid={this.state.validated && this.state.validateErrors.password.length === 0 && !this.props.fetchError}
                              isInvalid={this.state.validated && (this.state.validateErrors.password.length > 0 || !!this.props.fetchError)}
                              disabled={this.props.isLoading}/>
                <Form.Control.Feedback type={this.state.validateErrors.password.length === 0 && !this.props.fetchError ? 'valid' : 'invalid'}>
                  {
                    this.state.validateErrors.password ||
                    ((typeof this.props.fetchError !== "undefined") && (this.props.fetchError !== null) && ("Login Fehlgeschlagen (" + (
                      //@ts-ignore
                      this.props.fetchError.message.indexOf("Found") >= 0 ? "Username und Passwort falsch" : this.props.fetchError.message
                    ) + ")"))
                  }
                </Form.Control.Feedback>
              </Col>
            </FormGroup>
            <FormGroup as={Row}>
              <Col sm="7" className="align-self-center">
                <Link to="/signup">Noch keinen Account?</Link>
              </Col>
              <Col sm ="5" className="col-push-1">
                <Button type="submit" className="float-right" variant="primary" disabled={this.props.isLoading}>
                  <span hidden={!this.props.isLoading} className="spinner-border spinner-border-sm" role="status" aria-hidden="true">&nbsp;</span>
                  Login
                </Button>
              </Col>
            </FormGroup>
          </Form>
        </Jumbotron>
    );
  }
}

export default connect((state:any) => {
  return state.Auth;
})(Login);
