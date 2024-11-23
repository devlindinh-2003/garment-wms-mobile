import React, { FC, ReactNode, useState, useEffect } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  ViewStyle,
  Text,
} from 'react-native';

type PullToRefreshProps = {
  children: ReactNode; // Children components
  contentContainerStyle?: ViewStyle; // Optional styling for content
};

const PullToRefresh: FC<PullToRefreshProps> = ({
  children,
  contentContainerStyle,
}) => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

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
