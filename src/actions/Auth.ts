import {Action, ActionType, State as AuthState} from "../reducers/Auth";
import * as api from "../api";
import {User, Account} from "../api";
import {AnyAction, Dispatch} from "redux";

export const Register =
  (login: string, firstname: string, lastname: string, password: string, props: {Auth: AuthState, dispatch: Dispatch}):
    Promise<{ token: string, owner: User }> => {

  props.dispatch({
    type: ActionType.RegisterRequest
  });

  return api
    .signup(login, firstname, lastname, password)
    .then((value: User) => {
      props.dispatch({
        type: ActionType.RegisterSuccess,
        account: api.userToAccount(value)
      });

      return LogIn(login, password, props);
    })
    .catch(error => {
      props.dispatch({
        type: ActionType.RegisterFailed,
        fetchError: error
      });

      return error;
    })
};

export const FetchAccount =
  (props: {Auth: AuthState, dispatch: Dispatch}, token: string = null):
  Promise<Account> => {

  props.dispatch({
    type: ActionType.FetchAccountRequest
  });
  token = token !== null ? token : props.Auth.token;

  return api.getAccountDetails(token).then((account: api.Account) => {
    sessionStorage.setItem("account", JSON.stringify(account));

    props.dispatch({
      type: ActionType.FetchAccountSuccess,
      account: account
    });

    return account;
  }).catch(error => {
    console.log(`actions\\Auth.FetchAccount failed`, error);

    return error;
  });
};

export const LogIn =
  (login: string, password: string, props: {Auth: AuthState, dispatch: Dispatch}):
  Promise<{ token: string, owner: User }> => {

  props.dispatch({
    type: ActionType.LoginRequest
  });

  return api
    .login(login, password)
    .then((value: {token: string, owner: api.User}) => {
      const account = api.userToAccount(value.owner);
      sessionStorage.setItem("token", value.token);
      sessionStorage.setItem("account", JSON.stringify(account));

      props.dispatch({
        type: ActionType.LoginSuccess,
        token: value.token,
        account: account
      });

      FetchAccount(props, value.token);

      return value;
    })
    .catch(error => {
      props.dispatch({
        type: ActionType.LoginFailed,
        fetchError: error
      });

      return error;
    });
};

export const LogOut = (props: {dispatch: Dispatch}) => {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("account");

  props.dispatch({
    type: ActionType.LogOut
  });
};

