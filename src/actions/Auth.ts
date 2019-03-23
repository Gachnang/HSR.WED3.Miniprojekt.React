import {Action, ActionType} from "../reducers/Auth";
import * as api from "../api";
import {User} from "../api";
import {AnyAction, Dispatch} from "redux";

export const Register = (login: string, firstname: string, lastname: string, password: string) => (dispatch: Dispatch) => {
  dispatch({
    type: ActionType.RegisterRequest
  });

  api
    .signup(login, firstname, lastname, password)
    .then((value: User) => {
      dispatch({
        type: ActionType.RegisterSuccess,
        account: api.userToAccount(value)
      });

      // @ts-ignore
      dispatch(LogIn(login, password));
    })
    .catch(error => {
      dispatch({
        type: ActionType.RegisterFailed,
        fetchError: error
      });
    })
};

export const FetchAccount = (token: string) => (dispatch: Dispatch) => {
  dispatch({
    type: ActionType.FetchAccountRequest
  });

  api.getAccountDetails(token).then((account: api.Account) => {
    sessionStorage.setItem("account", JSON.stringify(account));

    dispatch({
      type: ActionType.FetchAccountSuccess,
      account: account
    });
  }).catch(error => {
    console.log(`actions\\Auth.FetchAccount failed`, error);
  });
};

export const LogIn = (login: string, password: string) => (dispatch: Dispatch) => {
  dispatch({
    type: ActionType.LoginRequest
  });

  api
    .login(login, password)
    .then((value: {token: string, owner: api.User}) => {
      const account = api.userToAccount(value.owner);
      sessionStorage.setItem("token", value.token);
      sessionStorage.setItem("account", JSON.stringify(account));

      dispatch({
        type: ActionType.LoginSuccess,
        token: value.token,
        account: account
      });

      //@ts-ignore
      dispatch(FetchAccount(value.token));
    })
    .catch(error => {
      dispatch({
        type: ActionType.LoginFailed,
        fetchError: error
      });
    });
};

export const LogOut = () => (dispatch: Dispatch) => {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("account");

  dispatch({
    type: ActionType.LogOut
  });
};

