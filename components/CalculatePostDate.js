import React from 'react'
import { StyleSheet, Text } from 'react-native';

/**
     * Postun paylaşıldığı tarihi hesaplar.
     */
const CalculatePostDate = ({ date }) => {
    const dateNow = new Date();
    const timeDifference = dateNow.getTime() - date.getTime();
    const dateDifference = Math.round(timeDifference / (1000 * 3600 * 24));
    return (
        dateDifference !== 0 ? (
            <Text style={styles.dateText}>{dateDifference} gün önce paylaşıldı</Text>
        ) : (
            <Text style={styles.dateText}>Bugün paylaşıldı</Text>
        )
    )
}

export default CalculatePostDate

const styles = StyleSheet.create({
    dateText: {
        fontSize: 15,
        fontFamily: 'Poppins-Regular',
        color: 'black',
        opacity: 0.7,
    },
})
