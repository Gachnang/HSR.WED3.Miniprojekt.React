import NewTransaction from "./newtransaction/NewTransaction";
import * as React from "react";

export const Transaction = (props) => (
  <>
      <div>
          <NewTransaction {...props}/>
      </div>
      <div>
          <p>BLUBB</p>
      </div>
  </>
);

export default Transaction;