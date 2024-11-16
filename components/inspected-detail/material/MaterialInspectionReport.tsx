import React from 'react';
import { View, Text } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import MaterialDetailCard from './MaterialDetailCard';
import { InspectionReport } from '@/types/InspectionReport';

interface MaterialInspectionReportProps {
  inspectionReportCode: string;
  totalMaterials: number;
  chartData: { value: number; frontColor: string; label: string }[];
  failPercentage: string;
  passPercentage: string;
  inspectionReport: InspectionReport;
}

const MaterialInspectionReport: React.FC<MaterialInspectionReportProps> = ({
  inspectionReportCode,
  totalMaterials,
  chartData,
  failPercentage,
  passPercentage,
  inspectionReport,
}) => {
  return (
    <View>
      {/* Inspection Report */}
      <View className='flex-row items-center mt-4'>
        <Text className='text-slate-500 font-semibold'>
          Inspection Report:{' '}
        </Text>
        <Text className='text-primaryLight font-bold'>
          {inspectionReportCode || 'N/A'}
        </Text>
      </View>

      {/* Total Materials */}
      <Text className='text-lg font-bold mt-4'>Total Materials</Text>
      <Text className='text-4xl font-bold mb-3'>{totalMaterials}</Text>

      {/* Bar Chart */}
      <View className='mt-3 my-4 w-full items-center'>
        <BarChart
          data={chartData}
          width={300}
          height={200}
          barWidth={50}
          maxValue={totalMaterials}
          noOfSections={4}
          roundedTop={false}
          roundedBottom={false}
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
        {inspectionReport.inspectionReportDetail.map((detail) => (
          <MaterialDetailCard
            key={detail.id}
            image={detail.materialPackage?.materialVariant?.image || ''}
            name={detail.materialPackage?.name || 'N/A'}
            code={detail.materialPackage?.code || 'N/A'}
            height={`${detail.materialPackage?.packedHeight || 0}m`}
            width={`${detail.materialPackage?.packedWidth || 0}m`}
            weight={`${detail.materialPackage?.packedWeight || 0}kg`}
            length={`${detail.materialPackage?.packedLength || 0}m`}
            total={detail.quantityByPack || 0}
            pass={detail.approvedQuantityByPack}
            fail={detail.defectQuantityByPack}
          />
        ))}
      </View>
    </View>
  );
};

export default MaterialInspectionReport;
