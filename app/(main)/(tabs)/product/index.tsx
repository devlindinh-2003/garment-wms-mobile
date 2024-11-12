import React from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { Text } from 'react-native-paper';
import { InspectionRequestType } from '@/enums/inspectionRequestType';
import { InspectionRequestStatus } from '@/enums/inspectionRequestStatus';
import { useGetInspectionStatisticByType } from '@/hooks/useGetImportRequestStatistic';
import { useGetAllInspectionRequest } from '@/hooks/useGetAllInspectionRequest';
import ProductList from '@/components/product/ProductList';
import ProductStatistic from '@/components/product/ProductStatisctic';

const ProductPage = () => {
  const {
    data: productStatistic,
    isPending: isStatisticPending,
    isError: isStatisticError,
  } = useGetInspectionStatisticByType(InspectionRequestType.PRODUCT);

  const { data, isPending, isError, isSuccess } = useGetAllInspectionRequest({
    pageSize: 10,
    pageIndex: 0,
  });

  const inspectedProductList = isSuccess
    ? data?.data.filter(
        (request) =>
          request.type === InspectionRequestType.PRODUCT &&
          request.status === InspectionRequestStatus.INSPECTED
      ) || []
    : [];

  const inspectingProductList = isSuccess
    ? data?.data.filter(
        (request) =>
          request.type === InspectionRequestType.PRODUCT &&
          request.status === InspectionRequestStatus.INSPECTING
      ) || []
    : [];

  return (
    <ScrollView className='px-4 py-3 bg-gray-100 space-y-3'>
      <Text
        style={{ fontWeight: 'bold' }}
        variant='titleLarge'
        className='text-primaryLight capitalize mb-2 text-center'
      >
        Product Statistics
      </Text>
      {/* Product Statistic */}
      <ProductStatistic statistic={productStatistic?.data} />
      {/* Product List with both inspected and inspecting requests */}
      <ProductList
        inspectedRequests={inspectedProductList}
        inspectingRequests={inspectingProductList}
      />
    </ScrollView>
  );
};

export default ProductPage;
