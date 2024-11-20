import React from 'react';
import { Text, View, ViewProps } from 'react-native';
import { styled } from 'nativewind';

interface StatusBadgeProps extends ViewProps {
  variant?:
    | 'default'
    | 'secondary'
    | 'destructive'
    | 'outline'
    | 'success'
    | 'type';
  children: React.ReactNode;
}

const BadgeContainer = styled(View);
const BadgeText = styled(Text);

const StatusBadge: React.FC<StatusBadgeProps> = ({
  variant = 'default',
  children,
  style,
  ...props
}) => {
  const containerStyles = getContainerStyles(variant);
  const textStyles = getTextStyles(variant);

  return (
    <BadgeContainer
      className={`inline-flex items-center rounded-full border px-3 py-1 ${containerStyles}`}
      style={style}
      {...props}
    >
      <BadgeText className={`text-xs font-semibold ${textStyles}`}>
        {children}
      </BadgeText>
    </BadgeContainer>
  );
};

const getContainerStyles = (variant: string) => {
  switch (variant) {
    case 'default':
      return 'bg-blue-500 border-transparent';
    case 'secondary':
      return 'bg-purple-500 border-transparent';
    case 'destructive':
      return 'bg-red-500 border-transparent';
    case 'success':
      return 'bg-green-500 border-transparent';
    case 'outline':
      return 'bg-transparent border-transparent';
    case 'type':
      return 'bg-gray-500 border-transparent';
    default:
      return 'bg-blue-500 border-transparent';
  }
};

const getTextStyles = (variant: string) => {
  switch (variant) {
    case 'outline':
      return 'text-gray-700';
    default:
      return 'text-white';
  }
};

export default StatusBadge;
