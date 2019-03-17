import React from "react";
import {Button} from "react-bootstrap";
import {AccountNr} from "../../api";

type Props = {
    to: AccountNr,
    balance: number
    startOver: () => void
}

export function SuccessfulTransaction(props: Props) {
    let handleStartOver = (event: React.MouseEvent) => {
        event.preventDefault();
        props.startOver();
    };

    return (
        <div>
            <p>Transaktion für {props.to} erfolgreich!</p>
            <p>Neuer Kontostand: {props.balance} CHF</p>
            <Button variant="primary" onClick={handleStartOver}>Gehe zurück</Button>
        </div>
    );
}

export default SuccessfulTransaction;
