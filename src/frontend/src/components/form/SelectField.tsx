import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Select,
} from '@chakra-ui/react';
import { useField } from 'formik';
import React from 'react';

type SelectFieldProps = {
  label: string;
  name: string;
  textarea?: boolean;
  children: React.ReactNode;
};

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  children,
  ...props
}) => {
  const [field, { error }] = useField(props);
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      <Select placeholder="Select option" {...field} {...props} id={field.name}>
        {children}
      </Select>
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};
export default SelectField;
