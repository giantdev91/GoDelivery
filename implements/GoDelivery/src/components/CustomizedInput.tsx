import React, { useState } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';
import GoDeliveryColors from '../styles/colors';

interface CustomizedInputProps {
  icon: string;
  iconElement?: any;
  placeHolder: string;
  keyboardType?: string;
  handler: (val: string) => void;
  val?: string;
  error?: boolean;
  showCheck?: boolean;
  disabled?: boolean;
}

const CustomizedInput = (props: CustomizedInputProps): JSX.Element => {
  const [value, setValue] = useState('');
  const handleValue = (val: string) => {
    setValue(val);
    props.handler(val);
  };

  return (
    <View style={styles.background}>
      <View style={[styles.inputBack, props.error && styles.errorBack]}>
        {props.icon && (
          <Icons name={props.icon} size={25} color={GoDeliveryColors.place} />
        )}
        {!props.icon && props.iconElement}

        <TextInput
          style={styles.inputText}
          value={props.val ? props.val : ''}
          placeholder={props.placeHolder}
          keyboardType={props.keyboardType == 'number' ? 'numeric' : 'default'}
          onChangeText={value => handleValue(value)}
          secureTextEntry={false}
          editable={!props.disabled}
        />
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
  errorBack: {
    borderColor: GoDeliveryColors.primary,
  },
  inputBack: {
    backgroundColor: GoDeliveryColors.white,
    borderRadius: 5,
    borderColor: GoDeliveryColors.disabled,
    borderWidth: 1,
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
});

export default CustomizedInput;
