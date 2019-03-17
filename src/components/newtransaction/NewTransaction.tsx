import React from "react";
import {Jumbotron} from "react-bootstrap";
import {AccountNr, transfer, TransferResult} from "../../api";
import TransactionForm from "./TransactionForm";
import SuccessfulTransaction from "./SuccessfulTransaction";

type State = {
    successful?: {
        to: AccountNr,
        balance: number
    }
}

export class NewTransaction extends React.Component<any, State> {
    state = {
        successful: undefined,
    };

    pay = (to: AccountNr, amount: number) => {
        transfer(to, amount, this.props.token)
            .then((res: TransferResult) => {
                this.setState({successful: {to: res.target, balance: res.total}});
            })
            .catch(() => {
                console.error("Failed"); // TODO Show better message
            });
    };

    startOver = () => {
        this.setState({successful: undefined});
    };

    render() {
        return (
            <Jumbotron className={"container col-xs-6"}>
                <h2>Neue Zahlung</h2>
                {
                    !this.state.successful ? (
                        <TransactionForm
                            {...this.props as { token, user }}
                            pay={this.pay}/>
                    ) : (
                        <SuccessfulTransaction
                            to={this.state.successful.to}
                            balance={this.state.successful.balance}
                            startOver={this.startOver}/>
                    )
                }
            </Jumbotron>
        );
    }
}

export default NewTransaction;
