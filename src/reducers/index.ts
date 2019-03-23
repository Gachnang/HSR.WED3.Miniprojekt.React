import {combineReducers} from "redux";
import Account from "./Account";
import Auth from "./Auth";
import Transaction from "./Transaction";

const Reducers = combineReducers({
  Account: Account,
  Auth: Auth,
  Transaction: Transaction
});

export default Reducers;