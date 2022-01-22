import { View } from 'react-native';

interface Props {
  children: React.ReactNode;
}

const Center = ({ children }: Props) => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
      }}
    >
      {children}
    </View>
  );
};
export default Center;
