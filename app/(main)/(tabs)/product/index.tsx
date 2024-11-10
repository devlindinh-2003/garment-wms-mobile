import ProductList from '@/components/product/ProductList';
import ProductStatisctic from '@/components/product/ProductStatisctic';
import React from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { Text } from 'react-native-paper';

const ProductPage = () => {
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
      <ProductStatisctic />
      {/* Product Table */}
      <ProductList />
    </ScrollView>
  );
};

export default ProductPage;
