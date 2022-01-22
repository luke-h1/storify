import { Input, Text } from '@ui-kitten/components';
import { useField } from 'formik';
import { TextInputProps, View } from 'react-native';

interface TextFieldProps extends TextInputProps {
  name: string;
  label: string;
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const styles = StyleSheet.create({
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  title: {
    marginHorizontal: 8,
  },
  installButton: {
    marginVertical: 4,
  },
});

const TextField = ({ name, label, ...props }: TextFieldProps) => {
  const [field, meta, { setValue }] = useField({ name });
  return (
    <View style={styles.details}>
      <View style={{ marginBottom: 8 }}>
        <Input
          label={label}
          {...props}
          value={field.value}
          onChangeText={t => setValue(t)}
        />
      </View>
      {meta.error && (
        <Text status="danger" style={{ marginTop: 4 }}>
          {meta.error}
        </Text>
      )}
    </View>
  );
};
export default TextField;
