import Theme from '@/constants/Theme';
import { CameraView, useCameraPermissions } from 'expo-camera';
import React, { useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Text, Button } from 'react-native-paper';

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
  const [scannedData, setScannedData] = useState<string | null>(null); // Store scanned barcode data

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
    let { data } = result;
    data = data.trim();
    if (!isLocked) {
      setIsLocked(true); // Lock the camera
      setScannedData(data); // Store scanned data
    }
  };

  // Retry scanning
  const handleRetry = () => {
    setIsLocked(false); // Unlock the camera
    setScannedData(null); // Clear scanned data
  };

  const handleNext = () => {
    if (scannedData) {
      onScanComplete(scannedData); // Pass scanned data to parent
      onClose(); // Close the camera
    }
  };

  return (
    <View style={styles.fullScreenContainer}>
      {scannedData ? (
        // Display scanned data and action buttons
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>Scanned Value:</Text>
          <Text style={styles.resultValue}>{scannedData}</Text>
          <View style={styles.buttonGroup}>
            <Button
              mode='contained'
              onPress={handleRetry}
              style={styles.retryButton}
              labelStyle={styles.buttonText}
            >
              Retry
            </Button>
            <Button
              mode='contained'
              onPress={handleNext}
              style={styles.nextButton}
              labelStyle={styles.buttonText}
            >
              Next
            </Button>
          </View>
        </View>
      ) : (
        // Camera view with scanning area overlay
        <CameraView
          style={StyleSheet.absoluteFillObject}
          facing='back'
          onBarcodeScanned={isLocked ? undefined : handleBarCodeScanned} // Disable scanning if locked
          barcodeScannerSettings={{
            barcodeTypes: ['code128'],
          }}
        >
          {/* Overlay for transparent scanning area */}
          <View style={styles.overlay}>
            <View style={styles.overlayTop} />
            <View style={styles.overlayMiddle}>
              <View style={styles.overlaySide} />
              <View style={styles.scanningArea} />
              <View style={styles.overlaySide} />
            </View>
            <View style={styles.overlayBottom} />
          </View>

          {/* Close button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.controlButton} onPress={onClose}>
              <Text style={styles.controlText}>Close</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
  },
  overlayTop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  overlayMiddle: {
    height: height * 0.3, // Adjust the scanning area height
    flexDirection: 'row',
  },
  overlayBottom: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  overlaySide: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  scanningArea: {
    width: width * 0.8, // Adjust the width of the scanning area
    borderWidth: 2,
    borderColor: 'white',
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Transparent fill
  },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 20,
  },
  resultText: {
    color: 'white',
    fontSize: 20,
    marginBottom: 10,
  },
  resultValue: {
    color: Theme.primaryLightBackgroundColor,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  retryButton: {
    backgroundColor: 'orange',
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  nextButton: {
    backgroundColor: 'green',
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
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
