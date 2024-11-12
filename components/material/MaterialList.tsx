import React from 'react';
import { View } from 'react-native';
import {
  Card,
  DataTable,
  Searchbar,
  Text,
  TouchableRipple,
} from 'react-native-paper';
import { useRouter } from 'expo-router';
import StatusBadge from '../common/StatusBadge';
import { InspectionRequest } from '@/types/InspectionRequest';

interface MaterialListProps {
  inspectedRequests?: InspectionRequest[];
  inspectingRequests?: InspectionRequest[];
}

const MaterialList: React.FC<MaterialListProps> = ({
  inspectedRequests = [],
  inspectingRequests = [],
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [page, setPage] = React.useState<number>(0);
  const [numberOfItemsPerPageList] = React.useState([10, 20, 30]);
  const [itemsPerPage, onItemsPerPageChange] = React.useState(
    numberOfItemsPerPageList[0]
  );
  const router = useRouter();
  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, inspectedRequests.length);

  React.useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

  const renderStatusBadge = (status: string) => (
    <StatusBadge variant='success'>{status}</StatusBadge>
  );

  const isDataEmpty =
    inspectedRequests.length === 0 && inspectingRequests.length === 0;
  const hasIncomingRequests = inspectingRequests.length > 0;

  return (
    <View className='mt-5 mb-9 px-2'>
      <Card className='rounded-lg shadow-lg p-6 bg-white'>
        <View className='flex-row items-center justify-between mb-4 space-x-5'>
          <Searchbar
            placeholder='Search'
            onChangeText={setSearchQuery}
            value={searchQuery}
            className={`bg-blue-100 rounded-full flex-1 px-3 ${
              isDataEmpty ? 'hidden' : ''
            }`}
            inputStyle={{ fontSize: 16 }}
            iconColor='#6E6E6E'
          />
          <TouchableRipple
            onPress={() =>
              hasIncomingRequests &&
              router.push({
                pathname: '/(tabs)/material/[incoming-request]',
                params: {
                  'incoming-request': 'incoming-request',
                  inspectingRequestsList: JSON.stringify(inspectingRequests),
                },
              })
            }
            rippleColor='rgba(0, 0, 0, 0.1)'
            borderless
            disabled={!hasIncomingRequests}
          >
            <Text
              className={`font-semibold underline ${
                hasIncomingRequests ? 'text-blue-500' : 'text-gray-400'
              }`}
            >
              Incoming Request ({inspectingRequests.length})
            </Text>
          </TouchableRipple>
        </View>

        <DataTable>
          <DataTable.Header>
            <DataTable.Title className='flex-1.5 justify-center items-center text-base font-medium text-gray-700'>
              Report Code
            </DataTable.Title>
            <DataTable.Title className='flex-1 justify-center items-center text-base font-medium text-gray-700'>
              Status
            </DataTable.Title>
          </DataTable.Header>

          {isDataEmpty ? (
            <DataTable.Row>
              <DataTable.Cell className='justify-center items-center'>
                <Text className='text-gray-500'>Table data is empty</Text>
              </DataTable.Cell>
            </DataTable.Row>
          ) : (
            inspectedRequests.slice(from, to).map((item) => (
              <DataTable.Row key={item.id} className='h-12'>
                <DataTable.Cell className='flex-1.5 justify-center items-center text-sm text-gray-800'>
                  {item.code}
                </DataTable.Cell>
                <DataTable.Cell className='flex-1 justify-center items-center'>
                  {renderStatusBadge(item.status)}
                </DataTable.Cell>
              </DataTable.Row>
            ))
          )}

          {!isDataEmpty && (
            <DataTable.Pagination
              page={page}
              numberOfPages={Math.ceil(inspectedRequests.length / itemsPerPage)}
              onPageChange={(page) => setPage(page)}
              label={`${from + 1}-${to} of ${inspectedRequests.length}`}
              numberOfItemsPerPageList={numberOfItemsPerPageList}
              numberOfItemsPerPage={itemsPerPage}
              onItemsPerPageChange={onItemsPerPageChange}
              showFastPaginationControls
              selectPageDropdownLabel='Rows per page'
            />
          )}
        </DataTable>
      </Card>
    </View>
  );
};

export default MaterialList;
