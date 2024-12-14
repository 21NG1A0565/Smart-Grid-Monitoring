import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Text,
  List,
  ListItem,
  ListIcon,
  Progress,
  Badge,
  VStack,
  useColorModeValue
} from '@chakra-ui/react';
import { MdInfo } from 'react-icons/md';

interface LoadBalanceStatus {
  current_load: number;
  threshold: number;
  is_balanced: boolean;
  recommendations: string[];
}

export const LoadBalanceMonitor = () => {
  const [status, setStatus] = useState<LoadBalanceStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const bgColor = useColorModeValue('white', 'gray.700');

  useEffect(() => {
    fetchLoadBalance();
    const interval = setInterval(fetchLoadBalance, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchLoadBalance = async () => {
    try {
      const response = await fetch('http://localhost:8000/load-balance/status');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      setStatus(data);
      setError(null);  // Reset error on successful fetch
    } catch (error) {
      setStatus(null);  // Reset status on error
      setError(error.message || 'Error fetching load balance data');
    }
  };

  const getLoadStatusColor = (load: number): string => {
    if (load > 1500) return 'red';
    if (load > 1200) return 'orange';
    if (load < 500) return 'yellow';
    return 'green';
  };

  if (error) {
    return (
      <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg" bg={bgColor} w="100%">
        <Text color="red.500">{error}</Text>
      </Box>
    );
  }

  if (!status) return <Text>Loading...</Text>;

  return (
    <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg" bg={bgColor} w="100%">
      <VStack spacing={4} align="stretch">
        <Heading size="md">Load Balance Monitor</Heading>
        
        <Box>
          <Text mb={2}>Current Load Status</Text>
          <Progress
            value={(status.current_load / 2000) * 100}
            colorScheme={getLoadStatusColor(status.current_load)}
            height="32px"
            borderRadius="md"
          />
          <Text mt={2} fontSize="sm" color="gray.600">
            {status.current_load.toFixed(2)} kW / {status.threshold.toFixed(2)} kW
          </Text>
        </Box>

        <Box>
          <Badge
            colorScheme={status.is_balanced ? 'green' : 'red'}
            fontSize="sm"
            p={2}
            borderRadius="md"
          >
            {status.is_balanced ? 'Load Balanced' : 'Load Imbalance Detected'}
          </Badge>
        </Box>

        {status.recommendations.length > 0 && (
          <Box>
            <Text fontWeight="bold" mb={2}>Recommendations:</Text>
            <List spacing={2}>
              {status.recommendations.map((rec, index) => (
                <ListItem key={index} display="flex" alignItems="center">
                  <ListIcon as={MdInfo} color="blue.500" />
                  {rec}
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </VStack>
    </Box>
  );
};
