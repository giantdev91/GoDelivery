import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Image,
  ScrollView,
} from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';

import { RadioButton } from 'react-native-paper';
import GlobalStyles from '../../styles/style';
import HeaderBar from '../../components/HeaderBar';
import CustomizedInput from '../../components/CustomizedInput';
import PrimaryButton from '../../components/PrimaryButton';
import GoDeliveryColors from '../../styles/colors';

interface ScreenProps {
  navigation: any;
}

const NewOrderComplete = ({ navigation }: ScreenProps): JSX.Element => {
  const handleToHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'InProgress' }],
    });
  };

  return (
    <View
      style={[
        GlobalStyles.container,
        { backgroundColor: GoDeliveryColors.white },
      ]}>
      {/* <HeaderBar navigation={navigation} title={'New Order'} /> */}
      <View style={{ justifyContent: 'flex-start', alignItems: 'flex-start' }}>
        <Image
          source={require('../../../assets/images/goods.jpg')}
          style={[{ width: '100%', height: 300, resizeMode: 'cover' }]}
        />
        <Image
          source={require('../../../assets/images/company_logo.png')}
          style={{ position: 'absolute', top: 200 }}
        />
      </View>
      <View style={{ marginTop: 80, marginHorizontal: 40 }}>
        <Text style={styles.markLabel}>
          Great! Your order will be delivered soon.
        </Text>
      </View>
      <View style={{ marginTop: 50, padding: 20 }}>
        <PrimaryButton buttonText="Home" handler={handleToHome} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  labelText: {
    fontSize: 17,
    fontWeight: '600',
    color: GoDeliveryColors.secondary,
  },
  formArea: {
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  markLabel: {
    fontSize: 32,
    fontWeight: '800',
    color: GoDeliveryColors.primary,
    textAlign: 'center',
  },
});

export default NewOrderComplete;
