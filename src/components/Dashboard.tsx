import TransactionList from "./TransactionList";
import * as React from "react";

export const Dashboard = (props) =>  <TransactionList {...props} showFilter={true}/>;

export default Dashboard;