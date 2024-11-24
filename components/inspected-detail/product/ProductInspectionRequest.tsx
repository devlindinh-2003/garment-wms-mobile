import StatusBadge from '@/components/common/StatusBadge';
import Theme from '@/constants/Theme';
import { convertDate } from '@/helpers/converDate';
import { Calendar, Notebook, UserRoundSearch } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';

interface ProductInspectionRequestInfoProps {
  inspectionRequestCode: string;
  inspectionRequestStatus: string;
  inspectionReportCreatedAt: string | null;
  inspectionDeptName: string | null;
  inspectionRequestNote: string | null;
}

const ProductInspectionRequestInfo: React.FC<
  ProductInspectionRequestInfoProps
> = ({
  inspectionRequestCode,
  inspectionRequestStatus,
  inspectionReportCreatedAt,
  inspectionRequestNote,
}) => {
  return (
    <View>
      <View className='flex-row items-center justify-between'>
        <View className='flex-row items-center'>
          <Text className='text-slate-500 font-semibold'>
            Inspection Request:{' '}
          </Text>
          <Text className='text-primaryLight font-bold'>
            {inspectionRequestCode}
          </Text>
        </View>
        <View>
          <StatusBadge variant='success'>{inspectionRequestStatus}</StatusBadge>
        </View>
      </View>

      {/* Inspector Info */}
      <View className='mt-3 bg-white px-4 py-3 rounded-lg shadow-sm'>
        {/* Request Date and Inspector */}
        <View className='flex-row items-center justify-between mb-4'>
          <View className='flex-row items-center'>
            <Calendar size={20} color='#6b7280' className='mr-2' />
            <Text className='text-gray-700 font-medium'>
              Date:{' '}
              <Text className='text-black font-bold'>
                {inspectionReportCreatedAt
                  ? convertDate(inspectionReportCreatedAt)
                  : 'N/A'}
              </Text>
            </Text>
          </View>

          <View className='flex-row items-center'>
            <UserRoundSearch size={20} color='#6b7280' className='mr-2' />
            <Text className='text-gray-700 font-medium'>
              Inspector:{' '}
              <Text className='text-black font-bold'>
                {/* update this later */}
                {'Tung Trong'}
                {/* {inspectionDeptName || 'Tung Trong'} */}
              </Text>
            </Text>
          </View>
        </View>

        {/* Note Section */}
        <View className='mb-4'>
          <View className='flex-row items-center mb-2'>
            <Notebook color={Theme.greyText} size={18} className='mr-2' />
            <Text className='text-gray-700 font-semibold'>Note</Text>
          </View>
          <Card className='bg-gray-100 p-3 rounded-md'>
            <Text className='text-gray-600'>
              {inspectionRequestNote || 'No notes available'}
            </Text>
          </Card>
        </View>
      </View>
    </View>
  );
};

export default ProductInspectionRequestInfo;
