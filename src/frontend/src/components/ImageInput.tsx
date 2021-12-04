/* eslint-disable no-console */
import { Input } from '@chakra-ui/react';
import React from 'react';

interface Props {
  name: string;
  label: string;

  setFieldValue: (
    field: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any,
    shouldValidate?: boolean | undefined,
  ) => void;
}

const ImageInput = ({ setFieldValue, ...props }: Props) => {
  return (
    <Input
      placeholder="Image"
      type="file"
      accept="image/*"
      onChange={({ target: { validity, files } }) => {
        if (validity.valid && files) {
          setFieldValue('image', files[0]);
          const file = files[0];
          const reader = new FileReader();
          reader.onloadend = () => {
            console.log(reader.result);
          };
          reader.readAsDataURL(file);
        }
      }}
      {...props}
    />
  );
};

export default ImageInput;
