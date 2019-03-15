import NewPayment from "./NewPayment";
import * as React from "react";

export const Transaction = (props) => (
  <>
      <div>
          <NewPayment {...props}/>
      </div>
      <div>
          <p>BLUBB</p>
      </div>
  </>
);

export default Transaction;