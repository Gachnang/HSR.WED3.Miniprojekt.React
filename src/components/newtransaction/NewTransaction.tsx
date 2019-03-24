import React from "react";
import {Jumbotron} from "react-bootstrap";
import {AccountNr, TransferResult} from "../../api";
import TransactionForm from "./TransactionForm";
import SuccessfulTransaction from "./SuccessfulTransaction";
import {connect} from "react-redux";
import {State as AuthState} from "../../reducers/Auth";
import {State as TransactionState} from "../../reducers/Transaction";
import {State as AccountState} from "../../reducers/Account";
import {Dispatch} from "redux";
import {Transfer} from "../../actions/Transaction";

type State = {
    successful?: {
        to: AccountNr,
        balance: number
    }
}

type Props = {
    Account: AccountState,
    Auth: AuthState,
    Transaction: TransactionState,
    dispatch: Dispatch
}

export class NewTransaction extends React.Component<Props, State> {
    state = {
        successful: undefined,
    };

    pay = (to: AccountNr, amount: number) => {

        Transfer(to, amount, this.props)
            .then((res: TransferResult) => {
                this.setState({successful: {to: res.target, balance: res.total}});
            })
            .catch(error => {
                console.error("Failed", error); // TODO Show better message
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

export default connect((state:any) => {
    return {
        Account: state.Account,
        Auth: state.Auth,
        Transaction: state.Transaction
    };
})(NewTransaction);
