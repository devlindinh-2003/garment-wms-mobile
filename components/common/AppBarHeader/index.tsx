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
import { styled } from 'nativewind';
import Theme from '@/constants/Theme';

interface AppbarHeaderProps {
  title: string;
  onPress?: (event: GestureResponderEvent) => void;
  icon?: (props: IconProps) => IconElement;
  titleSize?: number;
}

const StyledView = styled(View);
const StyledText = styled(Text);

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
    <StyledText
      className={`text-center font-bold text-primaryLight`}
      style={{ fontSize: titleSize }}
    >
      {title}
    </StyledText>
  );

  return (
    <StyledView className='bg-white'>
      <TopNavigation
        accessoryLeft={BackAction}
        title={renderTitle}
        alignment='center'
      />
    </StyledView>
  );
};

export default AppbarHeader;
