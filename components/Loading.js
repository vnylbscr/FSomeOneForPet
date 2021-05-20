import React from 'react';
import {
    StyleSheet,
    ActivityIndicator,
    View
} from 'react-native';

const Loading = ({ size, color }) => {
    return (
        <View style={styles.container}>
            <ActivityIndicator size={size} color={color} />
        </View>
    )
};

export default Loading;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
