import React from "react";
import {Jumbotron} from "react-bootstrap";
import TransactionFilter from "./transactionlist/TransactionFilter";
import TransactionTable from "./transactionlist/TransactionTable";
import {Transaction} from "../api";
import {connect} from "react-redux";
import {State as AuthState} from "../reducers/Auth";
import {State as TransactionState} from "../reducers/Transaction";
import {Dispatch} from "redux";
import {FetchTransactions} from "../actions/Transaction";

export type Props = {
  showFilter: boolean,
  Auth: AuthState,
  Transaction: TransactionState,
  dispatch: Dispatch
}

export type State = {
  year: number,
  month: number
}

export class TransactionList extends React.Component<Props, State> {
  constructor(props: Props, ...args) {
    super(props, ...args);
    const date = new Date();

    this.state = {
      year: date.getFullYear(),
      month: date.getMonth()
    };

    this.loadTransactions();
  }

  loadFilteredTransactions = () => {
    let fromDate = new Date(this.state.year, this.state.month, 1).toISOString();
    // The month will wrap around (13 is January)
    let toDate = new Date(this.state.year, this.state.month + 1, 1).toISOString();

    return FetchTransactions(this.props, fromDate, toDate);
  };

  loadRecentTransactions = () => {
    return FetchTransactions(this.props, '', '', 3);
  };

  // TODO Reload transactions
  loadTransactions = () => {
    (this.props.showFilter ? this.loadFilteredTransactions() : this.loadRecentTransactions());
  };

  getTransactions: () => Transaction[] = () => {
    const
      fromDate = new Date(this.state.year, this.state.month),
      toDate = new Date(this.state.year, this.state.month + 1);

    return this.props.showFilter ?
      this.props.Transaction.transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate >= fromDate && transactionDate < toDate;
      }) :
      this.props.Transaction.transactions.slice(
        this.props.Transaction.transactions.length - 3,
        this.props.Transaction.transactions.length);
  };

  onYearChange = (y: number) => {
    this.setState({year: y});
  };

  onMonthChange = (m: number) => {
    this.setState({month: m});
  };

  render(): React.ReactNode {
    return (
      <Jumbotron className={"container col-xs-6"}>
        <h2>Transaktionen</h2>
        {this.props.showFilter && <TransactionFilter
            onYearChange={this.onYearChange}
            onMonthChange={this.onMonthChange}/>}
        <TransactionTable
          includeDate={this.props.showFilter}
          data={this.getTransactions()}/>
      </Jumbotron>
    );
  }
}

export default connect((state: any) => {
  return {
    Auth: state.Auth,
    Transaction: state.Transaction
  };
})(TransactionList);