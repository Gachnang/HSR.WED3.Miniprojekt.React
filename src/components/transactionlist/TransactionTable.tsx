import React from "react";
import {Table} from "react-bootstrap";
import {Transaction} from "../../api";

type Props = {
  includeDate: boolean,
  data: Transaction[]
}

export function TransactionTable<T>(props: Props) {
  const mapRow = (t: Transaction, index: number) => {
    return (
      <tr key={'transaction-' + index}>
        {props.includeDate && <td>{new Date(t.date).toLocaleDateString()}</td>}
        <td>{t.from}</td>
        <td>{t.target}</td>
        <td>{t.amount.toFixed(2)}</td>
        <td>{t.total.toFixed(2)}</td>
      </tr>
    );
  };

  return (
    <Table hover>
      <thead>
      <tr>
        {props.includeDate && <th>Date</th>}
        <th>Source</th>
        <th>Target</th>
        <th>Amount [CHF]</th>
        <th>Balance [CHF]</th>
      </tr>
      </thead>
      <tbody>
      {props.data.map(mapRow)}
      </tbody>
    </Table>
  );
}

export default TransactionTable;