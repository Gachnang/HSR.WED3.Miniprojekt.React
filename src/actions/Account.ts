import {Account, AccountNr, getAccount} from "../api";
import {Dispatch} from "redux";
import {Action, ActionType, State} from "../reducers/Account";

export const GetAccount:
  ((accountNr: AccountNr, token: string, dispatch: Dispatch, state: State) => Promise<Account>) =
  (accountNr, token, dispatch, state) => {

  if (state.accounts.has(accountNr)) {
    return new Promise<Account>((resolve, reject) => {
      const account = state.accounts.get(accountNr);
      if (account === null) {
        reject(new Error("Not Found"));
      } else {
        resolve(account);
      }
    });
  } else {
    dispatch({
      type: ActionType.AccountRequest,
      accountNr: accountNr
    } as Action);

    return getAccount(accountNr, token)
      .then(value => {
        dispatch({
          type: ActionType.AccountSuccess,
          accountNr: accountNr,
          account: value
        } as Action);

        return value;
      })
      .catch(error => {
        dispatch({
          type: ActionType.AccountFailed,
          accountNr: accountNr,
          fetchError: error
        } as Action);

        return error;
      })
  }
};

export const ClearAccounts = () => (dispatch: Dispatch<Action>) => {
  dispatch({
    type: ActionType.AccountClear
  } as Action);
};