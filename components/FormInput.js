import React from 'react'
import { TextInput } from 'react-native';
import { StyleSheet, Text, View } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
const FormInput = ({ icon, touched, error, ...otherProps }) => {
    const validationColor = !touched ? '#223e4b' : error ? '#FF5A5F' : '#223e4b';
    return (
        <>
            <View style={{
                flexDirection: 'row',
                height: 50,
                alignItems: 'center',
                borderRadius: 8,
                borderColor: validationColor,
                borderWidth: 1,
                padding: 2
            }}>
                <View style={{ padding: 8 }}>
                    <Icon name={icon} size={20} color={validationColor} />
                </View>
                <View style={{ flex: 1 }}>
                    <TextInput
                        underlineColorAndroid='transparent'
                        placeholderTextColor='rgba(34, 62, 75, 0.7)'
                        style={{fontFamily:'Poppins-Regular',fontSize:15}}
                        {...otherProps}
                    />
                </View>
            </View>
        </>
    )
}

export default FormInput

const styles = StyleSheet.create({})
