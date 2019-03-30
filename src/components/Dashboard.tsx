import NewTransaction from "./newtransaction/NewTransaction";
import * as React from "react";
import TransactionList from "./transactionlist/TransactionList";
import {Col, Container, Row} from "react-bootstrap";

export const Dashboard = (props) => (
  <Container fluid={true}>
    <Row>
      <Col lg={4}>
        <NewTransaction {...props}/>
      </Col>
      <Col lg={8}>
        <TransactionList {...props} showFilter={false}/>
      </Col>
    </Row>
  </Container>
);

export default Dashboard;
