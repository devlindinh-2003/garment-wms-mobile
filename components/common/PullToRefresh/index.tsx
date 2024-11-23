import React, { FC, ReactNode } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  ViewStyle,
} from 'react-native';

type PullToRefreshProps = {
  children: ReactNode;
  onRefresh: () => Promise<void> | void;
  refreshing: boolean;
  contentContainerStyle?: ViewStyle;
};

const PullToRefresh: FC<PullToRefreshProps> = ({
  children,
  onRefresh,
  refreshing,
  contentContainerStyle,
}) => {
  return (
    <ScrollView
      contentContainerStyle={[styles.container, contentContainerStyle]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#ff0000', '#00ff00', '#0000ff']}
        />
      }
    >
      {children}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f9f9f9',
  },
});

export default PullToRefresh;
