import React, { useState } from 'react';
import {
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
  Cancel as CancelIcon
} from '@mui/icons-material';

const EditableTimelineCard = ({ 
  event, 
  onUpdate,
  onDeleteEvent,
  dayIndex,
  eventIndex,
  showDelete = false 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedStatus, setEditedStatus] = useState(event.statut || '');

  const statusOptions = [
    { value: 'À faire', label: 'À faire', color: 'warning' },
    { value: 'En cours', label: 'En cours', color: 'info' },
    { value: 'Terminé', label: 'Terminé', color: 'success' },
    { value: 'Annulé', label: 'Annulé', color: 'error' },
    { value: 'Reporté', label: 'Reporté', color: 'secondary' },
    { value: '-', label: 'Aucun', color: 'default' }
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

    if (lowerTime.includes('matin')) return '#FFF9C4';       // jaune clair
    if (lowerTime.includes('midi')) return '#9ef068ff';        // orange clair
    if (lowerTime.includes('aprem') || lowerTime.includes('après')) return '#6eb9dbff'; // bleu clair
    if (lowerTime.includes('soir')) return '#3f3dccff';        // violet clair
    if (lowerTime.includes('nuit')) return '#c46efdff';        // gris bleuté

    return '#FFFFFF'; // par défaut
};


  return (
    <Card
      sx={{
        mb: 2,
        borderRadius: 3,
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        border: '1px solid rgba(0,0,0,0.06)',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
          transform: 'translateY(-2px)'
        }
      }}
    >
        <Box sx={{ height: 30, backgroundColor: getColorByTime(event.time) }} />

      <CardContent sx={{ p: 3 }}>
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
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 2 }}>
            <LocationIcon sx={{ fontSize: 18, color: 'text.secondary', mt: 0.2 }} />
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
        )}

        {/* Informations supplémentaires avec statut éditable */}
        <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
          {event.pass && event.pass !== '-' && (
            <Chip
              label={event.pass}
              size="small"
              color="success"
              sx={{ borderRadius: 2 }}
            />
          )}
          
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
