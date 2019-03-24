import {AccountNr, getTransactions, Transaction, transfer, TransferResult} from "../api";
import {Dispatch} from "redux";
import {
  Action as TAction,
  ActionType,
  ActionType as TActionType,
  State as TransactionState
} from "../reducers/Transaction";
import {State as AuthState} from "../reducers/Auth";
import {FetchAccount} from "./Auth";

export const Transfer = (
  target: AccountNr,
  amount: number,
  props: {Auth: AuthState, dispatch: Dispatch}
) : Promise<TransferResult> => {
  props.dispatch({
    type: TActionType.NewTransactionRequest
  } as TAction);

  return transfer(target, amount, props.Auth.token)
    .then((value: TransferResult) => {
      props.dispatch({
        type: TActionType.NewTransactionSuccess,
        transaction: value
      } as TAction);

      FetchAccount(props);
      FetchTransactions(props);

      return value;
    })
    .catch(error => {
      props.dispatch({
        type: TActionType.NewTransactionFailed,
        fetchError: error
      } as TAction);
      return error;
    })
};

export const FetchTransactions = (
  props: {Auth: AuthState, dispatch: Dispatch},
  fromDate: string = "",
  toDate: string = "",
  count: number = Number.MAX_SAFE_INTEGER,
  skip: number = 0
) : Promise<{result: Transaction[], query: { resultcount: number }}> => {
  props.dispatch({
    type: TActionType.TransactionListRequest
  } as TAction);

  return privateFetchTransaction(props, ActionType.TransactionListSuccess, fromDate, toDate, count, skip);
};

export const FetchTimedTransactions = (props: {Auth: AuthState, Transaction: TransactionState, dispatch: Dispatch}) => {
  if (typeof props.Transaction.transactionTo !== 'undefined') {
    props.dispatch({
      type: TActionType.TransactionListTimedRequest
    } as TAction);

    const toDate = new Date(props.Transaction.transactionTo);
    toDate.setMilliseconds(toDate.getMilliseconds() + 1);

    return privateFetchTransaction(
      props,
      ActionType.TransactionListTimedSuccess,
      toDate.toISOString(),
      new Date().toISOString(),
      Number.MAX_SAFE_INTEGER,
      0)
      .then(value => {
        if (value.query.resultcount > 0) {
          FetchAccount(props);
        }
        return value;
      });
  }
  return null;
};

const privateFetchTransaction = (
  props: {Auth: AuthState, dispatch: Dispatch},
  type: ActionType,
  fromDate: string = "",
  toDate: string = "",
  count: number = Number.MAX_SAFE_INTEGER,
  skip: number = 0
) : Promise<{result: Transaction[], query: { resultcount: number }}> => {
  return getTransactions(props.Auth.token, fromDate, toDate, count, skip)
    .then((value: { result: Transaction[], query: { resultcount: number } }) => {
      props.dispatch({
        type: type,
        transactions: value.result
      } as TAction);
      return value;
    })
    .catch(error => {
      props.dispatch({
        type: TActionType.TransactionListFailed,
        fetchError: error
      } as TAction);
      return error;
    });
};