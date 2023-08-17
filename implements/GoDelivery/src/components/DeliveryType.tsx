import { Text, TouchableOpacity, View, StyleSheet } from "react-native"
import Icons from 'react-native-vector-icons/Ionicons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import GoDeliveryColors from "../styles/colors";

const DeliveryType = ({ title, content, handler }: {
    title: string,
    content: string,
    handler: () => void
}) => {
    return (
        <TouchableOpacity style={styles.cardBack} onPress={handler}>
            <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{title}</Text>
                <Text style={styles.content}>{content}</Text>
            </View>
            <View style={styles.iconBack}>
                <FontAwesomeIcon name='chevron-right' size={20} color={GoDeliveryColors.labelColor} />
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    cardBack: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        width: '100%',
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 10,
        padding: 20,
        height: 120,
        marginVertical: 15,
    },
    cardTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: GoDeliveryColors.labelColor,
        marginBottom: 10,
    },
    content: {
        fontSize: 14,
        fontWeight: '400',
        color: GoDeliveryColors.labelColor
    },
    iconBack: {
        width: 20,
        height: '100%',
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
});

export default DeliveryType;