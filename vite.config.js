export default {
    optimizeDeps: {
      include: ['react', 'react-dom'] 
    },
    // vite.config.js

    server: {
      proxy: {
        '/theft-detection/status': 'http://localhost:8000', // Forward the requests
      },
    },
  
  
  };
  