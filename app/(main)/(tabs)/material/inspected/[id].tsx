import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useGetInspectionRequestById } from '@/hooks/useGetInspectionRequestById'; // Custom hook to fetch data

const InspectedDetail = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    data: inspectionData,
    isPending,
    isError,
  } = useGetInspectionRequestById(id || '');

  if (isPending) {
    return (
      <ActivityIndicator size='large' color='#0000ff' style={styles.loader} />
    );
  }

  if (isError || !inspectionData) {
    return <Text style={styles.errorText}>Failed to load data.</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Inspection Details</Text>
      <View style={styles.detailContainer}>
        <Text style={styles.label}>Report Code:</Text>
        <Text style={styles.value}>{inspectionData?.data?.code || 'N/A'}</Text>
      </View>
      <View style={styles.detailContainer}>
        <Text style={styles.label}>Status:</Text>
        <Text style={styles.value}>
          {inspectionData?.data?.status || 'N/A'}
        </Text>
      </View>
      <View style={styles.detailContainer}>
        <Text style={styles.label}>Material Type:</Text>
        <Text style={styles.value}>
          {inspectionData?.data?.materialType || 'N/A'}
        </Text>
      </View>
      <View style={styles.detailContainer}>
        <Text style={styles.label}>Inspection Date:</Text>
        <Text style={styles.value}>
          {inspectionData?.data?.createdAt || 'N/A'}
        </Text>
      </View>
      {/* Add more fields as needed */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    textAlign: 'center',
    color: 'red',
    marginTop: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  detailContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    color: '#333',
  },
  value: {
    color: '#555',
  },
});

export default InspectedDetail;
