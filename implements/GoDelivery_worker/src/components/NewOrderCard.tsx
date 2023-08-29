import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import GlobalStyles from "../styles/style";
import { Divider } from "react-native-paper";
import GoDeliveryColors from "../styles/colors";

const NewOrderCard = ({ order, handleAccept }: {
    order: any,
    handleAccept: (id: number) => void
}) => {
    return (
        <TouchableOpacity onPress={() => { handleAccept(order["id"]) }}>
            <View style={styles.dataCard}>
                <View style={styles.cardHeader}>
                    <View style={styles.subNameSection}>
                        <View>
                            {!order["client"]['avatar'] && (
                                <Image
                                    style={styles.userAvatar}
                                    source={require('../../assets/images/delivery-man.png')}
                                />
                            )}
                            {order["client"]['avatar'] && (
                                <Image style={styles.userAvatar} source={{ uri: order["client"]['avatar'] }} />
                            )}
                        </View>
                        <View style={{ width: 160, }}>
                            <Text style={GlobalStyles.subTitle} numberOfLines={1}>{order["client"]["name"]}</Text>
                            <Text style={GlobalStyles.textBold}>{order["client"]["phone"]}</Text>
                        </View>
                    </View>
                    <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                        <Text style={GlobalStyles.subTitle}>{order["price"] && (`MZN ${order["price"]}`)}</Text>
                        {/* <Text style={GlobalStyles.subTitle}>MZN 89.00</Text> */}
                        <Text style={GlobalStyles.subTitle}>{order["distance"] && (`${order["distance"]} KM`)}</Text>
                        {/* <Text style={GlobalStyles.textBold}>2.8 KM</Text> */}
                    </View>
                </View>
                <View style={styles.locationStrArea}>
                    <Text style={[GlobalStyles.textBold, { fontSize: 18, fontWeight: 'bold' }]}>PICK-UP LOCATION</Text>
                    <Text numberOfLines={2} style={GlobalStyles.text}>{order["from"]}</Text>
                </View>
                <Divider style={styles.divider} />
                <View style={styles.locationStrArea}>
                    <Text style={[GlobalStyles.textBold, { fontSize: 18, fontWeight: 'bold' }]}>DROP OFF LOCATION</Text>
                    <Text numberOfLines={2} style={GlobalStyles.text}>{order["to"]}</Text>
                </View>
                <Divider style={styles.divider} />
                <View style={styles.acceptBtnBack}>
                    <TouchableOpacity style={styles.acceptBtn} onPress={() => { handleAccept(order["id"]) }}>
                        <Text style={[GlobalStyles.primaryLabel, { fontSize: 14, fontWeight: 'bold' }]}>ACCEPT</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    dataCard: {
        flex: 1,
        marginVertical: 10,
        marginHorizontal: 10,
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        backgroundColor: GoDeliveryColors.white,
        borderRadius: 20,
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
                shadowColor: GoDeliveryColors.secondary
            },
        }),
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: GoDeliveryColors.place,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    subNameSection: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
    userAvatar: {
        width: 50,
        height: 50,
        borderRadius: 200,
    },
    locationStrArea: {
        width: '100%',
        paddingHorizontal: 20,
        paddingVertical: 5,
    },
    divider: {
        borderColor: GoDeliveryColors.place,
        borderWidth: 0.25,
        width: '100%',
    },
    acceptBtnBack: {
        width: '100%',
        justifyContent: 'flex-end',
        paddingVertical: 10,
        alignItems: 'flex-end',
        paddingRight: 40
    },
    acceptBtn: {
        backgroundColor: GoDeliveryColors.primary,
        width: 100,
        paddingVertical: 5,
        alignItems: 'center',
        borderRadius: 5,
    },
});

export default NewOrderCard;