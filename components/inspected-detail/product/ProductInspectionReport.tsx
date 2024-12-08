import React from 'react';
import { View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { Text } from 'react-native-paper';
import ProductDetailCard from './ProductDetailCard';
import { InspectionReportDetail } from '@/types/InspectionReportDetail';

interface ProductInspectionReportProps {
  inspectionReportCode: string;
  totalMaterials: number;
  chartData: { value: number; frontColor: string; label: string }[];
  failPercentage: string;
  passPercentage: string;
  inspectionReportDetails: InspectionReportDetail[];
  allDefects: { id: string; description: string }[];
}

const ProductInspectionReport: React.FC<ProductInspectionReportProps> = ({
  inspectionReportCode,
  totalMaterials,
  chartData,
  failPercentage,
  passPercentage,
  inspectionReportDetails,
  allDefects,
}) => {
  const mapDefects = (detailDefects: any[]) => {
    // Map all defects and set missing ones to quantity 0
    return allDefects.map((defect) => {
      const matchedDefect = detailDefects.find((d) => d.defectId === defect.id);
      return {
        id: defect.id,
        description: defect.description,
        quantity: matchedDefect?.quantityByPack || 0,
      };
    });
  };

  return (
    <View>
      {/* Inspection Report */}
      <View className='flex-row items-center mt-4 px-3'>
        <Text className='text-slate-500 font-semibold'>Inspection Report:</Text>
        <Text className='text-primaryLight font-bold'>
          {inspectionReportCode || 'N/A'}
        </Text>
      </View>

      {/* Total Materials */}
      <View className='px-3'>
        <Text className='text-lg font-bold mt-4'>Total Materials</Text>
        <Text className='text-4xl font-bold mb-3'>{totalMaterials}</Text>
      </View>

      {/* Bar Chart */}
      <View className='mt-3 my-4 w-full items-center'>
        <BarChart
          data={chartData}
          width={300}
          height={300}
          barWidth={50}
          maxValue={totalMaterials}
          noOfSections={4}
          isAnimated
          spacing={80}
        />
      </View>

      {/* Legend */}
      <View className='flex-row justify-between mt-4 items-center w-40 mx-auto'>
        <View className='flex-row items-center'>
          <View className='w-3 h-3 bg-red-500 mr-2 rounded-full' />
          <Text>Fail</Text>
        </View>
        <Text className='font-bold'>{failPercentage}%</Text>
      </View>
      <View className='flex-row justify-between mt-2 items-center w-40 mx-auto'>
        <View className='flex-row items-center'>
          <View className='w-3 h-3 bg-green-500 mr-2 rounded-full' />
          <Text>Pass</Text>
        </View>
        <Text className='font-bold'>{passPercentage}%</Text>
      </View>

      <View>
        <Text className='text-blue-500 mt-7 text-center text-2xl font-semibold mb-3 uppercase'>
          Inspection Report Details
        </Text>
        {inspectionReportDetails.map((detail) => (
          <ProductDetailCard
            key={detail.id}
            image={detail.productSize?.productVariant?.image || ''}
            name={detail.productSize?.name || 'N/A'}
            code={detail.productSize?.code || 'N/A'}
            height={`${detail.productSize?.height || 0}m`}
            width={`${detail.productSize?.width || 0}m`}
            weight={`${detail.productSize?.weight || 0}kg`}
            length={`${detail.productSize?.length || 0}m`}
            total={
              detail.quantityByPack ||
              detail.approvedQuantityByPack + detail.defectQuantityByPack ||
              0
            }
            pass={detail.approvedQuantityByPack || 0}
            fail={detail.defectQuantityByPack || 0}
            defects={mapDefects(detail.inspectionReportDetailDefect || [])}
          />
        ))}
      </View>
    </View>
  );
};

export default ProductInspectionReport;
