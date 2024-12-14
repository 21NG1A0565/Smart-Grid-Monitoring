import React, { useEffect, useState } from 'react';
import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Heading,
  Button,
  Spinner,
} from '@chakra-ui/react';

interface Stats {
  total_load: number;
  avg_load: number;
  max_load: number;
  min_load: number;
}

export const StatsDisplay = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false); // Add loading state

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 60000); // Auto-update every minute
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true); // Start loading
      const response = await fetch('http://localhost:8000/stats'); // Replace with your API endpoint
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg" bg="white" w="100%">
      <Heading size="md" mb={4}>Energy Distribution Statistics</Heading>
      
      {/* Manual Refresh Button */}
      <Button
        onClick={fetchStats}
        colorScheme="blue"
        mb={4}
        isLoading={loading} // Show spinner while loading
        loadingText="Refreshing"
      >
        Refresh Data
      </Button>

      {/* Spinner if data is loading */}
      {loading && !stats && <Spinner size="xl" />}
      
      {/* Display Stats */}
      {stats && (
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={5}>
          <Stat>
            <StatLabel>Total Load</StatLabel>
            <StatNumber>{stats.total_load.toFixed(2)} kW</StatNumber>
            <StatHelpText>Cumulative energy consumption</StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>Average Load</StatLabel>
            <StatNumber>{stats.avg_load.toFixed(2)} kW</StatNumber>
            <StatHelpText>Mean energy consumption</StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>Maximum Load</StatLabel>
            <StatNumber>{stats.max_load.toFixed(2)} kW</StatNumber>
            <StatHelpText>Peak energy demand</StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>Minimum Load</StatLabel>
            <StatNumber>{stats.min_load.toFixed(2)} kW</StatNumber>
            <StatHelpText>Lowest energy demand</StatHelpText>
          </Stat>
        </SimpleGrid>
      )}
    </Box>
  );
};
