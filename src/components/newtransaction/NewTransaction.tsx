import React from "react";
import {Jumbotron} from "react-bootstrap";
import {AccountNr, transfer, TransferResult} from "../../api";
import TransactionForm from "./TransactionForm";
import SuccessfulTransaction from "./SuccessfulTransaction";
import AuthStore from "../../store/AuthStore";

type State = {
    successful?: {
        to: AccountNr,
        balance: number
    }
}

type Props = {
    authStore: AuthStore
}

export class NewTransaction extends React.Component<Props, State> {
    state = {
        successful: undefined,
    };

    pay = (to: AccountNr, amount: number) => {
        transfer(to, amount, this.props.authStore.token)
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
                            {...this.props}
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
