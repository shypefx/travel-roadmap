import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Alert,
  LinearProgress,
  Chip,
  Stack,
  Divider
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import { parseExcelFile, saveAllDataToLocalStorage } from '../utils/excelParser';

const ImportExcel = ({ onImportSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileUpload = async (file) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await parseExcelFile(file);
      
      // Sauvegarder en localStorage
      console.log('Parsed data:', result);
      const saved = saveAllDataToLocalStorage(result);
      
      if (saved) {
        const roadmapLength = result.roadmap?.length || 0;
        const shopLength = result.shops?.length || 0;
        const vinylLength = result.vinyl?.length || 0;

        setSuccess({
          message: `Import réussi ! ${roadmapLength} activités, ${shopLength} magasins, ${vinylLength} vinyles importés.`,
          totalRoadmap: roadmapLength,
          totalShops: shopLength,
          totalVinyl: vinylLength
        });
        
        // Appeler le callback avec les données
        if (onImportSuccess) {
          onImportSuccess(result);
        }
      } else {
        setError('Données importées mais erreur lors de la sauvegarde');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
    // Reset input
    event.target.value = '';
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragOver(false);
    
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          border: '2px dashed',
          borderColor: dragOver ? 'primary.main' : 'grey.300',
          backgroundColor: dragOver ? 'primary.50' : 'transparent',
          transition: 'all 0.2s ease',
          textAlign: 'center'
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CloudUploadIcon 
          sx={{ 
            fontSize: 48, 
            color: 'primary.main', 
            mb: 2,
            opacity: dragOver ? 0.8 : 1
          }} 
        />
        
        <Typography variant="h6" gutterBottom>
          Importer votre planning de voyage
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Glissez-déposez votre fichier Excel/CSV ou cliquez pour sélectionner
        </Typography>

        <input
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
          id="file-upload"
        />
        
        <label htmlFor="file-upload">
          <Button
            variant="contained"
            component="span"
            startIcon={<CloudUploadIcon />}
            size="large"
            disabled={loading}
            sx={{
              borderRadius: 2,
              px: 4,
              py: 1.5,
              textTransform: 'none',
              fontSize: '1rem'
            }}
          >
            Sélectionner un fichier
          </Button>
        </label>

        {loading && (
          <Box sx={{ mt: 2 }}>
            <LinearProgress sx={{ borderRadius: 1 }} />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Traitement en cours...
            </Typography>
          </Box>
        )}
      </Paper>

      {error && (
        <Alert 
          severity="error" 
          icon={<ErrorIcon />}
          sx={{ mt: 2, borderRadius: 2 }}
        >
          {error}
        </Alert>
      )}

      {success && (
        <Alert 
          severity="success" 
          icon={<CheckCircleIcon />}
          sx={{ mt: 2, borderRadius: 2 }}
        >
          <Typography variant="body2" sx={{ mb: 2 }}>
            {success.message}
          </Typography>
          
          <Divider sx={{ my: 1 }} />
          
          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1 }}>
          </Stack>
          
          {success.detectedColumns && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Colonnes détectées :
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 0.5 }}>
                {Object.entries(success.detectedColumns).map(([key, value]) => (
                  <Chip 
                    key={key}
                    label={`${key}: ${value}`} 
                    size="small" 
                    variant="outlined"
                  />
                ))}
              </Stack>
            </Box>
          )}
        </Alert>
      )}

      <Paper sx={{ mt: 2, p: 2, backgroundColor: 'grey.50' }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          <strong>Format attendu :</strong>
        </Typography>
        <Typography variant="caption" color="text.secondary">
          • Jour/Date | Heure | Activité | Lieu | Adresse
          <br />
          • Les noms de colonnes sont détectés automatiquement
          <br />
          • Formats supportés : .xlsx, .xls, .csv
        </Typography>
      </Paper>
    </Box>
  );
};

export default ImportExcel;
