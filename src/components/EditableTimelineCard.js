import React, { useState } from 'react';
import {
  Avatar,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  IconButton,
  Stack,
  Select,
  MenuItem,
  FormControl,
  Tooltip
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  Launch as LaunchIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Check as CheckIcon,
  Cancel as CancelIcon,
  Today as TodayIcon
} from '@mui/icons-material';

const EditableTimelineCard = ({ 
  event, 
  onUpdate,
  onDeleteEvent,
  dayIndex,
  eventIndex,
  showDelete = false ,
  weather
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedStatus, setEditedStatus] = useState(event.statut || '');

  const statusOptions = [
    { value: 'À faire', label: 'À faire', color: 'warning' },
    { value: 'En cours', label: 'En cours', color: 'info' },
    { value: 'Terminé', label: 'Terminé', color: 'success' },
  ];

  const handleMapsClick = () => {
    if (event.mapsUrl) {
      window.open(event.mapsUrl, '_blank');
    } else if (event.address) {
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.address)}`;
      window.open(mapsUrl, '_blank');
    }
  };

  const handleDelete = () => {
    if (onDeleteEvent) {
      onDeleteEvent(dayIndex, eventIndex);
    }
  };

  const handleSaveStatus = () => {
    const updatedEvent = { ...event, statut: editedStatus };
    onUpdate(updatedEvent);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedStatus(event.statut || '');
    setIsEditing(false);
  };

  const getStatusColor = (status) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option ? option.color : 'default';
  };

  const getColorByTime = (time) => {
    const lowerTime = String(time).toLowerCase();

    if (lowerTime.includes('arrivée')) return '#c27673ff'; 
    if (lowerTime.includes('matin')) return '#e2c854ff';       // jaune clair
    if (lowerTime.includes('midi')) return '#9ef068ff';        // orange clair
    if (lowerTime.includes('aprem') || lowerTime.includes('après')) return '#6eb9dbff'; // bleu clair
    if (lowerTime.includes('soir')) return '#3f3dccff';        // violet clair
    if (lowerTime.includes('nuit')) return '#c46efdff';        // gris bleuté

    return '#FFFFFF'; // par défaut
};

const getShadowColorForStatus = (status) => {
  const colorMap = {
    warning: 'rgba(255, 152, 0, 0.5)',     // orange
    info: 'rgba(33, 150, 243, 0.5)',       // bleu
    success: 'rgba(76, 175, 80, 0.5)',     // vert
    error: 'rgba(244, 67, 54, 0.5)',       // rouge
    secondary: 'rgba(156, 39, 176, 0.5)',  // violet
    default: 'rgba(158, 158, 158, 0.5)'    // gris
  };

  const option = statusOptions.find(opt => opt.value === status);
  return colorMap[option?.color || 'default'];
};


const getDayName = (dateString) => {
  if (!dateString) return 'Pas de date';
  
  // Parse le format DD/MM/YYYY
  const parts = dateString.split('/');
  if (parts.length !== 3) return 'Format incorrect';
  
  const [day, month, year] = parts;
  
  // Crée la date (mois - 1 car les mois commencent à 0 en JavaScript)
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  
  // Vérifie si c'est une date valide
  if (isNaN(date.getTime())) return 'Date invalide';
  
  const dayName = date.toLocaleDateString('fr-FR', { weekday: 'long' });
  return dayName.charAt(0).toUpperCase() + dayName.slice(1);
};

const isCompleted = event.statut === 'Terminé';




  return (
    <Card
      sx={{
        mb: 2,
        borderRadius: 3,
        boxShadow: `0 0 8px ${getShadowColorForStatus(event.statut)}`,
        border: '1px solid rgba(0,0,0,0.06)',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
          transform: 'translateY(-2px)'
        },
        opacity: isCompleted ? 0.6 : 1, // 🔹 Grisé si terminé
        filter: isCompleted ? 'grayscale(0.5)' : 'none',
        '&:hover': {
          boxShadow: `0 0 20px ${getShadowColorForStatus(event.statut)}`,
          transform: 'translateY(-2px)'
    }
      }}
    >
        <Box sx={{ height: 30, backgroundColor: getColorByTime(event.time) }} />

      <CardContent sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TodayIcon sx={{ fontSize: 20, color: 'primary.dark' }} />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: 'primary.dark',
                fontSize: '1.1rem'
              }}
            >
              {event.date}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: 'primary.dark',
                fontSize: '1.1rem'
              }}
            >
              - {getDayName(event.date + "")}
            </Typography>
          </Box>
          
          {showDelete && (
            <IconButton
              onClick={handleDelete}
              size="small"
              sx={{ color: 'error.main' }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ScheduleIcon sx={{ fontSize: 20, color: 'primary.main' }} />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: 'primary.main',
                fontSize: '1.1rem'
              }}
            >
              {event.time}
            </Typography>
          </Box>
          
          {showDelete && (
            <IconButton
              onClick={handleDelete}
              size="small"
              sx={{ color: 'error.main' }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </Box>

        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            mb: 2,
            color: 'text.primary',
            fontSize: '1.2rem',
            lineHeight: 1.3
          }}
        >
          {event.activity}
        </Typography>

   {event.place && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            pl: 0,
          }}
        >
          {/* 📍 Item 1 - Lieu */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LocationIcon sx={{ fontSize: 18, color: 'text.secondary', mr: 1 }} />
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                fontSize: '0.95rem',
                lineHeight: 1.4
              }}
            >
              {event.place}
            </Typography>
          </Box>

          {/* 🌤️ Item 2 - Météo */}
          {weather && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar
                src={`https:${weather.icon}`}
                alt={weather.condition}
                sx={{ width: 40, height: 40 }}
              />
              <Box>
                <Typography variant="body2" fontWeight="bold">
                  {weather.avgTemp}°C
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {weather.minTemp}° - {weather.maxTemp}°
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      )}




{/* 🌤️ Affichage météo */}
          


        {/* Informations supplémentaires avec statut éditable */}
        <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
          {event.pass && event.pass !== '-' }
          
          {/* Statut éditable */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {isEditing ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <Select
                    value={editedStatus}
                    onChange={(e) => setEditedStatus(e.target.value)}
                    sx={{ borderRadius: 2 }}
                  >
                    {statusOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Tooltip title="Sauvegarder">
                  <IconButton
                    onClick={handleSaveStatus}
                    size="small"
                    color="success"
                    sx={{
                      backgroundColor: 'rgba(76, 175, 80, 0.1)',
                      '&:hover': { backgroundColor: 'rgba(76, 175, 80, 0.2)' }
                    }}
                  >
                    <CheckIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Annuler">
                  <IconButton
                    onClick={handleCancelEdit}
                    size="small"
                    color="error"
                    sx={{
                      backgroundColor: 'rgba(244, 67, 54, 0.1)',
                      '&:hover': { backgroundColor: 'rgba(244, 67, 54, 0.2)' }
                    }}
                  >
                    <CancelIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {event.statut && event.statut !== '-' && (
                  <Chip
                    label={event.statut}
                    size="small"
                    color={getStatusColor(event.statut)}
                    variant="outlined"
                    sx={{ borderRadius: 2 }}
                  />
                )}
                <Tooltip title="Modifier le statut">
                  <IconButton
                    onClick={() => setIsEditing(true)}
                    size="small"
                    color="primary"
                    sx={{
                      backgroundColor: 'rgba(25, 118, 210, 0.1)',
                      '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.2)' }
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
          </Box>
        </Stack>

        {event.remarque && event.remarque !== '-' && (
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              fontStyle: 'italic',
              mb: 2,
              p: 1,
              backgroundColor: 'grey.50',
              borderRadius: 1,
              fontSize: '0.9rem'
            }}
          >
            💡 {event.remarque}
          </Typography>
        )}

        {(event.address && event.address !== '-') && (
          <Button
            variant="outlined"
            startIcon={<LaunchIcon />}
            onClick={handleMapsClick}
            fullWidth
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 500,
              py: 1.5
            }}
          >
            Ouvrir dans Google Maps
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default EditableTimelineCard;
