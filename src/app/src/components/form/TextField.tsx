import { Input, Text } from '@ui-kitten/components';
import { useField } from 'formik';
import { TextInputProps, View } from 'react-native';

interface TextFieldProps extends TextInputProps {
  name: string;
  label: string;
}

const TextField = ({ name, label, ...props }: TextFieldProps) => {
  const [field, meta, { setValue }] = useField({ name });
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 4,
      }}
    >
      <View style={{ marginBottom: 8, width: '100%' }}>
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
