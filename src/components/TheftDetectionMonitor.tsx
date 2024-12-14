import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Progress,
  Badge,
  VStack,
  HStack,
  useColorModeValue,
} from '@chakra-ui/react';

interface TheftDetectionStatus {
  is_suspicious: boolean;
  confidence_score: number;
  anomaly_details: {
    current_load: number;
    expected_load: number;
    load_difference: number;
  };
  recommendations: string[];
}

export const TheftDetectionMonitor = () => {
  const [status, setStatus] = useState<TheftDetectionStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const bgColor = useColorModeValue('white', 'gray.700');

  useEffect(() => {
    fetchTheftStatus();
    const interval = setInterval(fetchTheftStatus, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchTheftStatus = async () => {
    try {
      const response = await fetch('http://localhost:8000/theft-detection/status');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setStatus(data);
      setError(null); // Clear any previous errors
    } catch (error: any) {
      console.error('Error fetching theft detection status:', error);
      setError(`Failed to fetch theft detection status: ${error.message}`);
    }
  };

  if (error) {
    return (
      <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg" bg={bgColor} w="100%">
        <Text color="red.500" fontWeight="bold">{error}</Text>
      </Box>
    );
  }

  if (!status) return <Text>Loading...</Text>;

  return (
    <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg" bg={bgColor} w="100%">
      <VStack spacing={4} align="stretch">
        <HStack justify="space-between">
          <Heading size="md">Power Theft Detection Monitor</Heading>
          <Badge
            colorScheme={status.is_suspicious ? 'red' : 'green'}
            fontSize="sm"
            p={2}
            borderRadius="md"
          >
            {status.is_suspicious ? 'Suspicious Activity Detected' : 'Normal Operation'}
          </Badge>
        </HStack>

        <Progress
          value={status.confidence_score * 100}
          colorScheme={status.is_suspicious ? 'red' : 'green'}
          height="24px"
          borderRadius="md"
        />
      </VStack>
    </Box>
  );
};
