import {Account} from "../api";

export type State = {
  isAuthenticated: boolean,
  token?: string,
  account?: Account,
  isLoading: boolean,
  fetchError: any
}

export enum ActionType {
  LoginRequest = "AUTH_LogIn_Request",
  LoginSuccess = "AUTH_LogIn_Success",
  LoginFailed  = "AUTH_LogIn_Failed",

  RegisterRequest = "AUTH_Register_Request",
  RegisterSuccess = "AUTH_Register_Success",
  RegisterFailed  = "AUTH_Register_Failed",

  LogOut = "AUTH_LogOut",

  FetchAccountRequest = "AUTH_FetchAccount_Request",
  FetchAccountSuccess = "AUTH_FetchAccount_Success"
}

export type  Action = { /////////////////////////////////// Login
  type: ActionType.LoginRequest
} | {
  type: ActionType.LoginSuccess,
  token: string,
  account: Account
} | {
  type: ActionType.LoginFailed,
  fetchError: any
} | { ///////////////////////////////////////////////////// Register
  type: ActionType.RegisterRequest
} | {
  type: ActionType.RegisterSuccess,
  account: Account
} | {
  type: ActionType.RegisterFailed,
  fetchError: any
} | { ///////////////////////////////////////////////////// LogOut
  type: ActionType.LogOut
} | { ///////////////////////////////////////////////////// Account
  type: ActionType.FetchAccountRequest
} | {
  type: ActionType.FetchAccountSuccess,
  account: Account
}

export const Auth = (
  state: State = {
    isAuthenticated: false,
    isLoading: false,
    fetchError: undefined
  },
  action: Action) => {

  switch (action.type) {
    /////////////////////////////////////////////////////// Login
    case ActionType.LoginRequest:
      return {
        ...state,
        isLoading: true,
        fetchError: undefined
      };
    case ActionType.LoginSuccess:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: action.token.length && action.token.length > 0,
        token: action.token,
        account: action.account,
        fetchError: undefined
      };
    case ActionType.LoginFailed:
      return {
        ...state,
        isLoading: false,
        fetchError: action.fetchError
      };
    /////////////////////////////////////////////////////// Register
    case ActionType.RegisterRequest:
      return {
        ...state,
        isLoading: true
      };
    case ActionType.RegisterSuccess:
      return {
        ...state,
        isLoading: false,
        account: action.account,
        fetchError: undefined
      };
    case ActionType.RegisterFailed:
      return {
        ...state,
        isLoading: false,
        fetchError: action.fetchError
      };
    /////////////////////////////////////////////////////// LogOut
    case ActionType.LogOut:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        token: undefined,
        account: undefined
      };
    /////////////////////////////////////////////////////// FetchAccount
    case ActionType.FetchAccountRequest:
      return state;
    case ActionType.FetchAccountSuccess:
      return {
        ...state,
        account: action.account
      };
    /////////////////////////////////////////////////////// default / sessionStore(init)
    default: {
      if (state.isAuthenticated) return state;

      const token = sessionStorage.getItem("token");
      const account = sessionStorage.getItem("account");

      return (token && account) ? {
          ...state,
          isAuthenticated: true,
          token,
          account: JSON.parse(account)
        } : state;
    }
  }
};

export default Auth;