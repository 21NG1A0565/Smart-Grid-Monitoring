import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  useToast
} from '@chakra-ui/react';

export const PredictionForm = () => {
  const [inputs, setInputs] = useState({
    temperature: '',
    solar_generation: '',
    wind_generation: ''
  });
  const [prediction, setPrediction] = useState<number | null>(null);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          temperature: parseFloat(inputs.temperature) || 0,
          solar_generation: parseFloat(inputs.solar_generation) || 0,
          wind_generation: parseFloat(inputs.wind_generation) || 0
        }),
      });

      // Check if the response is successful (status code 2xx)
      if (!response.ok) {
        throw new Error(`Server returned status: ${response.status}`);
      }

      const data = await response.json();
      setPrediction(data.predicted_load);

      toast({
        title: 'Prediction successful',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      console.error('Error making prediction:', error); // Log the error to the console

      toast({
        title: 'Error making prediction',
        description: error.message || 'An error occurred while fetching the prediction.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg" bg="white" w="100%">
      <Heading size="md" mb={4}>Load Prediction</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl>
            <FormLabel>Temperature (°C)</FormLabel>
            <Input
              name="temperature"
              type="number"
              value={inputs.temperature}
              onChange={handleChange}
              placeholder="Enter temperature"
            />
          </FormControl>
          
          <FormControl>
            <FormLabel>Solar Generation (kW)</FormLabel>
            <Input
              name="solar_generation"
              type="number"
              value={inputs.solar_generation}
              onChange={handleChange}
              placeholder="Enter solar generation"
            />
          </FormControl>
          
          <FormControl>
            <FormLabel>Wind Generation (kW)</FormLabel>
            <Input
              name="wind_generation"
              type="number"
              value={inputs.wind_generation}
              onChange={handleChange}
              placeholder="Enter wind generation"
            />
          </FormControl>
          
          <Button type="submit" colorScheme="blue">
            Predict Load
          </Button>
          
          {prediction !== null && (
            <Text fontSize="lg" fontWeight="bold">
              Predicted Load: {Number.isFinite(prediction) ? prediction.toFixed(2) : 'Invalid prediction'} kW
            </Text>
          )}
        </VStack>
      </form>
    </Box>
  );
};
