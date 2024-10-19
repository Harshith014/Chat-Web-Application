// LoadingComponent.js
import { Box, LinearProgress, Typography } from '@mui/material';
import React from 'react';

const LoadingComponent = ({ progress = 100 }) => {
  return (
    <Box sx={{ width: '100%', textAlign: 'center', mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Loading...
      </Typography>
      <LinearProgress variant="determinate" value={progress} />
    </Box>
  );
};

export default LoadingComponent;