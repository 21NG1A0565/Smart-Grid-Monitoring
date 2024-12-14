import React, { useEffect, useState } from 'react';
import { Box, Heading, Button, Spinner } from '@chakra-ui/react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const EnergyDashboard = () => {
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(false); // Add loading state
  const [chartKey, setChartKey] = useState(0); // Track the chart key for forcing re-render

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000); // Auto-update every minute
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true); // Start loading
      const response = await fetch('http://localhost:8000/data/current'); // Replace with your API
      const data = await response.json();

      // Log the fetched data for debugging purposes
      console.log('Fetched data:', data);

      const labels = data.data.map((d: any) => new Date(d.timestamp).toLocaleTimeString());

      // Update chart data
      setChartData({
        labels,
        datasets: [
          {
            label: 'Load Demand',
            data: data.data.map((d: any) => d.load_demand),
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          },
          {
            label: 'Solar Generation',
            data: data.data.map((d: any) => d.solar_generation),
            borderColor: 'rgb(255, 205, 86)',
            tension: 0.1
          },
          {
            label: 'Wind Generation',
            data: data.data.map((d: any) => d.wind_generation),
            borderColor: 'rgb(54, 162, 235)',
            tension: 0.1
          }
        ]
      });

      // Force re-render by updating the chartKey state
      setChartKey(prevKey => prevKey + 1);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg" bg="white" w="100%">
      <Heading size="md" mb={4}>Real-time Energy Distribution</Heading>

      {/* Refresh Button */}
      <Button
        onClick={fetchData}
        colorScheme="blue"
        mb={4}
        isLoading={loading} // Show spinner while loading
        loadingText="Refreshing"
      >
        Refresh Data
      </Button>

      {/* Spinner if data is loading */}
      {loading && !chartData && <Spinner size="xl" />}

      {/* Line Chart if data is available */}
      {chartData && (
        <Line
          key={chartKey} // Change key whenever chart data changes
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top' as const,
              },
              title: {
                display: true,
                text: 'Energy Distribution Over Time'
              }
            }
          }}
        />
      )}
    </Box>
  );
};
