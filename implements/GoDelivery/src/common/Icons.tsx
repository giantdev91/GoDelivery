
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Octicons from 'react-native-vector-icons/Octicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import GoDeliveryColors from '../styles/colors';
import GlobalStyles from '../styles/style';

const BackIcon = () => {
    return (
        <FontAwesome6 name="arrow-left-long" size={22} color={GoDeliveryColors.secondary} />
    )
}

const ConfirmCheckIcon = () => {
    return (
        <FontAwesome6 name='check' size={22} color={GoDeliveryColors.secondary} />
    )
}

const MyLocationIcon = () => {
    return (
        <MaterialIcons
            name="my-location"
            size={20}
            color={GoDeliveryColors.secondary}
        />
    )
}

const NotificationIcon = () => {
    return (
        <MaterialCommunityIcons name='bell' size={25} color={GoDeliveryColors.secondary} />
    )
}

const FromLocationIcon = () => {
    return (
        <FontAwesome6 name={"circle-dot"} size={20} color={GoDeliveryColors.primary} />
    )
}

const ToLocationIcon = () => {
    return (
        <FontAwesome6 name={"location-dot"} size={20} color={GoDeliveryColors.primary} />
    )
}

const FavIcon = () => {
    return (
        <Ionicons name={"heart-outline"} size={24} color={GoDeliveryColors.disabled} />
    )
}

const ClockIcon = () => {
    return (
        <Octicons name={"clock"} size={20} color={GoDeliveryColors.disabled} />
    )
}

const SearchIcon = () => {
    return (
        <Ionicons name={"search"} size={24} color={GoDeliveryColors.disabled} />
    )
}

const WarningIcon = () => {
    return (
        <Ionicons name="alert-outline" size={20} color={GoDeliveryColors.white} style={GlobalStyles.errorIcon} />
    )
}

const ForwardLinkIcon = () => {
    return (
        <Ionicons name="chevron-forward-outline" color={GoDeliveryColors.secondary} size={24} />
    )
}

const UserIcon = () => {
    return (
        <Feather name="user" color={GoDeliveryColors.disabled} size={24} />
    )
}

const HomeIcon = () => {
    return (
        <Feather name="home" color={GoDeliveryColors.disabled} size={24} />
    )
}

const PhoneIcon = () => {
    return (
        <Feather name="phone" color={GoDeliveryColors.disabled} size={24} />
    )
}

const TextEditIcon = () => {
    return (
        <Ionicons
            name="reader-outline"
            size={25}
            color={GoDeliveryColors.disabled}
        />
    )
}

const CheckRectangle = () => {
    return (
        <Ionicons
            name="checkbox-outline"
            size={25}
            color={GoDeliveryColors.disabled}
        />
    )
}

const CameraIcon = () => {
    return (
        <Feather
            name="camera"
            size={25}
            style={{
                color: GoDeliveryColors.primary,
            }}
        />
    )
}

const ImageIcon = () => {
    return (
        <Feather
            name="image"
            color={GoDeliveryColors.white}
            size={30}
        />
    )
}

const CameraIconWhite = () => {
    return (
        <Feather
            name="camera"
            color={GoDeliveryColors.white}
            size={30}
        />
    )
}

const GlobIcon = () => {
    return (
        <Ionicons name="globe-outline" size={25} color={GoDeliveryColors.disabled} />
    )
}

const PasswordIcon = () => {
    return (
        <Ionicons name="lock-closed-outline" size={25} color={GoDeliveryColors.disabled} />
    )
}

const SaveIcon = () => {
    return (
        <Ionicons name="save-outline" size={25} color={GoDeliveryColors.disabled} />
    )
}

const DocumentIcon = () => {
    return (
        <Ionicons name="document-text-outline" size={25} color={GoDeliveryColors.disabled} />
    )
}

const ShieldCheckIcon = () => {
    return (
        <Ionicons name="shield-checkmark-outline" size={25} color={GoDeliveryColors.disabled} />
    )
}

const TrashIcon = () => {
    return (
        <Ionicons name="trash-outline" size={25} color={GoDeliveryColors.disabled} />
    )
}

const LogoutIcon = () => {
    return (
        <Ionicons name="log-out-outline" size={25} color={GoDeliveryColors.disabled} />
    )
}

const RadioOnIcon = () => {
    return (
        <Ionicons name={"radio-button-on-outline"} size={15} color={GoDeliveryColors.primary} />
    )
}

const RadioOffIcon = () => {
    return (
        <Ionicons name={"radio-button-off-outline"} size={15} color={GoDeliveryColors.primary} />
    )
}

const HeaderOptionIcon = () => {
    return (
        <Feather name='more-vertical' size={25} color={GoDeliveryColors.secondary} />
    )
}

const BigDocumentIcon = () => {
    return (
        <Ionicons name="document-text-outline" size={120} color={'#c7c7c7'} />
    )
}

const RedCheckMarker = () => {
    return (
        <Ionicons name="checkmark-outline" size={20} color={GoDeliveryColors.primary} />
    )
}

const PhoneCallIcon = () => {
    return (
        <MaterialIcons name="phone" size={20} color={GoDeliveryColors.white} />
    )
}

const SMSIcon = () => {
    return (
        <MaterialIcons name="message" size={20} color={GoDeliveryColors.white} />
    )
}

export {
    BackIcon,
    ConfirmCheckIcon,
    MyLocationIcon,
    NotificationIcon,
    FromLocationIcon,
    ToLocationIcon,
    FavIcon,
    ClockIcon,
    SearchIcon,
    WarningIcon,
    ForwardLinkIcon,
    UserIcon,
    HomeIcon,
    PhoneIcon,
    TextEditIcon,
    CheckRectangle,
    CameraIcon,
    ImageIcon,
    CameraIconWhite,
    GlobIcon,
    PasswordIcon,
    SaveIcon,
    DocumentIcon,
    ShieldCheckIcon,
    TrashIcon,
    LogoutIcon,
    RadioOnIcon,
    RadioOffIcon,
    HeaderOptionIcon,
    BigDocumentIcon,
    RedCheckMarker,
    PhoneCallIcon,
    SMSIcon
}