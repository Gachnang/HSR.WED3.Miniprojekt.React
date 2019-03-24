import React, {ReactNode} from "react";
import {Card} from "react-bootstrap";

type Props = {
  title: string,
  children: ReactNode
}

export function TitledCard(props: Props) {
  return (
    <Card>
      <Card.Header>
        <h2>{props.title}</h2>
      </Card.Header>
      <Card.Body>
        {props.children}
      </Card.Body>
    </Card>
  );
}

export default TitledCard;
