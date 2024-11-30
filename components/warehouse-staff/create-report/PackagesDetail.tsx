import AppbarHeader from '@/components/common/AppBarHeader';
import React from 'react';
import { Text, View } from 'react-native';

interface PackagesDetailProps {
  closeModal: () => void;
  receiptCode: string | null;
}

const PackagesDetail: React.FC<PackagesDetailProps> = ({
  closeModal,
  receiptCode,
}) => {
  return (
    <View>
      <AppbarHeader title={`${receiptCode}`} onPress={closeModal} />
      <Text className='text-red-500 font-semibold text-xl'>
        Packages Details
      </Text>
    </View>
  );
};

export default PackagesDetail;
