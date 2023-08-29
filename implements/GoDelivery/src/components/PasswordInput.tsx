import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';
import GoDeliveryColors from '../styles/colors';

interface PasswordInputProps {
  placeholder?: string;
  handler: (val: string) => void;
  error?: boolean;
}

const PasswordInput = (props: PasswordInputProps): JSX.Element => {
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [value, setValue] = useState('');

  const handleValue = (val: string) => {
    setValue(val);
    props.handler(val);
  };

  return (
    <View style={styles.background}>
      <View style={[styles.inputBack, { borderColor: props.error ? GoDeliveryColors.primary : GoDeliveryColors.disabled }]}>
        <Icons
          name={'lock-closed-outline'}
          size={25}
          color={GoDeliveryColors.place}
        />
        <TextInput
          style={styles.inputText}
          placeholder={props.placeholder ?? 'Password'}
          onChangeText={val => handleValue(val)}
          secureTextEntry={secureTextEntry}
        />
        <TouchableOpacity
          onPress={() => {
            setSecureTextEntry(!secureTextEntry);
          }}>
          <Icons
            name={secureTextEntry ? 'eye-outline' : 'eye-off-outline'}
            size={25}
            color={GoDeliveryColors.place}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.checkIconArea}>
        {value && (
          <Icons
            name="checkmark-outline"
            size={25}
            color={GoDeliveryColors.green}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputBack: {
    backgroundColor: GoDeliveryColors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: GoDeliveryColors.disabled,
    paddingHorizontal: 20,
    paddingVertical: 0,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputText: {
    marginLeft: 10,
    flex: 1,
    paddingHorizontal: 10,
  },
  checkIconArea: {
    width: 35,
    alignItems: 'flex-end',
  },
});

export default PasswordInput;
