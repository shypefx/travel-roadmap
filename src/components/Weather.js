// components/Weather.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  Chip,
  Paper,
  IconButton,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Divider
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  Thermostat as ThermostatIcon,
  Water as HumidityIcon,
  Air as WindIcon,
  Visibility as VisibilityIcon,
  WbSunny as UvIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Styles personnalisés
const WeatherCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 30px rgba(0,0,0,0.15)'
  }
}));

const CurrentWeatherCard = styled(Paper)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: 'white',
  borderRadius: 20,
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3)
}));

const HourlyWeatherBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  overflowX: 'auto',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  '&::-webkit-scrollbar': {
    height: 8,
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 4,
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.primary.main,
    borderRadius: 4,
  }
}));

const Weather = () => {
  // États
  const [weatherData, setWeatherData] = useState(null);
  const [currentCity, setCurrentCity] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Chargement initial
  useEffect(() => {
    const savedCity = localStorage.getItem('travelCity') || 'Paris';
    setCurrentCity(savedCity);
    setSearchCity(savedCity);
    fetchWeather(savedCity);
  }, []);

  // Fonction pour récupérer la météo
  const fetchWeather = async (city) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=f5dafd6e9a4d40fb983140900252107&q=${encodeURIComponent(city)}&days=7&aqi=yes&alerts=yes`
      );
      
      if (!response.ok) {
        throw new Error('Ville non trouvée');
      }
      
      const data = await response.json();
      setWeatherData(data);
      setCurrentCity(city);
      localStorage.setItem('travelCity', city);
      
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  // Rechercher une nouvelle ville
  const handleSearch = () => {
    if (searchCity.trim()) {
      fetchWeather(searchCity.trim());
    }
  };

  // Actualiser
  const handleRefresh = () => {
    fetchWeather(currentCity);
  };

  // Fonction utilitaires
  const getDayName = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    
    if (date.toDateString() === today.toDateString()) {
      return "Aujourd'hui";
    }
    
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    if (date.toDateString() === tomorrow.toDateString()) {
      return "Demain";
    }
    
    return date.toLocaleDateString('fr-FR', { weekday: 'long' });
  };

  const getMomentIcon = (hour) => {
    if (hour >= 6 && hour < 12) return '🌅';
    if (hour >= 12 && hour < 18) return '☀️';
    if (hour >= 18 && hour < 22) return '🌆';
    return '🌙';
  };

  const getWindDirection = (degree) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return directions[Math.round(degree / 45) % 8];
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header avec recherche */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          🌤️ Météo - {currentCity}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            fullWidth
            placeholder="Rechercher une ville..."
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
            }}
          />
          <Button
            variant="contained"
            onClick={handleSearch}
            sx={{ minWidth: 120 }}
          >
            Rechercher
          </Button>
          <IconButton
            onClick={handleRefresh}
            color="primary"
            sx={{ bgcolor: 'primary.light', color: 'white' }}
          >
            <RefreshIcon />
          </IconButton>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
      </Box>

      {weatherData && (
        <>
          {/* Météo actuelle */}
          <CurrentWeatherCard>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocationIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">
                    {weatherData.location.name}, {weatherData.location.country}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    src={`https:${weatherData.current.condition.icon}`}
                    sx={{ width: 80, height: 80, mr: 2 }}
                  />
                  <Box>
                    <Typography variant="h2" fontWeight="bold">
                      {Math.round(weatherData.current.temp_c)}°
                    </Typography>
                    <Typography variant="h6">
                      {weatherData.current.condition.text}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} md={8}>
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <HumidityIcon />
                      <Typography variant="body2">Humidité</Typography>
                      <Typography variant="h6">{weatherData.current.humidity}%</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <WindIcon />
                      <Typography variant="body2">Vent</Typography>
                      <Typography variant="h6">
                        {Math.round(weatherData.current.wind_kph)} km/h
                      </Typography>
                      <Typography variant="caption">
                        {getWindDirection(weatherData.current.wind_degree)}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <VisibilityIcon />
                      <Typography variant="body2">Visibilité</Typography>
                      <Typography variant="h6">{weatherData.current.vis_km} km</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <UvIcon />
                      <Typography variant="body2">Index UV</Typography>
                      <Typography variant="h6">{weatherData.current.uv}</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </CurrentWeatherCard>

          {/* Prévisions horaires aujourd'hui */}
          <WeatherCard sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📊 Prévisions horaires - Aujourd'hui
              </Typography>
              <HourlyWeatherBox>
                {weatherData.forecast.forecastday[0].hour
                  .filter((_, index) => index % 3 === 0) // Une heure sur 3
                  .map((hour, index) => {
                    const hourTime = new Date(hour.time).getHours();
                    return (
                      <Paper
                        key={index}
                        sx={{
                          minWidth: 100,
                          p: 2,
                          textAlign: 'center',
                          bgcolor: hourTime === new Date().getHours() ? 'primary.light' : 'background.paper',
                          color: hourTime === new Date().getHours() ? 'white' : 'inherit'
                        }}
                      >
                        <Typography variant="body2" fontWeight="bold">
                          {getMomentIcon(hourTime)} {hourTime}h
                        </Typography>
                        <Avatar
                          src={`https:${hour.condition.icon}`}
                          sx={{ width: 40, height: 40, mx: 'auto', my: 1 }}
                        />
                        <Typography variant="h6" fontWeight="bold">
                          {Math.round(hour.temp_c)}°
                        </Typography>
                        <Typography variant="caption">
                          {hour.chance_of_rain}% 🌧️
                        </Typography>
                      </Paper>
                    );
                  })}
              </HourlyWeatherBox>
            </CardContent>
          </WeatherCard>

          {/* Prévisions 7 jours */}
          <Grid container spacing={2}>
            {weatherData.forecast.forecastday.map((day, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <WeatherCard>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {getDayName(day.date)}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {new Date(day.date).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long'
                      })}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar
                        src={`https:${day.day.condition.icon}`}
                        sx={{ width: 50, height: 50, mr: 2 }}
                      />
                      <Box>
                        <Typography variant="h5" fontWeight="bold">
                          {Math.round(day.day.maxtemp_c)}°
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {Math.round(day.day.mintemp_c)}°
                        </Typography>
                      </Box>
                    </Box>

                    <Typography variant="body2" gutterBottom>
                      {day.day.condition.text}
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          🌧️ Pluie
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {day.day.daily_chance_of_rain}%
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          💨 Vent
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {Math.round(day.day.maxwind_kph)} km/h
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          💧 Humidité
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {day.day.avghumidity}%
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          ☀️ UV
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {day.day.uv}
                        </Typography>
                      </Grid>
                    </Grid>

                    {/* Lever/Coucher du soleil */}
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="caption" color="text.secondary">
                          🌅 Lever
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {day.astro.sunrise}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="caption" color="text.secondary">
                          🌇 Coucher
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {day.astro.sunset}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </WeatherCard>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Box>
  );
};

export default Weather;
