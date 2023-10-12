import React from 'react';
import { StyleSheet, View, ActivityIndicator, Platform } from 'react-native';
import WebView from 'react-native-webview';
import { DarkSpining } from './SVGComponent';

const CustomIndicator = (): JSX.Element => {
    const scalesPageToFit = Platform.OS === 'android';

    return (
        <View style={styles.indicatorWrapper}>
            {/* <ActivityIndicator size="large" style={styles.indicator} color={'purple'} /> */}
            <WebView
                scrollEnabled={false}
                style={styles.indicator}
                source={{ html: DarkSpining }}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    indicatorWrapper: {
        position: 'absolute',
        alignSelf: 'center',
        bottom: 300
    },
    indicator: { width: 35, height: 35, backgroundColor: 'transparent', overflow: 'hidden' },
});

export default CustomIndicator;