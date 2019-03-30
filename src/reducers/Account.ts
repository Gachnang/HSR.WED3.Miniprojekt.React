import {Account as AccountType, AccountNr} from "../api";

export type State = {
  isLoading: boolean,
  isLoadingMap: Map<AccountNr, null>,
  fetchError?: any,
  accounts: Map<AccountNr, AccountType | null>,
  lastAccount?: AccountType
}

export enum ActionType {
  AccountRequest = "ACC_Request",
  AccountSuccess = "ACC_Success",
  AccountFailed = "ACC_Failed",
  AccountClear = "ACC_Clear",
}

export type  Action = {
  type: ActionType.AccountRequest,
  accountNr: AccountNr
} | {
  type: ActionType.AccountSuccess,
  account: AccountType
} | {
  type: ActionType.AccountFailed,
  accountNr: AccountNr,
  fetchError: any
} | {
  type: ActionType.AccountClear
}

export const Account = (
  state: State = {
    isLoading: false,
    isLoadingMap: new Map(),
    accounts: new Map()
  },
  action: Action): State => {
  const loadingMap = state.isLoadingMap;
  switch (action.type) {
    case ActionType.AccountRequest:
      loadingMap.set(action.accountNr, null);
      return {
        ...state,
        isLoadingMap: loadingMap,
        isLoading: loadingMap.size > 0,
        accounts: state.accounts.set(action.accountNr, null)
      };
    case ActionType.AccountSuccess:
      loadingMap.delete(action.account.accountNr);
      return {
        ...state,
        isLoadingMap: loadingMap,
        isLoading: loadingMap.size > 0,
        accounts: state.accounts.set(action.account.accountNr, action.account),
        lastAccount: action.account
      };
    case ActionType.AccountFailed:
      loadingMap.delete(action.accountNr);
      return {
        ...state,
        isLoading: loadingMap.size > 0,
        accounts: state.accounts.set(action.accountNr, null),
        fetchError: action.fetchError
      };
    case ActionType.AccountClear:
      return {
        ...state,
        accounts: new Map()
      };
    default:
      return state;
  }
};

export default Account;
