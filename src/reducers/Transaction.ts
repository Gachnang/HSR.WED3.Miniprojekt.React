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
  TransactionListTimedRequest = "TRANS_List_TimedRequest",
  TransactionListSuccess = "TRANS_List_Success",
  TransactionListTimedSuccess = "TRANS_List_TimedSuccess",
  TransactionListFailed = "TRANS_List_Failed",
  TransactionListClear = "TRANS_List_Clear",

  NewTransactionRequest = "TRANS_New_Request",
  NewTransactionSuccess = "TRANS_New_Success",
  NewTransactionFailed = "TRANS_New_Failed"
}

export type  Action = { /////////////////////////////////// List
  type: ActionType.TransactionListRequest,
  from: string
  to: string,
} | {
  type: ActionType.TransactionListTimedRequest
} | {
  type: ActionType.TransactionListSuccess,
  from: string,
  to: string,
  resultcount: number,
  transactions: TransactionType[]
} | {
  type: ActionType.TransactionListTimedSuccess,
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

const ConcatList: (target: TransactionType[], sources: TransactionType[]) => TransactionType[] = (target, sources) => {
  while (sources.length > 0) {
    const source = sources.shift();
    if (target.filter(t =>
      t.date === source.date &&
      t.amount === source.amount &&
      t.from === source.from &&
      t.target === source.target &&
      t.total === source.total
    ).length === 0) {
      target.push(source);
    }
  }
  return target;
};

const SortList = (target: TransactionType[]) => {
  return target.sort((a, b) => {
    const
      dateA = new Date(a.date),
      dateB = new Date(b.date);
    return dateA.valueOf() - dateB.valueOf();
  })
};

const MaxList = function (target: TransactionType[]) {
  return Math.max.apply(null, target.map(v => new Date(v.date)));
};

const MinList = function (target: TransactionType[]) {
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
    case ActionType.TransactionListTimedSuccess:
      const
        transactions = SortList(ConcatList(state.transactions, action.transactions)),
        min = MinList(transactions),
        max = MaxList(transactions);

      return {
        ...state,
        isLoadingList: false,
        transactions: transactions,
        transactionFrom: Number.isFinite(min) ? min : undefined,
        transactionTo: Number.isFinite(max) ? max : undefined,
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
        transactions: SortList(ConcatList(state.transactions, [action.transaction]))
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
