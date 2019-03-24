import NewTransaction from "./newtransaction/NewTransaction";
import * as React from "react";
import TransactionList from "./TransactionList";

export const Transaction = (props) => (
  <>
    <div>
      <NewTransaction {...props}/>
    </div>
    <div>
      <TransactionList {...props} showFilter={false}/>
    </div>
  </>
);

export default Transaction;