import React, {ChangeEvent} from "react";
import {Link, Redirect} from "react-router-dom";

import { signup, login as doLogin } from "../api";
import Form from "react-bootstrap/Form";
import {Button, Col, FormControl, FormGroup, Jumbotron} from "react-bootstrap";
import Row from "react-bootstrap/Row";

type Props = {
  /* Callback to submit an authentication request to the server */
  authenticate: (
    login: string,
    password: string,
    callback: (error?: Error) => void
  ) => void,};

type State = {
  login: string,
  firstname: string,
  lastname: string,
  password: string,
  validateErrors: {login: string, firstname: string, lastname: string, password: string},
  error?: Error,
  redirectToReferrer: boolean,
  validated: boolean
};

class Signup extends React.Component<Props, State> {
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
      this.handleValidation({ login: event.target.value});
    }
  };

  handleFirstNameChanged = (event: React.FormEvent<FormControl>) => {
    if (event.target instanceof HTMLInputElement) {
      this.handleValidation({ firstname: event.target.value});
    }
  };

  handleLastNameChanged = (event: React.FormEvent<FormControl>) => {
    if (event.target instanceof HTMLInputElement) {
      this.handleValidation({ lastname: event.target.value});
    }
  };

  handlePasswordChanged = (event: React.FormEvent<FormControl>) => {
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

    // validate firstname
    if (this.state.firstname.length === 0) {
      newState.validateErrors.firstname = "Vorname wird benötigt.";
      valid = false;
    } else if (this.state.firstname.length < 3) {
      newState.validateErrors.firstname = "Vorname muss mindestens 3 Zeichen lang sein.";
      valid = false;
    } else {
      newState.validateErrors.firstname = "";
    }

    // validate lastname
    if (this.state.lastname.length === 0) {
      newState.validateErrors.lastname = "Nachname wird benötigt.";
      valid = false;
    } else if (this.state.lastname.length < 3) {
      newState.validateErrors.lastname = "Nachname muss mindestens 3 Zeichen lang sein.";
      valid = false;
    } else {
      newState.validateErrors.lastname = "";
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
      const self = this;
      signup(self.state.login, self.state.firstname, self.state.lastname, self.state.password)
        .then(result => {
          console.log("Signup result ", result);
          self.props.authenticate(self.state.login, self.state.password, error => {
            if (error) {
              self.setState({
                error: error,
                validateErrors: Object.assign(self.state.validateErrors, {password: "Logindaten waren nicht korrekt. (whaaat?!?)"})
              });
            } else {
              self.setState({redirectToReferrer: true, error: null});
            }
          });
        })
        .catch(error => {
          let validateErrors = this.state.validateErrors;
          validateErrors.login = "Registrierung fehlgeschlagen. Username bereits vergeben?";
          this.setState({error})
        });
    }
  };

  render() {
    const { redirectToReferrer, error } = this.state;

    if (redirectToReferrer) {
      return <Redirect to="/login" />;
    }

    return (
      <Jumbotron className={"container col-xs-6"}>
        <h2>Registrieren</h2>
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
          <FormGroup as={Row} controlId="FirstName">
            <Form.Label column className={"col-sm-3"}>
              Vorname:
            </Form.Label>
            <Col sm="9">
              <Form.Control id="FirstName" type="text" placeholder="FirstName" value={this.state.firstname} onChange={this.handleFirstNameChanged}
                            isValid={this.state.validated && this.state.validateErrors.firstname.length === 0}
                            isInvalid={this.state.validated && this.state.validateErrors.firstname.length > 0} />
              <Form.Control.Feedback type={this.state.validateErrors.firstname.length === 0 ? 'valid' : 'invalid'}>{this.state.validateErrors.firstname}</Form.Control.Feedback>
            </Col>
          </FormGroup>
          <FormGroup as={Row} controlId="LastName">
            <Form.Label column className={"col-sm-3"}>
              Nachname:
            </Form.Label>
            <Col sm="9">
              <Form.Control id="LastName" type="text" placeholder="Nachname" value={this.state.lastname} onChange={this.handleLastNameChanged}
                            isValid={this.state.validated && this.state.validateErrors.lastname.length === 0}
                            isInvalid={this.state.validated && this.state.validateErrors.lastname.length > 0} />
              <Form.Control.Feedback type={this.state.validateErrors.lastname.length === 0 ? 'valid' : 'invalid'}>{this.state.validateErrors.lastname}</Form.Control.Feedback>
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
              <Link to="/login">Bereits einen Account?</Link>
            </Col>
            <Col sm ="5" className="col-push-1">
              <Button type="submit" className="float-right" variant="primary">Account eröffnen</Button>
            </Col>
          </FormGroup>
        </Form>
    {/*
      <div>
        <h1>Bank of Rapperswil</h1>
        <form>
          <h2>Registrieren</h2>
          <input
            onChange={this.handleLoginChanged}
            placeholder="Login"
            value={this.state.login}
          />
          <input
            onChange={this.handleFirstNameChanged}
            placeholder="Vorname"
            value={this.state.firstname}
          />
          <input
            onChange={this.handleLastNameChanged}
            placeholder="Nachname"
            value={this.state.lastname}
          />
          <input
            onChange={this.handlePasswordChanged}
            placeholder="Passwort"
            type="password"
            value={this.state.password}
          />
          <button onClick={this.handleSubmit}>Account eröffnen</button>
        </form>
        {error && <p>Es ist ein Fehler aufgetreten!</p>}
      </div>*/}
      </Jumbotron>
    );
  }
}

export default Signup;
