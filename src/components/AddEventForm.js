import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Stack,
  Alert
} from '@mui/material';
import { generateMapsUrl } from '../utils/excelParser';

const AddEventForm = ({ open, onClose, onAdd, dayData }) => {
  const [formData, setFormData] = useState({
    time: '',
    activity: '',
    place: '',
    address: ''
  });
  const [error, setError] = useState('');

  const handleChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    setError('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    if (!formData.activity.trim()) {
      setError('L\'activité est obligatoire');
      return;
    }
    
    if (!formData.time.trim()) {
      setError('L\'heure est obligatoire');
      return;
    }

    const newEvent = {
      time: formData.time,
      activity: formData.activity.trim(),
      place: formData.place.trim(),
      address: formData.address.trim(),
      mapsUrl: generateMapsUrl(formData.address.trim() || formData.place.trim())
    };

    onAdd(newEvent);
    
    // Reset form
    setFormData({
      time: '',
      activity: '',
      place: '',
      address: ''
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          mx: 2
        }
      }}
    >
      <DialogTitle>
        <Typography variant="h6" fontWeight={600}>
          Ajouter un événement
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {formatDate(dayData.day)}
        </Typography>
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pb: 1 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              {error}
            </Alert>
          )}
          
          <Stack spacing={3}>
            <TextField
              label="Heure"
              type="time"
              value={formData.time}
              onChange={handleChange('time')}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              required
            />
            
            <TextField
              label="Activité"
              value={formData.activity}
              onChange={handleChange('activity')}
              fullWidth
              required
              multiline
              rows={2}
              placeholder="Ex: Visite du Louvre, Déjeuner au restaurant..."
            />
            
            <TextField
              label="Lieu"
              value={formData.place}
              onChange={handleChange('place')}
              fullWidth
              placeholder="Ex: Musée du Louvre, Restaurant Le Comptoir..."
            />
            
            <TextField
              label="Adresse"
              value={formData.address}
              onChange={handleChange('address')}
              fullWidth
              multiline
              rows={2}
              placeholder="Ex: Rue de Rivoli, 75001 Paris"
            />
          </Stack>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button 
            onClick={onClose}
            variant="outlined"
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              px: 3
            }}
          >
            Annuler
          </Button>
          <Button 
            type="submit"
            variant="contained"
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              px: 3
            }}
          >
            Ajouter
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddEventForm;
