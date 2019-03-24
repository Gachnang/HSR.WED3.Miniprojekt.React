import NewTransaction from "./newtransaction/NewTransaction";
import * as React from "react";
import TransactionList from "./TransactionList";

export const Transaction = (props) => (
  <div className="row">
    <div className="col-md-4">
      <NewTransaction {...props}/>
    </div>
    <div className="col-md-8">
      <TransactionList {...props} showFilter={false}/>
    </div>
  </div>
);

export default Transaction;