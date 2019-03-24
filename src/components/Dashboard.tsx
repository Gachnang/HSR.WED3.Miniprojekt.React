import * as React from "react";
import TransactionList from "./transactionlist/TransactionList";
import {Container} from "react-bootstrap";

export const Dashboard = (props) => (
  <Container fluid={true}>
        <TransactionList {...props} showFilter={true}/>
  </Container>
);

export default Dashboard;
