import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
} from 'react-native';
import { useDispatch } from 'react-redux';
import GlobalStyles from '../../../styles/style';
import PrimaryButton from '../../../components/PrimaryButton';
import GoDeliveryColors from '../../../styles/colors';
import allActions from '../../../redux/actions';

interface ScreenProps {
  navigation: any;
}

const NewOrderComplete = ({ navigation }: ScreenProps): JSX.Element => {
  const dispatch = useDispatch();

  const handleToHome = () => {
    dispatch(allActions.OrderAction.setNewOrder({}));

    // navigation.getParent().reset({
    //   index: 0,
    //   routes: [{ name: 'InProgress' }],
    // });
    navigation.navigate("InProgress");

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
          source={require('../../../../assets/images/goods.jpg')}
          style={[{ width: '100%', height: 300, resizeMode: 'cover' }]}
        />
        <Image
          source={require('../../../../assets/images/company-logo.png')}
          style={{ position: 'absolute', top: 200, height: 150, width: 240, resizeMode: 'contain', alignSelf: 'center' }}
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
    fontSize: 15,
    fontWeight: '600',
    color: GoDeliveryColors.secondary,
  },
  formArea: {
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  markLabel: {
    fontSize: 30,
    fontWeight: '800',
    color: GoDeliveryColors.primary,
    textAlign: 'center',
  },
});

export default NewOrderComplete;
