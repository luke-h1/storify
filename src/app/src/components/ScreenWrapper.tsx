import React, { useContext } from 'react';
import { SafeAreaView, View } from 'react-native';

interface ScreenWrapperProps {
  padding?: boolean;
  children: React.ReactNode;
}

const ScreenWrapper = ({ children, padding }: ScreenWrapperProps) => {
  return (
    <SafeAreaView style={{ flex: 1, width: '100%' }}>
      <View style={{ padding: padding ? 16 : 0, flex: 1 }}>{children}</View>
    </SafeAreaView>
  );
};
export default ScreenWrapper;
