import { Image, StyleSheet, Text, View } from "react-native"
import GlobalStyles from "../styles/style"
import GoDeliveryColors from "../styles/colors"

const OfflineScreen = () => {
    return (
        <View style={{ flex: 1, }}>
            <View style={styles.offlineHeader}>
                <Image source={require('../../assets/images/offline-tag.png')} style={styles.offlineTag} />
                <View>
                    <Text style={styles.offlineTitleText}>You are offline!</Text>
                    <Text style={GlobalStyles.textBold}>Go online to start accepting jobs.</Text>
                </View>
            </View>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Image source={require('../../assets/images/offline.png')} style={{ width: '75%', resizeMode: 'contain' }} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    offlineHeader: {
        backgroundColor: GoDeliveryColors.yellow,
        width: '100%',
        paddingHorizontal: 20,
        paddingVertical: 10,
        flexDirection: 'row',
        gap: 20,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    offlineTitleText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: GoDeliveryColors.secondary
    },
    offlineTag: {
        width: 60,
        height: 60,
        resizeMode: 'contain'
    },
})

export default OfflineScreen;