import React from "react";
import {Link, Redirect} from "react-router-dom";

import Form from "react-bootstrap/Form";
import {Button, Col, Container, FormControl, FormGroup} from "react-bootstrap";
import Row from "react-bootstrap/Row";
import {State as AuthState} from "../reducers/Auth";
import {Register} from "../actions/Auth";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {Dispatch} from "redux";
import TitledCard from "./common/TitledCard";

export type Props = {
  dispatch: Dispatch,
  Auth: AuthState,
  /* We need to know what page the user tried to access so we can
     redirect after logging in */
  location: {
    state?: {
      from: string
    }
  }
};

type State = {
  login: string,
  firstname: string,
  lastname: string,
  password: string,
  validateErrors: { login: string, firstname: string, lastname: string, password: string },
  redirectToReferrer: boolean,
  validated: boolean
};

class Signup extends React.Component<Props, State> {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    Auth: PropTypes.any.isRequired
  };

  state = {
    login: "",
    firstname: "",
    lastname: "",
    password: "",
    validateErrors: {login: "", firstname: "", lastname: "", password: ""},
    error: null,
    redirectToReferrer: false,
    validated: false
  };

  handleLoginChanged = (event: React.FormEvent<FormControl>) => {
    if (event.target instanceof HTMLInputElement) {
      this.handleValidation({login: event.target.value});
    }
  };

  handleFirstNameChanged = (event: React.FormEvent<FormControl>) => {
    if (event.target instanceof HTMLInputElement) {
      this.handleValidation({firstname: event.target.value});
    }
  };

  handleLastNameChanged = (event: React.FormEvent<FormControl>) => {
    if (event.target instanceof HTMLInputElement) {
      this.handleValidation({lastname: event.target.value});
    }
  };

  handlePasswordChanged = (event: React.FormEvent<FormControl>) => {
    if (event.target instanceof HTMLInputElement) {
      this.handleValidation({password: event.target.value});
    }
  };

  handleValidation: (any?) => boolean = (value: Partial<State>) => {
    let newState: State = {} as State;
    Object.assign(newState, this.state);
    Object.assign(newState, value);
    newState.validated = true;

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

    // validate firstname
    if (newState.firstname.length === 0) {
      newState.validateErrors.firstname = "Vorname wird benötigt.";
      valid = false;
    } else if (newState.firstname.length < 3) {
      newState.validateErrors.firstname = "Vorname muss mindestens 3 Zeichen lang sein.";
      valid = false;
    } else {
      newState.validateErrors.firstname = "";
    }

    // validate lastname
    if (newState.lastname.length === 0) {
      newState.validateErrors.lastname = "Nachname wird benötigt.";
      valid = false;
    } else if (newState.lastname.length < 3) {
      newState.validateErrors.lastname = "Nachname muss mindestens 3 Zeichen lang sein.";
      valid = false;
    } else {
      newState.validateErrors.lastname = "";
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

  isEverythingValid = () => {
    return this.state.validated
      && this.state.validateErrors.firstname.length === 0
      && this.state.validateErrors.lastname.length === 0
      && this.state.validateErrors.login.length === 0
      && this.state.validateErrors.password.length === 0
  };

  handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    let valid = this.handleValidation();

    const {login, firstname, lastname, password} = this.state;

    if (valid) {
      Register(login, firstname, lastname, password, this.props);
    }
  };

  render() {
    const {redirectToReferrer, error} = this.state;

    if (redirectToReferrer) {
      return <Redirect to="/login"/>;
    }

    return (
      <Container className="col-xs-6">
        <TitledCard title="Registrieren">
          <Form onSubmit={e => this.handleSubmit(e)}>
            <FormGroup as={Row} controlId="Login">
              <Form.Label column className={"col-sm-3"}>
                Benutzername:
              </Form.Label>
              <Col sm="9">
                <Form.Control id="Login" type="text" placeholder="Benutzername" value={this.state.login}
                              onChange={this.handleLoginChanged}
                              isValid={this.state.validated && this.state.validateErrors.login.length === 0}
                              isInvalid={this.state.validated && this.state.validateErrors.login.length > 0}/>
                <Form.Control.Feedback
                  type={this.state.validateErrors.login.length === 0 ? 'valid' : 'invalid'}>{this.state.validateErrors.login}</Form.Control.Feedback>
              </Col>
            </FormGroup>
            <FormGroup as={Row} controlId="FirstName">
              <Form.Label column className={"col-sm-3"}>
                Vorname:
              </Form.Label>
              <Col sm="9">
                <Form.Control id="FirstName" type="text" placeholder="Vorname" value={this.state.firstname}
                              onChange={this.handleFirstNameChanged}
                              isValid={this.state.validated && this.state.validateErrors.firstname.length === 0}
                              isInvalid={this.state.validated && this.state.validateErrors.firstname.length > 0}/>
                <Form.Control.Feedback
                  type={this.state.validateErrors.firstname.length === 0 ? 'valid' : 'invalid'}>{this.state.validateErrors.firstname}</Form.Control.Feedback>
              </Col>
            </FormGroup>
            <FormGroup as={Row} controlId="LastName">
              <Form.Label column className={"col-sm-3"}>
                Nachname:
              </Form.Label>
              <Col sm="9">
                <Form.Control id="LastName" type="text" placeholder="Nachname" value={this.state.lastname}
                              onChange={this.handleLastNameChanged}
                              isValid={this.state.validated && this.state.validateErrors.lastname.length === 0}
                              isInvalid={this.state.validated && this.state.validateErrors.lastname.length > 0}/>
                <Form.Control.Feedback
                  type={this.state.validateErrors.lastname.length === 0 ? 'valid' : 'invalid'}>{this.state.validateErrors.lastname}</Form.Control.Feedback>
              </Col>
            </FormGroup>
            <FormGroup as={Row} controlId="Password">
              <Form.Label column className={"col-sm-3"}>
                Passwort:
              </Form.Label>
              <Col sm="9">
                <Form.Control id="Password" type="password" placeholder="Passwort" value={this.state.password}
                              onChange={this.handlePasswordChanged}
                              isValid={this.state.validated && this.state.validateErrors.password.length === 0}
                              isInvalid={this.state.validated && this.state.validateErrors.password.length > 0}/>
                <Form.Control.Feedback
                  type={this.state.validateErrors.password.length === 0 ? 'valid' : 'invalid'}>{this.state.validateErrors.password}</Form.Control.Feedback>
              </Col>
            </FormGroup>
            <FormGroup as={Row}>
              <Col sm="7" className="align-self-center">
                <Link to="/login">Bereits einen Account?</Link>
              </Col>
              <Col sm="5" className="col-push-1">
                <Button type="submit" className="float-right" variant="primary" disabled={!this.isEverythingValid()}>Account
                  eröffnen</Button>
              </Col>
            </FormGroup>
          </Form>
        </TitledCard>
      </Container>
    );
  }
}

export default connect((state: any) => {
  return {Auth: state.Auth};
})(Signup);
