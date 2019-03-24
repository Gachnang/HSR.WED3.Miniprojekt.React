import React from "react";
import {Col, Form, FormControl, FormGroup, Row} from "react-bootstrap";

type Props = {
  onYearChange: (year: number) => void,
  onMonthChange: (month: number) => void
}

export function TransactionFilter<T>(props: Props) {
  const date = new Date();
  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth();
  const months = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];

  const onYearChange = (event: React.FormEvent<FormControl>) => {
    if (event.target instanceof HTMLSelectElement) {
      props.onYearChange(Number(event.target.value));
    }
  };

  const onMonthChange = (event: React.FormEvent<FormControl>) => {
    if (event.target instanceof HTMLSelectElement) {
      props.onMonthChange(Number(event.target.value));
    }
  };

  const yearFilter = (
    <FormGroup as={Col}>
      <Form.Label>Wähle Jahr aus</Form.Label>
      <Form.Control as="select" defaultValue={currentYear} onChange={onYearChange}>
        <option key={'year-2'} value={currentYear - 2}>{currentYear - 2}</option>
        <option key={'year-1'} value={currentYear - 1}>{currentYear - 1}</option>
        <option key={'year-0'} value={currentYear}>{currentYear}</option>
      </Form.Control>
    </FormGroup>
  );

  const monthFilter = (
    <FormGroup as={Col}>
      <Form.Label>Wähle Monat aus</Form.Label>
      <Form.Control as="select" defaultValue={currentMonth} onChange={onMonthChange}>
        {
          months.map((month: string, index: number) => (
            <option key={'month-' + index} value={index}>{month}</option>
          ))
        }
      </Form.Control>
    </FormGroup>
  );

  return (
    <Form as={Row}>
      {yearFilter}
      {monthFilter}
    </Form>
  );
}

export default TransactionFilter;