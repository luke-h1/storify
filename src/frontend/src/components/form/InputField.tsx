import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Textarea,
  ComponentWithAs,
  InputProps,
} from '@chakra-ui/react';
import { useField } from 'formik';
import React, { InputHTMLAttributes } from 'react';

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
  textarea?: boolean;
};

const InputField: React.FC<InputFieldProps> = ({
  label,
  textarea,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  size: _,
  ...props
}) => {
  let InputOrTextarea:
    | ComponentWithAs<'input', InputProps>
    | ComponentWithAs<'textarea', InputProps>;
  if (textarea) {
    InputOrTextarea = Textarea as ComponentWithAs<'textarea', InputProps>;
  }

  const [field, { error }] = useField(props);
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore */}
      <InputOrTextarea {...field} {...props} id={field.name} />
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};
export default InputField;
