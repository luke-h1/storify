import { useField } from 'formik';
import React, { InputHTMLAttributes } from 'react';

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
  textarea?: boolean;
};

const InputField: React.FC<InputFieldProps> = ({ label, ...props }) => {
  const [field, { error }] = useField(props);
  return (
    <>
      <label htmlFor={field.name}>{label}</label>
      <input {...field} {...props} id={field.name} />
      {error && <p>{error}</p>}
    </>
  );
};
export default InputField;
