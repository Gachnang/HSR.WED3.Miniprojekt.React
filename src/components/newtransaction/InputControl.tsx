import React from "react";
import {Form, FormControl, FormGroup} from "react-bootstrap";

type Props = {
    label: string,
    type: string,
    step?: number,
    placeholder: string,
    onChange: (HTMLInputElement) => void,
    isValid: boolean,
    feedback: string
}

export type InputState = {
    validated: boolean
}

export class InputControl<T> extends React.Component<Props, InputState> {
    state = {
        validated: false
    };

    onValueChange = (event: React.FormEvent<FormControl>) => {
        if (event.target instanceof HTMLInputElement) {
            this.props.onChange(event.target);
            this.setState({validated: true});
        }
    };

    render() {
        return (
            <FormGroup>
                <Form.Label>{this.props.label}</Form.Label>
                <Form.Control type={this.props.type}
                              step={this.props.step}
                              placeholder={this.props.placeholder}
                              onChange={this.onValueChange}
                              isValid={this.state.validated && this.props.isValid}
                              isInvalid={this.state.validated && !this.props.isValid}/>
                <Form.Text className="text-muted">{this.props.feedback}</Form.Text>
            </FormGroup>
        );
    }
}

export default InputControl;
