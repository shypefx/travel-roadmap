import React from 'react';
import { Card, CardContent, Typography, Box, Avatar } from '@mui/material';
import { useWeather } from '../hooks/useWeather';

const WeatherSummary = () => {
  const city = localStorage.getItem('travelCity');
  const { current, loading } = useWeather(city);

  if (loading || !current) return null;

  return (
    <Card sx={{ mb: 3, borderRadius: 3 }}>
      <CardContent>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar
            src={`https:${current.condition.icon}`}
            alt={current.condition.text}
            sx={{ width: 48, height: 48 }}
          />
          <Box>
            <Typography variant="h6">
              {city} – {current.condition.text}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {Math.round(current.temp_c)}°C – Ressenti {Math.round(current.feelslike_c)}°C
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default WeatherSummary;
