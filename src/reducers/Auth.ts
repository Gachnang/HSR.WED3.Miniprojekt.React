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

  LogOut = "AUTH_LogOut"
}

export type  Action = { /////////////////////////////////// Login
  type: ActionType.LoginRequest,
  user: string,
  password: string
} | {
  type: ActionType.LoginSuccess,
  token: string,
  account: Account
} | {
  type: ActionType.LoginFailed,
  fetchError: any
} | { ///////////////////////////////////////////////////// Register
  type: ActionType.RegisterRequest,
  firstname: string,
  lastname: string,
  password: string
} | {
  type: ActionType.RegisterSuccess,
  token: string,
  account: Account
} | {
  type: ActionType.RegisterFailed,
  fetchError: any
} | { ///////////////////////////////////////////////////// LogOut
  type: ActionType.LogOut
}

export const Auth = (
  state: State = {
    isAuthenticated: false,
    isLoading: false,
    fetchError: null
  },
  action: Action) => {

  switch (action.type) {
    /////////////////////////////////////////////////////// Login
    case ActionType.LoginRequest:
      return {
        ...state,
        isLoading: true
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
        isAuthenticated: action.token.length && action.token.length > 0,
        token: action.token,
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
    default: return state;
  }
};



export default Auth;