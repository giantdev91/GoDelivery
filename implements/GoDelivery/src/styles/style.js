import {StyleSheet, Dimensions, Platform} from 'react-native';
import GoDeliveryColors from './colors';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const GlobalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GoDeliveryColors.white,
  },
  contentAreaPadding: {
    paddingHorizontal: 20,
  },
  authenticationScreenLogoBack: {
    marginTop: 50,
    alignItems: 'center',
    height: 220,
    justifyContent: 'center',
    backgroundColor: GoDeliveryColors.white,
  },
  authenticationScreenLogo: {
    height: 220,
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
    height: 45,
    backgroundColor: GoDeliveryColors.primary,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryLabel: {
    color: GoDeliveryColors.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  primaryEmphasizeLabel: {
    color: GoDeliveryColors.primary,
    fontSize: 12,
    fontWeight: '400',
  },
  primaryEmphasizeLabelHigher: {
    color: GoDeliveryColors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  indicator: {
    borderWidth: 1,
    borderColor: 'red',
  },
  text: {
    fontSize: 12,
    fontWeight: '400',
    color: GoDeliveryColors.secondary,
  },
  textBold: {
    fontSize: 12,
    fontWeight: '600',
    color: GoDeliveryColors.secondary,
  },
  textDisable: {
    fontSize: 12,
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
  textMedium: {
    fontSize: 14,
    fontWeight: '500',
    color: GoDeliveryColors.secondary,
  },
  subTitleText: {
    fontSize: 18,
    fontWeight: '400',
    alignSelf: 'center',
    textAlign: 'center',
    color: GoDeliveryColors.primary,
    marginVertical: 15,
  },
  headerTitle: {
    color: GoDeliveryColors.secondary,
    fontSize: 22,
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
  authenticationHeaderTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: GoDeliveryColors.primary,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 15,
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
  whiteHeaderTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: GoDeliveryColors.secondary,
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
  errorMessageBack: {
    backgroundColor: GoDeliveryColors.secondary,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderTopWidth: 2,
    marginTop: 3,
    borderColor: GoDeliveryColors.primary,
    borderRadius: 5,
  },
  locationStrContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: GoDeliveryColors.white,
    paddingHorizontal: 15,
    borderRadius: 5,
    paddingVertical: 7,
    gap: 10,
  },
  locationStr: {
    flex: 1,
    fontSize: 12,
    fontWeight: '400',
    color: GoDeliveryColors.disabled,
  },
  markerContainer: {
    position: 'absolute',
    width: 50,
    height: 60,
    left: SCREEN_WIDTH / 2 - 25,
    bottom: (SCREEN_HEIGHT - 50 - 65) / 2 + 20,
  },
  mapMarker: {
    width: 50,
    height: 60,
  },
  markerLabel: {
    width: '100%',
    textAlign: 'center',
    marginTop: -45,
    color: GoDeliveryColors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  dividerStyle: {
    borderColor: GoDeliveryColors.dividerColor,
    borderWidth: 0.25,
    width: '100%',
  },
  textInput: {
    fontSize: 12,
    fontWeight: '400',
    color: GoDeliveryColors.disabled,
    paddingVertical: 3,
    paddingLeft: 0,
  },
  iconBack: {
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default GlobalStyles;
