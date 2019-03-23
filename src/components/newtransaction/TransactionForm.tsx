import React from "react";
import {Button, Form, FormGroup} from "react-bootstrap";
import {AccountNr} from "../../api";
import InputControl from "./InputControl";
import {Dispatch} from "redux";
import {State as AccountState} from "../../reducers/Account";
import {State as AuthState} from "../../reducers/Auth";
import {GetAccount} from "../../actions/Account";
import {connect} from "react-redux";

export type Props = {
    Account: AccountState,
    Auth: AuthState,
    dispatch: Dispatch,
    pay: (AccountNr, number) => void
}

type State = {
    to: {
        value: AccountNr,
        valid: boolean,
        feedback: string
    },
    amount: {
        value: number,
        valid: boolean,
        feedback: string
    }
}

export class TransactionForm extends React.Component<Props, State> {
    state = {
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

    handleToChanged = (target: HTMLInputElement) => {
        if (target.value.length === 0) {
            this.setState({
                to: {
                    value: target.value,
                    valid: false,
                    feedback: "Bitte Zielaccount eingeben."
                }
            });
        } else if(target.value === this.props.Auth.account.accountNr) {
            this.setState({
                to: {
                    value: target.value,
                    valid: false,
                    feedback: "Eigener Account als Zielaccount nicht möglich."
                }
            });
        } else {
            GetAccount(target.value, this.props.Auth.token, this.props.dispatch, this.props.Account)
                .then(value => {
                    this.setState({
                        to: {
                            value: value.accountNr,
                            valid: true,
                            feedback: value.owner.firstname + " " + value.owner.lastname
                        }
                    });
                })
                .catch(e => {
                    this.setState({
                        to: {
                            value: "",
                            valid: false,
                            feedback: e.message.toString()
                        }
                    });
                })
            ;
        }
    };

    handleAmountChanged = (target: HTMLInputElement) => {
        if (target.value.length === 0) {
            this.setState({
                amount: {
                    value: Number(0),
                    valid: false,
                    feedback: "Bitte Betrag eingeben."
                }
            });
        } else if (Number(target.value) <= 0.05) {
            this.setState({
                amount: {
                    value: Number(target.value),
                    valid: false,
                    feedback: "Bitte Betrag > 0.05 eingeben."
                }
            });
        } else {
            this.setState({
                amount: {
                    value: Number(target.value),
                    valid: true,
                    feedback: ""
                }
            });
        }
    };

    isEverythingValid = () => {
        return this.state.to.valid && this.state.amount.valid;
    };

    handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        this.props.pay(this.state.to.value, this.state.amount.value);
    };

    render() {
        return (
            <Form onSubmit={this.handleSubmit}>
                <FormGroup>
                    <Form.Label>Von:</Form.Label>
                    <Form.Control type="text" readOnly={true} value={this.props.Auth.account.accountNr}/>
                </FormGroup>

                <InputControl label="Zu:"
                              type="text"
                              placeholder="Nummer des Zielaccounts"
                              onChange={this.handleToChanged}
                              isValid={this.state.to.valid}
                              feedback={this.state.to.feedback}/>

                <InputControl label="Betrag [CHF]"
                              type="number"
                              step={0.05}
                              placeholder="Betrag in CHF"
                              onChange={this.handleAmountChanged}
                              isValid={this.state.amount.valid}
                              feedback={this.state.amount.feedback}/>

                <FormGroup>
                    <Button type="submit" variant="primary" disabled={!this.isEverythingValid()}>Zahlen</Button>
                </FormGroup>
            </Form>
        );
    }
}

export default connect((state:any) => {
    return {
        Account: state.Account,
        Auth: state.Auth
    };
})(TransactionForm);
