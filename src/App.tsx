import React from 'react';
import { ChakraProvider, Box, VStack, Heading, Container } from '@chakra-ui/react';
import { EnergyDashboard } from './components/EnergyDashboard';
import { PredictionForm } from './components/PredictionForm';
import { StatsDisplay } from './components/StatsDisplay';
import { LoadBalanceMonitor } from './components/LoadBalanceMonitor';
import { TheftDetectionMonitor } from './components/TheftDetectionMonitor';

function App() {

  return (
    <ChakraProvider>
      <Box minH="100vh" bg="gray.50" py={5}>
        <Container maxW="container.xl">
          <VStack spacing={8}>
            <Heading as="h1" size="xl" textAlign="center">
              Smart Grid Energy Distribution System
            </Heading>
            <TheftDetectionMonitor />
            <ChakraProvider>
      <Box p={5}>
        <LoadBalanceMonitor />
      </Box>
    </ChakraProvider>
            <EnergyDashboard />
            <PredictionForm />
            <ChakraProvider>
      <Container maxW="container.lg" mt={10}>
        <StatsDisplay />
      </Container>
    </ChakraProvider>
          </VStack>
        </Container>
      </Box>
    </ChakraProvider>
    
  );
  
}

export default App;