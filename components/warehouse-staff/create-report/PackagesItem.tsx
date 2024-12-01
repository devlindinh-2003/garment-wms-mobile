import React, { useState, useEffect } from 'react';
import { View, Text, Modal } from 'react-native';
import { Card, Divider, Button, TextInput } from 'react-native-paper';
import { NotepadText, CalendarPlus } from 'lucide-react-native';
import StatusBadge from '@/components/common/StatusBadge';
import Theme from '@/constants/Theme';
import { convertDate } from '@/helpers/converDate';
import PackagesDetail from './PackagesDetail';

interface InventoryReportDetail {
  id: string;
  expectedQuantity: number;
  actualQuantity: number | null;
  managerQuantityConfirm: number | null;
  materialReceipt?: {
    id: string;
    code: string;
    expireDate?: string;
    importDate?: string;
    status: string;
  };
  productReceipt?: {
    id: string;
    code: string;
    expireDate?: string;
    importDate?: string;
    status: string;
  };
}

interface PackagesItemProps {
  details: InventoryReportDetail[];
  updateDetails: (updatedDetails: InventoryReportDetail[]) => void;
  selectedDetail?: {
    receiptCode: string;
    receiptType: 'material' | 'product';
  } | null;
}

const PackagesItem: React.FC<PackagesItemProps> = ({
  details,
  updateDetails,
  selectedDetail,
}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [receiptCode, setReceiptCode] = useState<string | null>(null);
  const [receiptType, setReceiptType] = useState<'material' | 'product' | null>(
    null
  );
  const [currentDetails, setCurrentDetails] = useState(details);

  // Automatically open modal if selectedDetail is set
  useEffect(() => {
    if (selectedDetail) {
      const { receiptCode, receiptType } = selectedDetail;
      const detailExists = currentDetails.some(
        (d) =>
          d.materialReceipt?.code === receiptCode ||
          d.productReceipt?.code === receiptCode
      );
      if (detailExists) {
        setReceiptCode(receiptCode);
        setReceiptType(receiptType);
        setModalVisible(true);
      }
    }
  }, [selectedDetail]);

  const openModal = (code: string | null, type: 'material' | 'product') => {
    setReceiptCode(code);
    setReceiptType(type);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setReceiptCode(null);
    setReceiptType(null);
  };

  const updateActualQuantity = (code: string, quantity: string) => {
    const updatedDetails = currentDetails.map((detail) =>
      detail.materialReceipt?.code === code ||
      detail.productReceipt?.code === code
        ? { ...detail, actualQuantity: parseFloat(quantity) }
        : detail
    );
    setCurrentDetails(updatedDetails);
    updateDetails(updatedDetails);
    closeModal();
  };

  const getActualQuantity = (code: string) => {
    const detail = currentDetails.find(
      (d) => d.materialReceipt?.code === code || d.productReceipt?.code === code
    );
    return detail?.actualQuantity?.toString() || '';
  };

  return (
    <>
      <View className='bg-gray-100'>
        {currentDetails.map((detail, index) => (
          <Card
            key={index}
            className='mb-4 rounded-xl shadow-lg bg-white border border-gray-200'
          >
            <Card.Content>
              <View className='flex flex-row items-center justify-between mb-4'>
                <Text className='text-lg font-bold text-black'>
                  {detail.materialReceipt
                    ? `Material Receipt:`
                    : `Product Receipt:`}
                </Text>
                <StatusBadge>
                  {detail.materialReceipt
                    ? detail.materialReceipt.code
                    : detail.productReceipt?.code || 'N/A'}
                </StatusBadge>
              </View>
              <Divider className='mb-4' />

              {/* Expected Quantity */}
              <View className='mb-2'>
                <View className='flex-row items-center justify-between mb-2'>
                  <View className='flex-row items-center gap-2'>
                    <NotepadText size={20} color={Theme.greyText} />
                    <Text className='text-sm font-semibold text-gray-700'>
                      Expected Quantity:
                    </Text>
                  </View>
                  <Text className='font-bold text-gray-700 text-lg'>
                    {detail.expectedQuantity}
                  </Text>
                </View>
              </View>

              {/* Import Date */}
              {detail.materialReceipt && (
                <View className='mb-4'>
                  <View className='flex-row items-center justify-between mb-2'>
                    <View className='flex-row items-center gap-2'>
                      <CalendarPlus size={20} color={Theme.greyText} />
                      <Text className='text-sm font-semibold text-gray-700'>
                        Import Date:
                      </Text>
                    </View>
                    <Text className='text-sm text-gray-700'>
                      {convertDate(detail.materialReceipt.importDate)}
                    </Text>
                  </View>
                  <Divider className='my-4' />
                </View>
              )}

              {/* Actual Quantity */}
              <View className='mb-4'>
                <View className='flex-row items-center justify-between gap-3'>
                  <Text className='text-sm font-semibold text-gray-700'>
                    Actual Quantity:
                  </Text>
                  <TextInput
                    mode='outlined'
                    value={detail.actualQuantity?.toString() || 'NOT YET'}
                    disabled
                    className='flex-1'
                  />
                </View>
              </View>

              {/* Edit / Open Button */}
              <Button
                icon={
                  detail.actualQuantity
                    ? 'pencil-circle-outline'
                    : 'clipboard-arrow-right'
                }
                mode='contained'
                onPress={() =>
                  openModal(
                    detail.materialReceipt?.code ||
                      detail.productReceipt?.code ||
                      '',
                    detail.materialReceipt ? 'material' : 'product'
                  )
                }
                className={
                  detail.actualQuantity ? 'bg-blue-500' : 'bg-green-500'
                }
              >
                {detail.actualQuantity ? 'Edit' : 'Open'}
              </Button>
            </Card.Content>
          </Card>
        ))}
      </View>

      {/* Modal for Packages Detail */}
      <Modal
        presentationStyle='pageSheet'
        animationType='slide'
        transparent={false}
        visible={isModalVisible}
        onRequestClose={closeModal}
      >
        {isModalVisible && receiptType && receiptCode && (
          <PackagesDetail
            closeModal={closeModal}
            receiptCode={receiptCode}
            receiptType={receiptType}
            updateActualQuantity={updateActualQuantity}
            actualQuantity={getActualQuantity(receiptCode)}
          />
        )}
      </Modal>
    </>
  );
};

export default PackagesItem;
