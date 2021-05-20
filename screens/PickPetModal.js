import React, { useState } from 'react';
import {
  Modal,
  View,
  Text
} from 'react-native';
import {
  CheckBox,
  Button
} from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';

const PickPetModal = props => {
  const [checkboxes, setCheckboxes] = useState([
    {
      id: 1,
      title: 'Kedi',
      checked: false,
    },

    {
      id: 2,
      title: 'Köpek',
      checked: false,
    },
    {
      id: 3,
      title: 'Kaplumbağa',
      checked: false,
    },
    {
      id: 4,
      title: 'Sürüngen',
      checked: false,
    },
    {
      id: 5,
      title: 'Aslan',
      checked: false,
    },
    {
      id: 6,
      title: 'Büyük Evcil Hayvan',
      checked: false,
    },
  ]);
  const toggleCheckboxes = id => {
    const temp = checkboxes.map(cb => {
      if (id === cb.id) {
        return {
          ...cb,
          checked: !cb.checked,
        };
      }
      return cb;
    });
    setCheckboxes(temp);
  };

  const sendValuesToParent = () => {
    const value = checkboxes;
    return props.sendValues(value);
  };
  return (
    <Modal
      visible={props.visible}
      animationType="slide"
      onRequestClose={props.onRequestClose}>
      <View style={{ justifyContent: 'center', margin: 10 }}>
        <Text style={{ textAlign: 'center', fontSize: 25 }}>
          Bakabileceğin petler
        </Text>
      </View>

      {checkboxes.map(cb => {
        return (
          <CheckBox
            checkedIcon={
              <Icon name="checkmark-circle-outline" size={25} color="black" />
            }
            uncheckedIcon={
              <Icon name="ellipse-outline" size={25} color="black" />
            }
            title={cb.title}
            key={cb.id}
            checked={cb.checked}
            onPress={() => toggleCheckboxes(cb.id)}
            textStyle={{ fontSize: 18, fontWeight: '300' }}
          />
        );
      })}

      <Button
        title="Tamam"
        onPress={() => {
          sendValuesToParent();
          props.onRequestClose();
        }}
        titleStyle={{ fontSize: 20, fontWeight: '500' }}
        buttonStyle={{ backgroundColor: 'tomato', margin: 30 }}
      />
    </Modal>
  );
};

export default PickPetModal;
