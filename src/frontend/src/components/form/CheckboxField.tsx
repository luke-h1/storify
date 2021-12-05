import {
  FormControl,
  FormLabel,
  Checkbox,
  FormErrorMessage,
} from '@chakra-ui/react';
import { useField } from 'formik';
import React from 'react';

type CheckboxFieldProps = {
  label: string;
  children: React.ReactNode;
  name: string;
  textarea?: boolean;
};

const CheckboxField: React.FC<CheckboxFieldProps> = ({
  label,
  children,
  ...props
}) => {
  const [field, { error }] = useField(props);
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      <Checkbox {...field} {...props} id={field.name}>
        {children}
      </Checkbox>
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};
export default CheckboxField;
