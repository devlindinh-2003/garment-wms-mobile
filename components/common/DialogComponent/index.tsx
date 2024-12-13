import React from 'react';
import {
  Button,
  Dialog,
  Portal,
  Text,
  PaperProvider,
} from 'react-native-paper';
import { AlertCircle, CheckCircle } from 'lucide-react-native';

interface DialogComponentProps {
  visible: boolean;
  type: 'warning' | 'confirmation';
  title: string;
  content: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

const DialogComponent: React.FC<DialogComponentProps> = ({
  visible,
  type,
  title,
  content,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}) => {
  const isWarning = type === 'warning';

  return (
    <PaperProvider>
      <Portal>
        <Dialog visible={visible} onDismiss={onCancel}>
          <Dialog.Title className='flex flex-row items-center space-x-2'>
            {isWarning ? (
              <AlertCircle size={20} color='#F59E0B' />
            ) : (
              <CheckCircle size={20} color='#10B981' />
            )}
            <Text
              className={`${
                isWarning ? 'text-amber-500' : 'text-green-500'
              } font-bold text-lg`}
            >
              {title}
            </Text>
          </Dialog.Title>
          <Dialog.Content>
            <Text className='text-gray-700 text-base'>{content}</Text>
          </Dialog.Content>
          <Dialog.Actions className='flex flex-row justify-end space-x-3'>
            <Button
              onPress={onCancel}
              className='bg-gray-200 text-gray-700 px-4 py-2 rounded-lg'
            >
              {cancelText}
            </Button>
            <Button
              onPress={onConfirm}
              className={`${
                isWarning
                  ? 'bg-amber-500 text-white'
                  : 'bg-green-500 text-white'
              } px-4 py-2 rounded-lg`}
            >
              {confirmText}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </PaperProvider>
  );
};

export default DialogComponent;
