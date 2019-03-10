import React, { FormEvent } from "react";
import { Redirect, Link } from "react-router-dom";
import Jumbotron from "react-bootstrap/Jumbotron";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import {Button, Col, FormControl, FormGroup} from "react-bootstrap";
import {object, string} from "prop-types";

export type Props = {
  /* Callback to submit an authentication request to the server */
  authenticate: (
    login: string,
    password: string,
    callback: (error?: Error) => void
  ) => void,
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
  error?: any;
  validateErrors: {login: string, password: string},
  redirectToReferrer: boolean,
  validated: boolean
}

class Login extends React.Component<Props, State> {
  constructor(props: Props, ...args) {
    super(props, ...args);

    this.state = {
      login: "",
      password: "",
      error: undefined,
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

  handleValidation: (any?) => boolean = (value) => {
    let newState = Object.assign(this.state, value);
    newState.validated = newState.validated || typeof value === "undefined";

    let valid: boolean = true;

    // validate login
    if (this.state.login.length === 0) {
      newState.validateErrors.login = "Benutzername wird benötigt.";
      valid = false;
    } else if (this.state.login.length < 3) {
      newState.validateErrors.login = "Benutzername muss mindestens 3 Zeichen lang sein.";
      valid = false;
    } else {
      newState.validateErrors.login = "";
    }

    // validate password
    if (this.state.password.length === 0) {
      newState.validateErrors.password = "Passwort wird benötigt.";
      valid = false;
    } else if (this.state.password.length < 3) {
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

    let valid = this.handleValidation();

    if (valid) {
      const {login, password} = this.state;
      this.props.authenticate(login, password, error => {
        if (error) {
          this.setState({error: error, validateErrors: Object.assign(this.state.validateErrors, {password: "Logindaten waren nicht korrekt. (Oder ein anderer Fehler ist aufgetretten...)"})});
        } else {
          this.setState({redirectToReferrer: true, error: null});
        }
      });
    }
  };

  render() {
    const { from } = this.props.location.state || {
      from: { pathname: "/dashboard" }
    };
    const { redirectToReferrer } = this.state;

    if (redirectToReferrer) {
      return <Redirect to={from} />;
    }

    // @ts-ignore
    return (
        <Jumbotron className={"container col-xs-6"}>
          <h2>Login</h2>
          <Form onSubmit={e => this.handleSubmit(e)}>
            <FormGroup as={Row} controlId="Login">
              <Form.Label column className={"col-sm-3"}>
                Benutzername:
              </Form.Label>
              <Col sm="9">
                <Form.Control id="Login" type="text" placeholder="Benutzername" value={this.state.login} onChange={this.handleLoginChanged}
                              isValid={this.state.validated && this.state.validateErrors.login.length === 0}
                              isInvalid={this.state.validated && this.state.validateErrors.login.length > 0} />
                <Form.Control.Feedback type={this.state.validateErrors.login.length === 0 ? 'valid' : 'invalid'}>{this.state.validateErrors.login}</Form.Control.Feedback>
              </Col>
            </FormGroup>
            <FormGroup as={Row} controlId="Password">
              <Form.Label column className={"col-sm-3"}>
                Passwort:
              </Form.Label>
              <Col sm="9">
                <Form.Control id="Password" type="password"  placeholder="Passwort" value={this.state.password} onChange={this.handlePasswordChanged}
                              isValid={this.state.validated && this.state.validateErrors.password.length === 0}
                              isInvalid={this.state.validated && this.state.validateErrors.password.length > 0}/>
                <Form.Control.Feedback type={this.state.validateErrors.password.length === 0 ? 'valid' : 'invalid'}>{this.state.validateErrors.password}</Form.Control.Feedback>
              </Col>
            </FormGroup>
            <FormGroup as={Row}>
              <Col sm="7" className="align-self-center">
                <Link to="/signup">Noch keinen Account?</Link>
              </Col>
              <Col sm ="5" className="col-push-1">
                <Button type="submit" className="float-right" variant="primary">Login</Button>
              </Col>
            </FormGroup>
          </Form>
        </Jumbotron>
    );
  }
}

export default Login;
