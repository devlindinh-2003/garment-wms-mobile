import React from 'react';
import { View, Text } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import MaterialDetailCard from './MaterialDetailCard';
import { InspectionReportDetail } from '@/types/InspectionReportDetail';
import { ImportRequest } from '@/types/ImportRequestType';

const mockDefects = [
  {
    id: '99ddad0e-e1b6-4eb5-ba6f-0611e355fe03',
    description: 'Drop stitches',
    quantity: 5,
  },
  {
    id: 'd1ac0777-00f5-4a48-b305-d5c269b15e12',
    description: 'Crease marks',
    quantity: 3,
  },
  {
    id: '3b09167b-2d0f-4850-921f-c91d361d90d1',
    description: 'Holes in the fabric',
    quantity: 7,
  },
  {
    id: '6be4626f-c8ce-4f24-ae45-ebe4e598ac08',
    description: 'Uneven dyeing/printing/dye marks',
    quantity: 4,
  },
  {
    id: '7d93677c-50b7-4fc8-93a2-f462526832c3',
    description: 'Misprinting, off printing or absence of printing',
    quantity: 2,
  },
  {
    id: 'e07ef1bb-0163-4b9f-9559-a8f8e368dfb0',
    description: 'Wrong color',
    quantity: 6,
  },
];

interface MaterialInspectionReportProps {
  inspectionReportCode: string;
  totalMaterials: number;
  chartData: { value: number; frontColor: string; label: string }[];
  failPercentage: string;
  passPercentage: string;
  inspectionReportDetails: InspectionReportDetail[];
  importRequest: ImportRequest;
}

const MaterialInspectionReport: React.FC<MaterialInspectionReportProps> = ({
  inspectionReportCode,
  totalMaterials,
  chartData,
  failPercentage,
  passPercentage,
  inspectionReportDetails,
  importRequest,
}) => {
  return (
    <View>
      {/* Inspection Report */}
      <View className='flex-row items-center mt-4 px-3'>
        <Text className='text-slate-500 font-semibold'>
          Inspection Report:{' '}
        </Text>
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
          height={500}
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
          <MaterialDetailCard
            key={detail.id}
            image={detail.materialPackage?.materialVariant?.image || ''}
            name={detail.materialPackage?.name || 'N/A'}
            code={detail.materialPackage?.code || 'N/A'}
            height={`${detail.materialPackage?.packedHeight || 0}m`}
            width={`${detail.materialPackage?.packedWidth || 0}m`}
            weight={`${detail.materialPackage?.packedWeight || 0}kg`}
            length={`${detail.materialPackage?.packedLength || 0}m`}
            total={detail?.quantityByPack || 0}
            pass={detail.approvedQuantityByPack || 0}
            fail={detail.defectQuantityByPack || 0}
            defects={mockDefects}
          />
        ))}
      </View>
    </View>
  );
};

export default MaterialInspectionReport;
