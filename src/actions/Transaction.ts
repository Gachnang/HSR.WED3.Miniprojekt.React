import {AccountNr, getTransactions, Transaction, transfer, TransferResult} from "../api";
import {Dispatch} from "redux";
import {Action as TAction, ActionType as TActionType} from "../reducers/Transaction";
import {Action as AAction, ActionType as AActionType} from "../reducers/Auth";
import {State} from "../components/TransactionList";
import {FetchAccount} from "./Auth";

export const Transfer = (
  target: AccountNr,
  amount: number,
  token: string,
  dispatch: Dispatch
) : Promise<TransferResult> => {
  dispatch({
    type: TActionType.NewTransactionRequest
  } as TAction);

  return transfer(target, amount, token)
    .then((value: TransferResult) => {
      dispatch({
        type: TActionType.NewTransactionSuccess,
        transaction: value
      } as TAction);

      // @ts-ignore
      dispatch(FetchAccount(token));

      return value;
    })
    .catch(error => {
      dispatch({
        type: TActionType.NewTransactionFailed,
        fetchError: error
      } as TAction);
      return error;
    })
};

export const FetchTransactions = (
  token: string,
  dispatch: Dispatch,
  state: State,
  fromDate: string,
  toDate: string,
  count: number,
  skip: number
) : Promise<{result: Transaction[], query: { resultcount: number }}> => {
  dispatch({
    type: TActionType.TransactionListRequest
  } as TAction);

  return getTransactions(token, fromDate, toDate, count, skip)
    .then((value: { result: Transaction[], query: { resultcount: number } }) => {
      dispatch({
        type: TActionType.TransactionListSuccess,
        transactions: value.result
      } as TAction);
      return value;
    })
    .catch(error => {
      dispatch({
        type: TActionType.TransactionListFailed,
        fetchError: error
      } as TAction);
      return error;
    })
};