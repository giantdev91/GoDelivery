import {StyleSheet, Dimensions, Platform} from 'react-native';
import GoDeliveryColors from './colors';

const GlobalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GoDeliveryColors.background,
  },
  contentAreaPadding: {
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  authenticationScreenLogoBack: {
    backgroundColor: GoDeliveryColors.primary,
    alignItems: 'center',
    height: 200,
    justifyContent: 'center',
  },
  authenticationScreenLogo: {
    width: 250,
    resizeMode: 'contain',
  },
  shadowProp: {
    ...Platform.select({
      ios: {
        shadowColor: GoDeliveryColors.secondary,
        shadowOffset: {
          width: 0,
          height: 8,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 8,
        shadowColor: GoDeliveryColors.secondary,
      },
    }),
  },
  primaryButton: {
    alignSelf: 'center',
    width: '100%',
    height: 50,
    backgroundColor: GoDeliveryColors.primary,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryLabel: {
    color: GoDeliveryColors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  primaryEmphasizeLabel: {
    color: GoDeliveryColors.primary,
    fontSize: 14,
    fontWeight: '400',
  },
  primaryEmphasizeLabelHigher: {
    color: GoDeliveryColors.primary,
    fontSize: 15,
    fontWeight: '700',
  },
  indicator: {
    borderWidth: 1,
    borderColor: 'red',
  },
  textSmall: {
    fontSize: 12,
    fontWeight: '400',
    color: GoDeliveryColors.secondary,
  },
  text: {
    fontSize: 14,
    fontWeight: '400',
    color: GoDeliveryColors.secondary,
  },
  textBold: {
    fontSize: 14,
    fontWeight: '600',
    color: GoDeliveryColors.secondary,
  },
  textDisable: {
    fontSize: 14,
    fontWeight: '400',
    color: GoDeliveryColors.disabled,
  },
  diabledColor: {
    color: GoDeliveryColors.disabled,
  },
  assignedColor: {
    color: '#F47B0A',
  },
  processingColor: {
    color: '#FA4A0C',
  },
  subTitleText: {
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
    textAlign: 'center',
    color: GoDeliveryColors.primary,
    marginVertical: 15,
  },
  headerTitle: {
    color: GoDeliveryColors.secondary,
    fontSize: 20,
    fontWeight: 'bold',
  },
  subTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: GoDeliveryColors.secondary,
  },
  textFieldErrorMsgArea: {
    height: 30,
    paddingLeft: 20,
    color: GoDeliveryColors.primary,
  },
  headerSection: {
    alignItems: 'center',
    height: 50,
    width: '100%',
    justifyContent: 'center',
    backgroundColor: GoDeliveryColors.white,
    ...Platform.select({
      ios: {
        shadowColor: GoDeliveryColors.secondary,
        shadowOffset: {
          width: 0,
          height: 8,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 8,
        shadowOffset: {
          width: 0,
          height: 8,
        },
        shadowColor: GoDeliveryColors.secondary,
      },
    }),
  },
  headerBackButton: {
    position: 'absolute',
    left: 20,
    padding: 10,
  },
  headerCheckButton: {
    position: 'absolute',
    right: 20,
    padding: 10,
  },
  errorTooltip: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    position: 'absolute',
    right: -10,
    top: 50,
    zIndex: 100,
  },
  errorIcon: {
    backgroundColor: GoDeliveryColors.primary,
    padding: 1,
    borderRadius: 100,
    width: 22,
    height: 22,
  },
  whiteHeaderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: GoDeliveryColors.secondary,
  },
  errorMessageBack: {
    backgroundColor: GoDeliveryColors.secondary,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderTopWidth: 2,
    marginTop: 3,
    borderColor: GoDeliveryColors.primary,
    borderRadius: 5,
  },
  textMedium: {
    fontSize: 14,
    fontWeight: '500',
    color: GoDeliveryColors.secondary,
  },
});

export default GlobalStyles;
