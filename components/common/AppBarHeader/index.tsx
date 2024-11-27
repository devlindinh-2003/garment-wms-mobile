import React from 'react';
import {
  TopNavigation,
  TopNavigationAction,
  IconElement,
  IconProps,
} from '@ui-kitten/components';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { MoveLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Theme from '@/constants/Theme';

interface AppbarHeaderProps {
  title: string;
  onPress?: () => void; // Optional custom onPress handler
  icon?: (props: IconProps) => IconElement;
  titleSize?: number;
}

const AppbarHeader: React.FC<AppbarHeaderProps> = ({
  title,
  onPress,
  icon,
  titleSize = 18,
}) => {
  const router = useRouter();

  // Default back icon and navigation action
  const BackIcon = icon
    ? icon
    : (props: IconProps): IconElement => (
        <MoveLeft
          {...props}
          color={Theme.primaryLightBackgroundColor}
          size={30}
        />
      );

  const handleBackPress = () => {
    if (onPress) {
      onPress(); // Call custom handler if provided
    } else {
      router.back(); // Default to router.back()
    }
  };

  const BackAction = (): React.ReactElement => (
    <TopNavigationAction icon={BackIcon} onPress={handleBackPress} />
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
