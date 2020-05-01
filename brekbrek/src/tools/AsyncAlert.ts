import {Alert} from 'react-native';

export const AsyncAlert = async (message: string) =>
  new Promise((resolve) => {
    Alert.alert(
      message,
      null,
      [
        {
          text: 'Tamam',
          onPress: () => {
            resolve();
          },
        },
      ],
      {cancelable: false},
    );
  });
