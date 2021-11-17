import { Input } from '@chakra-ui/react';
import React from 'react';

interface Props {
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined,
  ) => void;
}

const ImageInput = ({ setFieldValue }: Props) => {
  return (
    <>
      <Input
        placeholder="Image"
        type="file"
        accept="image/*"
        onChange={({ target: { validity, files } }) => {
          if (validity.valid && files) {
            setFieldValue('image', files[0]);
          }
        }}
      />
    </>
  );
};

export default ImageInput;
