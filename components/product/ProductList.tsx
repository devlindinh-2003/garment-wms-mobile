import { useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import StatusBadge from '../common/StatusBadge';
import {
  Card,
  DataTable,
  Searchbar,
  Text,
  TouchableRipple,
} from 'react-native-paper';

const ProductList = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [page, setPage] = React.useState<number>(0);
  const [numberOfItemsPerPageList] = React.useState([10, 20, 30]);
  const [itemsPerPage, onItemsPerPageChange] = React.useState(
    numberOfItemsPerPageList[0]
  );
  const router = useRouter();
  const mockData = [
    { id: 'IP-0001', dateCreated: '10/02/2022', status: 'Inspected' },
    { id: 'IP-0002', dateCreated: '10/02/2022', status: 'Inspected' },
    { id: 'IP-0003', dateCreated: '10/02/2022', status: 'Inspected' },
    { id: 'IP-0004', dateCreated: '10/02/2022', status: 'Inspected' },
    { id: 'IP-0005', dateCreated: '10/02/2022', status: 'Inspected' },
    { id: 'IP-0006', dateCreated: '10/02/2022', status: 'Inspected' },
    { id: 'IP-0007', dateCreated: '10/02/2022', status: 'Inspected' },
    { id: 'IP-0008', dateCreated: '10/02/2022', status: 'Inspected' },
    { id: 'IP-0009', dateCreated: '10/02/2022', status: 'Inspected' },
    { id: 'IP-0010', dateCreated: '10/02/2022', status: 'Inspected' },
  ];
  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, mockData.length);

  React.useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

  const renderStatusBadge = () => (
    <StatusBadge variant='success'>Inspected</StatusBadge>
  );

  return (
    <View className='mt-5 mb-9'>
      <Card className='rounded-lg shadow-lg p-4 bg-white'>
        <View className='flex-row items-center space-x-3 mb-4'>
          <Searchbar
            placeholder='Search'
            onChangeText={setSearchQuery}
            value={searchQuery}
            className='bg-blue-100 rounded-full flex-1 px-3'
            inputStyle={{ fontSize: 16 }}
            iconColor='#6E6E6E'
          />
          <TouchableRipple
            onPress={() => router.push('/(tabs)/product/incoming-request')}
            rippleColor='rgba(0, 0, 0, 0.1)'
            borderless
          >
            <Text className='text-blue-500 font-semibold underline'>
              Incoming Request (10)
            </Text>
          </TouchableRipple>
        </View>

        <DataTable>
          <DataTable.Header>
            <DataTable.Title className='text-gray-600'>
              Report Code
            </DataTable.Title>
            <DataTable.Title className='text-gray-600'>
              Date Created
            </DataTable.Title>
            <DataTable.Title className='text-gray-600 ml-9'>
              Status
            </DataTable.Title>
          </DataTable.Header>

          {mockData.slice(from, to).map((item) => (
            <DataTable.Row key={item.id}>
              <DataTable.Cell className='text-blue-500'>
                {item.id}
              </DataTable.Cell>
              <DataTable.Cell className='text-gray-600'>
                {item.dateCreated}
              </DataTable.Cell>
              <DataTable.Cell>{renderStatusBadge()}</DataTable.Cell>
            </DataTable.Row>
          ))}

          <DataTable.Pagination
            page={page}
            numberOfPages={Math.ceil(mockData.length / itemsPerPage)}
            onPageChange={(page) => setPage(page)}
            label={`${from + 1}-${to} of ${mockData.length}`}
            numberOfItemsPerPageList={numberOfItemsPerPageList}
            numberOfItemsPerPage={itemsPerPage}
            onItemsPerPageChange={onItemsPerPageChange}
            showFastPaginationControls
            selectPageDropdownLabel='Rows per page'
          />
        </DataTable>
      </Card>
    </View>
  );
};

export default ProductList;
