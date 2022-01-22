import React from 'react';
import { ActivityIndicator } from 'react-native';

interface Props {
  size?: 'small' | 'large';
}

const Loader = ({ size }: Props) => {
  return <ActivityIndicator size={size} />;
};
export default Loader;
