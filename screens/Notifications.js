import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const Notifications = ({route, navigation}) => {
  const [state, setState] = useState();
  const id = route.params.id;
  return (
    <View>
      <Text>User id :{id}</Text>
    </View>
  );
};

export default Notifications;

const styles = StyleSheet.create({});
