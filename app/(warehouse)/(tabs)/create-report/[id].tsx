import React, { useState, useEffect } from 'react';
import { ScrollView } from 'react-native';
import { Button, Snackbar, Text } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { createInventoryReport } from '@/api/inventoryReport';
import { useGetInventoryReporttById } from '@/hooks/useGetInventoryReportById';
import AppbarHeader from '@/components/common/AppBarHeader';
import HeaderCard from '@/components/warehouse-staff/HeaderCard';
import TeamCard from '@/components/warehouse-staff/TeamCard';
import SearchCard from '@/components/warehouse-staff/SearchCard';
import SavedDetailsList from '@/components/warehouse-staff/SavedDetailList';
import Theme from '@/constants/Theme';

const CreateInventoryReport = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { data, isSuccess } = useGetInventoryReporttById(id as string);

  const [inputs, setInputs] = useState<Record<string, any>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [savedDetails, setSavedDetails] = useState<any[]>([]);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSearchDisabled, setIsSearchDisabled] = useState(true); // New state to control search button

  useEffect(() => {
    if (isSuccess && data?.data?.inventoryReportDetail) {
      const initialInputs: Record<string, any> = {};
      data.data.inventoryReportDetail.forEach((detail: any) => {
        detail.materialPackages.forEach((materialPackage: any) => {
          materialPackage.inventoryReportDetails.forEach(
            (inventoryDetail: any) => {
              initialInputs[inventoryDetail.id] = {
                actualQuantity: '',
                notes: '',
                isSaved: false,
                isEditable: true,
              };
            }
          );
        });
      });
      setInputs(initialInputs);
    }
  }, [isSuccess, data]);

  useEffect(() => {
    // Check if the searchQuery exists in the inventory report details
    const exists = data?.data?.inventoryReportDetail.some((detail: any) =>
      detail.materialPackages.some((materialPackage: any) =>
        materialPackage.inventoryReportDetails.some(
          (reportDetail: any) =>
            reportDetail.materialReceipt?.code.toLowerCase() ===
            searchQuery.toLowerCase()
        )
      )
    );
    setIsSearchDisabled(!exists); // Disable button if `exists` is false
  }, [searchQuery, data]);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    const results: any[] = [];
    data?.data?.inventoryReportDetail.forEach((detail: any) => {
      detail.materialPackages.forEach((materialPackage: any) => {
        materialPackage.inventoryReportDetails.forEach((reportDetail: any) => {
          if (
            reportDetail.materialReceipt?.code
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) &&
            !savedDetails.some((saved) => saved.id === reportDetail.id)
          ) {
            results.push(reportDetail);
          }
        });
      });
    });

    setSavedDetails((prev) => [...prev, ...results]);
    setSearchQuery('');
  };

  const handleInputChange = (id: string, field: string, value: string) => {
    setInputs((prevInputs) => ({
      ...prevInputs,
      [id]: {
        ...prevInputs[id],
        [field]: value,
        isValid: !isNaN(parseInt(value, 10)) && value.trim() !== '',
      },
    }));
  };

  const handleSaveDetail = (id: string) => {
    setInputs((prevInputs) => ({
      ...prevInputs,
      [id]: {
        ...prevInputs[id],
        isSaved: true,
        isEditable: false,
      },
    }));
  };

  const handleEditDetail = (id: string) => {
    setInputs((prevInputs) => ({
      ...prevInputs,
      [id]: {
        ...prevInputs[id],
        isSaved: false,
        isEditable: true,
      },
    }));
  };

  const allInputsValid = savedDetails.every(
    (detail) => inputs[detail.id]?.isValid
  );

  const handleSubmit = async () => {
    if (!allInputsValid) {
      setSnackbarMessage('Please fill in all fields and fix errors.');
      setSnackbarVisible(true);
      return;
    }

    setIsSubmitting(true);

    const details = savedDetails.map((detail) => ({
      inventoryReportDetailId: detail.id,
      actualQuantity: parseInt(inputs[detail.id].actualQuantity, 10),
      note: inputs[detail.id].notes || null,
    }));

    const requestBody = { details };

    console.log('Request Body:', JSON.stringify(requestBody, null, 2));

    try {
      const response = await createInventoryReport(id as string, requestBody);

      if (response.statusCode === 200) {
        router.push({
          pathname: '/(warehouse)/(tabs)/reported/[id]',
          params: { id },
        });
      } else {
        setSnackbarMessage('Submission was successful, but an error occurred.');
        setSnackbarVisible(true);
      }
    } catch (error) {
      setSnackbarMessage('Failed to submit the report.');
      setSnackbarVisible(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isSuccess) return null;

  return (
    <ScrollView className='flex-1 bg-white'>
      <AppbarHeader title='Create Inventory Report' />
      <HeaderCard
        code={data?.data.code}
        status={data?.data.status}
        createdAt={data?.data.createdAt}
        warehouseManager={data?.data?.warehouseManager}
      />
      <TeamCard warehouseStaff={data?.data.warehouseStaff} />
      <SearchCard
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        isSearchDisabled={isSearchDisabled} // Pass button state
      />
      <SavedDetailsList
        savedDetails={savedDetails}
        inputs={inputs}
        handleInputChange={handleInputChange}
        handleSaveDetail={handleSaveDetail}
        handleEditDetail={handleEditDetail}
      />
      <Button
        icon='send'
        mode='contained'
        onPress={handleSubmit}
        buttonColor={Theme.primaryLightBackgroundColor}
        disabled={!allInputsValid || isSubmitting}
        labelStyle={{
          color: 'white',
          fontWeight: 'bold',
        }}
        className={`rounded-lg py-2 px-3 self-center shadow-lg ${
          !allInputsValid || isSubmitting
            ? 'bg-gray-300'
            : 'bg-primaryLight hover:bg-primary-dark'
        }`}
      >
        <Text className='text-white font-semibold text-base'>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Text>
      </Button>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        className='bg-red-500 rounded-lg'
      >
        <Text className='text-white font-bold'>{snackbarMessage}</Text>
      </Snackbar>
    </ScrollView>
  );
};

export default CreateInventoryReport;
