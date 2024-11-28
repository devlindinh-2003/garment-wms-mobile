import Theme from '@/constants/Theme';
import { CameraView, useCameraPermissions } from 'expo-camera';
import React, { useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Text } from 'react-native-paper';

// Get the full screen dimensions
const { width, height } = Dimensions.get('screen');

const CameraComponent = ({
  onClose,
  onScanComplete,
}: {
  onClose: () => void;
  onScanComplete: (data: string) => void; // Callback to handle scanned data
}) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [isLocked, setIsLocked] = useState(false); // State to lock the camera

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <TouchableOpacity onPress={requestPermission}>
          <Text style={styles.permissionMessage}>
            Tap to grant camera permissions.
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Handle barcode scanning
  const handleBarCodeScanned = (result: any) => {
    const { data } = result;
    console.log('Barcode scanned:', data);

    if (!isLocked) {
      setIsLocked(true); // Lock the camera
      onScanComplete(data); // Pass the scanned data to the parent
      onClose(); // Close the camera automatically
    }
  };

  return (
    <View style={styles.fullScreenContainer}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing='back'
        onBarcodeScanned={isLocked ? undefined : handleBarCodeScanned} // Disable scanning if locked
        barcodeScannerSettings={{
          barcodeTypes: ['code128'],
        }}
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.controlButton} onPress={onClose}>
            <Text style={styles.controlText}>Close</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  fullScreenCamera: {
    width: width,
    height: height,
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  controlButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  controlText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  permissionMessage: {
    color: 'white',
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default CameraComponent;
