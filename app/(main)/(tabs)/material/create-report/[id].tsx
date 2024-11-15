import SpinnerLoading from '@/components/common/SpinnerLoading';
import MaterialInspectionRequest from '@/components/inspecting-process/material/MaterialInspectionRequest';
import { useGetInspectionRequestById } from '@/hooks/useGetInspectionRequestById';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { TextInput, Button, Card, Text } from 'react-native-paper';

const CreateMaterialReport = () => {
  const { id } = useLocalSearchParams();
  const { data, isSuccess, isPending } = useGetInspectionRequestById(
    id as string
  );

  if (isPending) {
    return <SpinnerLoading />;
  }

  if (isSuccess && data) {
    const {
      code: inspectionRequestCode,
      status: inspectionRequestStatus,
      createdAt: inspectionRequestCreatedAt,
      note: inspectionRequestNote,
      inspectionDepartment,
    } = data.data;

    const inspectionDeptFirstName =
      inspectionDepartment?.account?.firstName || 'N/A';
    const inspectionDeptLastName =
      inspectionDepartment?.account?.lastName || 'N/A';

    return (
      <ScrollView className='p-4 bg-white'>
        {/* Material Inspection Request Info */}
        <MaterialInspectionRequest
          inspectionRequestCode={inspectionRequestCode}
          inspectionRequestStatus={inspectionRequestStatus}
          inspectionRequestCreatedAt={inspectionRequestCreatedAt}
          inspectionDeptFirstName={inspectionDeptFirstName}
          inspectionDeptLastName={inspectionDeptLastName}
          inspectionRequestNote={inspectionRequestNote}
        />

        {/* Additional Form for Material Report (PASS and FAIL quantities) */}
        <Card className='mb-4 p-4 rounded-lg shadow-sm'>
          <Text variant='titleMedium' className='mb-2 font-semibold'>
            Material Details
          </Text>
          <Text>Specify pass and fail quantities below:</Text>
          <TextInput
            mode='outlined'
            placeholder='Enter number of PASS materials'
            keyboardType='numeric'
            className='my-4'
          />
          <TextInput
            mode='outlined'
            placeholder='Enter number of FAILED materials'
            keyboardType='numeric'
            className='my-4'
          />
          <Button
            mode='contained'
            onPress={() => console.log('Submit report')}
            className='mt-4 bg-blue-600'
            labelStyle={{ color: 'white', fontWeight: 'bold' }}
          >
            Send Report
          </Button>
        </Card>
      </ScrollView>
    );
  }

  return null;
};

export default CreateMaterialReport;
