import {Account, AccountNr, getAccount} from "../api";
import {Dispatch} from "redux";
import {Action, ActionType, State} from "../reducers/Account";

export const GetAccount:
  ((accountNr: AccountNr, token: string, props: {dispatch: Dispatch, Account: State}) => Promise<Account>) =
  (accountNr, token, props) => {

  if (props.Account.accounts.has(accountNr)) {
    return new Promise<Account>((resolve, reject) => {
      const account = props.Account.accounts.get(accountNr);
      if (account === null) {
        reject(new Error("Not Found"));
      } else {
        resolve(account);
      }
    });
  } else {
    props.dispatch({
      type: ActionType.AccountRequest,
      accountNr: accountNr
    } as Action);

    return getAccount(accountNr, token)
      .then(value => {
        props.dispatch({
          type: ActionType.AccountSuccess,
          accountNr: accountNr,
          account: value
        } as Action);

        return value;
      })
      .catch(error => {
        props.dispatch({
          type: ActionType.AccountFailed,
          accountNr: accountNr,
          fetchError: error
        } as Action);

        return error;
      })
  }
};

export const ClearAccounts = (props: {dispatch: Dispatch<Action>}) => {
  props.dispatch({
    type: ActionType.AccountClear
  } as Action);
};