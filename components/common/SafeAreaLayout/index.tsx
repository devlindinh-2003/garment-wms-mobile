import React from 'react';
import { StyleSheet, ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SafeAreaLayout: React.FC<ViewProps> = ({ children, ...props }) => {
  return (
    <SafeAreaView
      style={styles.container}
      edges={['left', 'right', 'bottom']}
      {...props}
    >
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default SafeAreaLayout;
