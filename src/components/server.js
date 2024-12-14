import express from 'express';  // Only one import

import cors from 'cors';  // Import cors

const app = express();

// Enable CORS for all origins (for simplicity)
app.use(cors());

// Middleware to parse incoming JSON requests
app.use(express.json());

// POST route for prediction
app.post('/predict', (req, res) => {
  console.log('Received prediction request:', req.body);

  const { temperature, solar_generation, wind_generation } = req.body;

  // Example prediction logic (replace with your actual model)
  const predicted_load = temperature * 0.5 + solar_generation * 0.3 + wind_generation * 0.2;

  res.json({ predicted_load });
});
app.get('/theft-detection/status', (req, res) => {
    res.json({
      is_suspicious: false,
      confidence_score: Math.random() *0.10,
      anomaly_details: {
        current_load: Math.random() *100,  // Example current load (in kW)
        expected_load: Math.random() *100, // Example expected load (in kW)
        load_difference: Math.random() *10, // Difference between expected and actual load (in kW)
      },
      recommendations: [], // Empty recommendations (if no issues detected)
    });
  });

  app.get('/load-balance/status', (req, res) => {
    res.json({
      current_load: Math.random() *1000,
      threshold: Math.random() *1000,
      is_balanced: true,
      recommendations: ['No action required'],
    });
  });

  const mockData = {
    data: [
      {
        timestamp: new Date(Date.now() - 600000).toISOString(),
        load_demand: Math.random() *100,
        solar_generation: Math.random() *100,
        wind_generation: Math.random() *100,
      },
      {
        timestamp: new Date(Date.now() - 300000).toISOString(),
        load_demand: Math.random() *100,
        solar_generation: Math.random() *100,
        wind_generation: Math.random() *100,
      },
      {
        timestamp: new Date().toISOString(),
        load_demand: Math.random() *100,
        solar_generation: Math.random() *100,
        wind_generation: Math.random() *100,
      },
    ],
  };
  
  
  app.get('/data/current', (req, res) => {
    res.json(mockData);
  });
  
  app.get('/stats', (req, res) => {
    res.json({
        total_load: Math.random() * 1000,
        avg_load: Math.random() * 500,
        max_load: Math.random() * 1200,
        min_load: Math.random() * 300
    });
  });

// Start the server on port 8000
app.listen(8000, () => {
  console.log('Server running on http://localhost:8000');
});
