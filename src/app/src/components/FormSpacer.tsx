import React from 'react';
import { View } from 'react-native';

interface Props {
  children: React.ReactNode;
}

const FormSpacer = ({ children }: Props) => {
  return <View style={{ marginBottom: 30 }}>{children}</View>;
};
export default FormSpacer;
