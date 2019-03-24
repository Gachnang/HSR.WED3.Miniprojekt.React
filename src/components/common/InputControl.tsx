import React, {useState} from "react";
import {Form, FormControl, FormGroup} from "react-bootstrap";

type Props = {
  label: string,
  type: string,
  step?: number,
  placeholder: string,
  onChange: (element: HTMLInputElement) => void,
  isValid: boolean,
  feedback: string
}

export function InputControl<T>(props: Props) {
  const [validated, setValidated] = useState(false);

  const onValueChange = (event: React.FormEvent<FormControl>) => {
    if (event.target instanceof HTMLInputElement) {
      props.onChange(event.target);
      setValidated(true);
    }
  };

  return (
    <FormGroup>
      <Form.Label>{props.label}</Form.Label>
      <Form.Control type={props.type}
                    step={props.step}
                    placeholder={props.placeholder}
                    onChange={onValueChange}
                    isValid={validated && props.isValid}
                    isInvalid={validated && !props.isValid}/>
      <Form.Text className="text-muted">{props.feedback}</Form.Text>
    </FormGroup>
  );
}

export default InputControl;
