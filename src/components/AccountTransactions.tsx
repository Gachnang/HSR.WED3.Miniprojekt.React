import * as React from "react";
import TransactionList from "./transactionlist/TransactionList";
import {Container} from "react-bootstrap";

export const AccountTransactions = (props) => (
  <Container fluid={true}>
    <TransactionList {...props} showFilter={true}/>
  </Container>
);

export default AccountTransactions;
