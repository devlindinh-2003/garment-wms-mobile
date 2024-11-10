import React from 'react';
import {
  TopNavigation,
  TopNavigationAction,
  IconElement,
  IconProps,
} from '@ui-kitten/components';
import { View, GestureResponderEvent } from 'react-native';
import { Text } from 'react-native-paper';
import { MoveLeft } from 'lucide-react-native';
import Theme from '@/constants/Theme';

interface AppbarHeaderProps {
  title: string;
  onPress?: (event: GestureResponderEvent) => void;
  icon?: (props: IconProps) => IconElement;
  titleSize?: number;
}

const AppbarHeader: React.FC<AppbarHeaderProps> = ({
  title,
  onPress,
  icon,
  titleSize = 18,
}) => {
  const BackIcon = icon
    ? icon
    : (props: IconProps): IconElement => (
        <MoveLeft
          {...props}
          color={Theme.primaryLightBackgroundColor}
          size={30}
        />
      );

  const BackAction = (): React.ReactElement => (
    <TopNavigationAction icon={BackIcon} onPress={onPress} />
  );

  const renderTitle = (): React.ReactElement => (
    <Text
      className='text-center font-bold text-primaryLight'
      style={{ fontSize: titleSize }}
    >
      {title}
    </Text>
  );

  return (
    <View className='bg-white border-b border-gray-300 mb-5'>
      <TopNavigation
        accessoryLeft={BackAction}
        title={renderTitle}
        alignment='center'
      />
    </View>
  );
};

export default AppbarHeader;
