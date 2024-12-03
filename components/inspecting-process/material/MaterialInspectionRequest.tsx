import StatusBadge from '@/components/common/StatusBadge';
import Theme from '@/constants/Theme';
import { convertDate } from '@/helpers/converDate';
import { convertDateWithTime } from '@/helpers/convertDateWithTime';
import {
  Calendar,
  ClipboardCopy,
  Notebook,
  UserRoundSearch,
} from 'lucide-react-native';
import React from 'react';
import { View } from 'react-native';
import { Card, Text } from 'react-native-paper';

interface MaterialInspectionRequestInfoProps {
  inspectionRequestCode: string;
  inspectionRequestStatus: string;
  inspectionRequestCreatedAt: string | null;
  inspectionDeptFirstName: string;
  inspectionDeptLastName: string;
  inspectionRequestNote: string | null;
  managerName: string;
  importRequestCode?: string;
}

const MaterialInspectionRequest: React.FC<
  MaterialInspectionRequestInfoProps
> = ({
  inspectionRequestCode,
  inspectionRequestStatus,
  inspectionRequestCreatedAt,
  inspectionDeptFirstName,
  inspectionDeptLastName,
  inspectionRequestNote,
  managerName,
  importRequestCode,
}) => {
  return (
    <View>
      {/* Header Section */}
      <View className='flex-row items-center justify-between mb-4'>
        <Text className='text-slate-500 font-semibold'>
          Inspection Request:{' '}
          <Text className='text-primaryLight font-bold'>
            {inspectionRequestCode}
          </Text>
        </Text>
        <StatusBadge variant='default'>{inspectionRequestStatus}</StatusBadge>
      </View>

      {/* Inspection Details Section */}
      <View className='bg-white rounded-lg shadow-sm mb-4 p-4'>
        {/* Request Date and Inspector Information */}
        <View className='flex-row items-center justify-between mb-4'>
          <View className='flex-row items-center'>
            <Calendar size={20} color='#6b7280' className='mr-2' />
            <Text className='text-gray-700 font-medium'>
              Request:{' '}
              <Text className='text-black font-bold'>
                {inspectionRequestCreatedAt
                  ? convertDateWithTime(inspectionRequestCreatedAt)
                  : 'N/A'}
              </Text>
            </Text>
          </View>
          <View className='flex-row items-center'>
            <UserRoundSearch size={20} color='#6b7280' className='mr-2' />
            <Text className='text-gray-700 font-medium'>
              <Text className='text-black font-bold'>
                {inspectionDeptFirstName} {inspectionDeptLastName}
              </Text>
            </Text>
          </View>
        </View>

        {/* Import Request Code */}
        <View className='flex-row items-center mb-3'>
          <ClipboardCopy size={20} color='#6b7280' className='mr-2' />
          <Text className='text-gray-700 font-medium'>Import Request: </Text>
          <StatusBadge>
            {/* update this later */}
            {importRequestCode}
            {/* {inspectionDeptName || 'Tung Trong'} */}
          </StatusBadge>
        </View>

        {/* Manager Information */}
        <View className='flex-row items-center justify-between mb-4'>
          <View className='flex-row items-center'>
            <UserRoundSearch size={20} color='#6b7280' className='mr-2' />
            <Text className='text-gray-700 font-medium'>
              Manager:{' '}
              <Text className='text-black font-bold'>{managerName}</Text>
            </Text>
          </View>
        </View>

        {/* Note Section */}
        <View className='mb-4'>
          <View className='flex-row items-center mb-2'>
            <Notebook color={Theme.greyText} size={18} className='mr-2' />
            <Text className='text-gray-700 font-semibold'>Note</Text>
          </View>
          <Card className='bg-gray-100 p-3 rounded-md h-40'>
            <Text className='text-gray-600'>
              {inspectionRequestNote || 'No notes available'}
            </Text>
          </Card>
        </View>
      </View>
    </View>
  );
};

export default MaterialInspectionRequest;
