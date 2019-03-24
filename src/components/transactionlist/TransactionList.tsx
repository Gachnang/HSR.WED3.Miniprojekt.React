import React from "react";
import TransactionFilter from "./TransactionFilter";
import TransactionTable from "./TransactionTable";
import {Transaction} from "../../api";
import {connect} from "react-redux";
import {State as AuthState} from "../../reducers/Auth";
import {Dispatch} from "redux";
import {FetchTransactions} from "../../actions/Transaction";
import TitledCard from "../common/TitledCard";

export type Props = {
  showFilter: boolean,
  Auth: AuthState,
  dispatch: Dispatch
}

export type State = {
  allTransactions: Transaction[]
  year: number,
  month: number
}

export class TransactionList extends React.Component<Props, State> {
  constructor(props: Props, ...args) {
    super(props, ...args);
    const date = new Date();

    this.state = {
      allTransactions: [],
      year: date.getFullYear(),
      month: date.getMonth()
    };

    this.loadTransactions();
  }

  loadFilteredTransactions = () => {
    let fromDate = new Date(this.state.year, this.state.month, 1).toISOString();
    // The month will wrap around (13 is January)
    let toDate = new Date(this.state.year, this.state.month + 1, 1).toISOString();

    return FetchTransactions(this.props.Auth.token, this.props.dispatch, null, fromDate, toDate, null, null);
  };

  loadRecentTransactions = () => {
    return FetchTransactions(this.props.Auth.token, this.props.dispatch, null, '', '', 3, null);
  };

  // TODO Reload transactions
  loadTransactions = () => {
    (this.props.showFilter ? this.loadFilteredTransactions() : this.loadRecentTransactions())
      .then((res) => {
        this.setState({allTransactions: res.result});
      })
      .catch((err) => console.error(err.toString()));
  };

  onYearChange = (y: number) => {
    this.setState({year: y}, this.loadTransactions);
  };

  onMonthChange = (m: number) => {
    this.setState({month: m}, this.loadTransactions);
  };

  // TODO Button "All transactions"
  render(): React.ReactNode {
    return (
      <TitledCard title="Transaktionen">
        {this.props.showFilter && <TransactionFilter
            onYearChange={this.onYearChange}
            onMonthChange={this.onMonthChange}/>}
        <TransactionTable
          includeDate={this.props.showFilter}
          data={this.state.allTransactions}/>
      </TitledCard>
    );
  }
}

export default connect((state: any) => {
  return {
    Auth: state.Auth
  };
})(TransactionList);