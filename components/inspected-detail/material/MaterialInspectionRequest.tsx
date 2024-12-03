import React from 'react';
import { View } from 'react-native';
import { Text, Card } from 'react-native-paper';
import {
  Calendar,
  CalendarCheck2,
  ClipboardCopy,
  Notebook,
  UserRoundSearch,
} from 'lucide-react-native';
import StatusBadge from '@/components/common/StatusBadge';
import Theme from '@/constants/Theme';
import { convertDate } from '@/helpers/converDate';
import { convertDateWithTime } from '@/helpers/convertDateWithTime';

interface MaterialInspectionRequestInfoProps {
  inspectionRequestCode: string;
  inspectionRequestStatus: string;
  inspectionReportCreatedAt: string | null;
  inspectionDeptName: string | null;
  inspectionRequestDate: string | null;
  inspectionRequestNote: string | null;
  importRequestCode?: string;
}

const MaterialInspectionRequestInfo: React.FC<
  MaterialInspectionRequestInfoProps
> = ({
  inspectionRequestCode,
  inspectionRequestStatus,
  inspectionReportCreatedAt,
  inspectionRequestDate,
  inspectionRequestNote,
  importRequestCode,
}) => {
  return (
    <View>
      <View className='flex-row items-center justify-between px-2'>
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
        <View className='flex-row items-center justify-between mb-4 gap-3'>
          <View className='flex-row items-center'>
            <Calendar size={20} color='#6b7280' className='mr-2' />
            <Text className='text-gray-700 font-medium'>
              Request:{' '}
              <Text className='text-black font-bold'>
                {inspectionRequestDate
                  ? convertDateWithTime(inspectionRequestDate)
                  : 'N/A'}
              </Text>
            </Text>
          </View>

          <View className='flex-row items-center'>
            <UserRoundSearch size={20} color='#6b7280' className='mr-2' />
            <Text className='text-gray-700 font-medium'>
              <Text className='text-black font-bold'>
                {/* update this later */}
                {'Tung Trong'}
                {/* {inspectionDeptName || 'Tung Trong'} */}
              </Text>
            </Text>
          </View>
        </View>

        {/* Inspected Date */}
        <View className='flex-row items-center mb-3'>
          <CalendarCheck2 size={20} color={Theme.green[600]} className='mr-2' />
          <Text className='text-green-800 font-medium'>Inspected Date: </Text>
          <Text className='text-green-600 font-bold'>
            {/* update this later */}
            {convertDateWithTime(inspectionReportCreatedAt || '')}
          </Text>
        </View>

        {/* Import Request Code */}
        <View className='flex-row items-center'>
          <ClipboardCopy size={20} color='#6b7280' className='mr-2' />
          <Text className='text-gray-700 font-medium'>Import Request: </Text>
          <StatusBadge>
            {/* update this later */}
            {importRequestCode}
            {/* {inspectionDeptName || 'Tung Trong'} */}
          </StatusBadge>
        </View>

        {/* Note Section */}
        <View className='mb-4 mt-3'>
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

export default MaterialInspectionRequestInfo;
