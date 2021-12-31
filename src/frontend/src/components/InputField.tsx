import { useField } from 'formik';
import React, { InputHTMLAttributes } from 'react';
import styles from '../styles/forms.module.scss';

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
  textarea?: boolean;
};

const InputField: React.FC<InputFieldProps> = ({
  label,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  size: _,
  ...props
}) => {
  const [field, { error }] = useField(props);
  return (
    <div className={styles.formGroup}>
      <label htmlFor={field.name}>{label}</label>
      <input
        {...field}
        {...props}
        id={field.name}
        className={styles.formInput}
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};
export default InputField;
