import {Account, Transaction as TransactionType, TransferResult} from "../api";

export type State = {
  isLoadingList: boolean,
  isLoadingNew: boolean,
  fetchError?: any,
  transactions: TransactionType[],
  transactionFrom?: Date,
  transactionTo?: Date,
  lastTransaction?: TransferResult
}

export enum ActionType {
  TransactionListRequest = "TRANS_List_Request",
  TransactionListSuccess = "TRANS_List_Success",
  TransactionListFailed  = "TRANS_List_Failed",
  TransactionListClear  = "TRANS_List_Clear",

  NewTransactionRequest = "TRANS_New_Request",
  NewTransactionSuccess = "TRANS_New_Success",
  NewTransactionFailed = "TRANS_New_Failed"
}

export type  Action = { /////////////////////////////////// List
  type: ActionType.TransactionListRequest
} | {
  type: ActionType.TransactionListSuccess,
  transactions: TransactionType[]
} | {
  type: ActionType.TransactionListFailed,
  fetchError: any
} | {
  type: ActionType.TransactionListClear
} | { ///////////////////////////////////////////////////// New
  type: ActionType.NewTransactionRequest
} | {
  type: ActionType.NewTransactionSuccess,
  transaction: TransferResult
} | {
  type: ActionType.NewTransactionFailed,
  fetchError: any
}

const ConcatList: (target: TransactionType[], source: TransactionType[]) => TransactionType[] = (target, source) => {
  return target
    .concat(source)
    .filter((value: TransactionType, index: number, self: TransactionType[]) => self.indexOf(value) === index)
};

const MaxList = function(target: TransactionType[]) {
  return Math.max.apply(null, target.map(v => new Date(v.date)));
};

const MinList = function(target: TransactionType[]) {
  return Math.min.apply(null, target.map(v => new Date(v.date)));
};

export const Transaction = (
  state: State = {
    isLoadingList: false,
    isLoadingNew: false,
    transactions: []
  },
  action: Action): State => {

  switch (action.type) { ////////////////////////////////// List
    case ActionType.TransactionListRequest:
      return {
        ...state,
        isLoadingList: true
      };
    case ActionType.TransactionListSuccess:
      const transactions = ConcatList(state.transactions, action.transactions);
      return {
        ...state,
        isLoadingList: false,
        transactions: transactions,
        transactionFrom: MinList(transactions),
        transactionTo: MaxList(transactions)
      };
    case ActionType.TransactionListFailed:
      return {
        ...state,
        isLoadingList: false,
        fetchError: action.fetchError
      };
    case ActionType.TransactionListClear:
      return {
        ...state,
        isLoadingList: false,
        transactions: []
      };
    /////////////////////////////////////////////////////// New
    case ActionType.NewTransactionRequest:
      return {
        ...state,
        isLoadingNew: true
      };
    case ActionType.NewTransactionSuccess:
      return {
        ...state,
        isLoadingNew: false,
        lastTransaction: action.transaction,
        transactions: ConcatList(state.transactions, [action.transaction])
      };
    case ActionType.NewTransactionFailed:
      return {
        ...state,
        isLoadingNew: false,
        fetchError: action.fetchError
      };
    default:
      return state;
  }
};


export default Transaction;