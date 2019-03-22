import React from "react";
import AuthStore from "../store/AuthStore";

export type Props = {
  authStore: AuthStore
}

export type State = {}

export class TransactionList  extends React.Component<Props, State> {
  render(): React.ReactNode {
    return (
      <div>
        Blubb
      </div>
    );
  }
}

export default TransactionList;