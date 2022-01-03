import { useField } from 'formik';
import React, { InputHTMLAttributes } from 'react';

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
    <div className="relative mb-4">
      <label htmlFor={field.name} className="leading-7 text-sm text-gray-600">
        {label}
      </label>
      <input
        {...field}
        {...props}
        id={field.name}
        className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
      />

      {error && <p className="text-xs text-red-500 mt-3">{error}</p>}
    </div>
  );
};
export default InputField;
