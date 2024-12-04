import React from 'react';
import { Snackbar } from 'react-native-paper';
import { View } from 'react-native';

interface SnackbarComponentProps {
  visible: boolean;
  message: string;
  onDismiss: () => void;
  type?: 'success' | 'error';
}

const capitalizeFirstLetter = (message: string) =>
  message.charAt(0).toUpperCase() + message.slice(1);

const SnackbarComponent: React.FC<SnackbarComponentProps> = ({
  visible,
  message,
  onDismiss,
  type = 'success',
}) => {
  const snackbarStyles = {
    success: 'bg-green-600 text-white',
    error: 'bg-red-600 text-white',
  };

  const selectedStyle = snackbarStyles[type];

  return (
    <View className='absolute bottom-4 left-4 right-4'>
      <Snackbar
        visible={visible}
        onDismiss={onDismiss}
        action={{
          label: 'Close',
          onPress: onDismiss,
          textColor: 'white',
        }}
        className={`rounded-lg ${selectedStyle}`}
      >
        {capitalizeFirstLetter(message)}
      </Snackbar>
    </View>
  );
};

export default SnackbarComponent;
