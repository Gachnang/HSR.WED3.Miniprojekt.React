import React from "react";
import {Button, Form, FormControl, FormGroup, Jumbotron} from "react-bootstrap";
import {AccountNr, getAccount, transfer} from "../api";

type State =  {
    from: string,
    to: {
        value: AccountNr,
        valid: boolean,
        feedback: string
    },
    amount: {
        value: number,
        valid: boolean,
        feedback: string
    },
    validated: boolean
}

export class NewTransaction extends React.Component<any, State> {
    state = {
        from: "",
        to: {
            value: "",
            valid: false,
            feedback: "Bitte Zielaccount eingeben."
        },
        amount: {
            value: 0.0,
            valid: false,
            feedback: "Bitte Betrag eingeben."
        },
        validated: false
    };

    handleToChanged = (event: React.FormEvent<FormControl>) => {
        if (event.target instanceof HTMLInputElement) {
            if (event.target.value.length === 0) {
                this.setState({
                    validated: true,
                    to: {
                        value: event.target.value,
                        valid: false,
                        feedback: "Bitte Zielaccount eingeben."
                    }
                });
            } else {
                getAccount(event.target.value, this.props.token)
                    .then(value => {
                        this.setState({
                            validated: true,
                            to: {
                                value: value.accountNr,
                                valid: true,
                                feedback: value.owner.firstname + " " + value.owner.lastname
                            }
                        });
                    })
                    .catch(e => {
                        this.setState({
                            validated: true,
                            to: {
                                value: "",
                                valid: false,
                                feedback: e.message.toString()
                            }
                        });
                    })
                ;
            }
        }
    };

    handleAmountChanged = (event: React.FormEvent<FormControl>) => {
        if (event.target instanceof HTMLInputElement) {
            if (event.target.value.length === 0) {
                this.setState({
                    validated: true,
                    amount: {
                        value: Number(0),
                        valid: false,
                        feedback: "Bitte Betrag eingeben."
                    }
                });
            } else if (Number(event.target.value) <= 0.05) {
                this.setState({
                    validated: true,
                    amount: {
                        value: Number(event.target.value),
                        valid: false,
                        feedback: "Bitte Betrag > 0.05 eingeben."
                    }
                });
            } else {
                this.setState({
                    validated: true,
                    amount: {
                        value: Number(event.target.value),
                        valid: true,
                        feedback: ""
                    }
                });
            }
        }
    };

    isEverythingValid = () => {
        return this.state.to.valid && this.state.amount.valid;
    };

    handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        transfer(this.state.to.value, this.state.amount.value, this.props.token)
        // TODO Not yet implemented
    };

    render() {
        return (
            <Jumbotron className={"container col-xs-6"}>
                <h2>Neue Zahlung</h2>
                <Form onSubmit={this.handleSubmit}>
                    <FormGroup>
                        <Form.Label>Von:</Form.Label>
                        <Form.Control type="text" readOnly={true}/>
                    </FormGroup>

                    <FormGroup>
                        <Form.Label>Zu:</Form.Label>
                        <Form.Control type="text"
                                      placeholder="Nummer des Zielaccounts"
                                      onChange={this.handleToChanged}
                                      isValid={this.state.validated && this.state.to.valid}
                                      isInvalid={this.state.validated && !this.state.to.valid}/>
                        <Form.Text className="text-muted">{this.state.to.feedback}</Form.Text>
                    </FormGroup>

                    <FormGroup>
                        <Form.Label>Betrag [CHF]:</Form.Label>
                        <Form.Control type="number"
                                      placeholder="Betrag in CHF"
                                      onChange={this.handleAmountChanged}
                                      isValid={this.state.validated && this.state.amount.valid}
                                      isInvalid={this.state.validated && !this.state.amount.valid}/>
                        <Form.Text className="text-muted">{this.state.amount.feedback}</Form.Text>
                    </FormGroup>

                    <FormGroup>
                        <Button type="submit" variant="primary" disabled={!this.isEverythingValid()}>Zahlen</Button>
                    </FormGroup>
                </Form>
            </Jumbotron>
        );
    }
}

export default NewTransaction;
