// TravelRoadmap.js - VERSION COMPLÈTE CORRIGÉE
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Alert,
  Snackbar,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Card,
  CardContent,
  Chip,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon
} from '@mui/material';
import {
  Upload as UploadIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  Settings as SettingsIcon,
  Assessment as StatsIcon,
  Add as AddIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
  Share as ShareIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Imports des composants
import EditableTimelineCard from './EditableTimelineCard';
import ImportExcel from './ImportExcel';
import ShopsList from './ShopsList';
import VinylShops from './VinylShops';
import WeatherSummary from './WeatherSummary';

// Imports des fonctions utilitaires
import {
  saveAllDataToLocalStorage,
  loadAllDataFromLocalStorage,
  exportDataToJSON,
  importDataFromJSON,
  clearAllData,
  getDataStats
} from '../utils/excelParser';

// Styles personnalisés
const StyledTabs = styled(Tabs)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[1],
  '& .MuiTab-root': {
    minHeight: 60,
    fontSize: '1rem',
    fontWeight: 500,
  },
}));

const StatsCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: 'white',
  '& .MuiCardContent-root': {
    padding: theme.spacing(2),
  },
}));

const TravelRoadmap = ({ importedData, onRefresh, onDataUpdate }) => {
  // États principaux
  const [allData, setAllData] = useState({
    roadmap: [],
    shops: [],
    vinyl: []
  });
  
  const [currentTab, setCurrentTab] = useState(0);
  const [lastSaved, setLastSaved] = useState(null);
  const [stats, setStats] = useState({
    roadmap: { total: 0, completed: 0 },
    shops: { total: 0, visited: 0 },
    vinyl: { total: 0, visited: 0 }
  });
  const [weatherByDate, setWeatherByDate] = useState({});


  // États pour les dialogs
  const [speedDialOpen, setSpeedDialOpen] = useState(false);
  const [statsDialog, setStatsDialog] = useState(false);
  const [importDialog, setImportDialog] = useState(false);
  const [settingsDialog, setSettingsDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  // Chargement des données
useEffect(() => {
  const loadData = async () => {
    try {
      const data = loadAllDataFromLocalStorage();
      if (data) {
        setAllData(data);
        setStats(getDataStats(data));
      }

      const city = localStorage.getItem('travelCity') || 'New York';

      // 🔧 Fetch météo avec 14 jours de prévisions + données horaires
      const res = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=f5dafd6e9a4d40fb983140900252107&q=${encodeURIComponent(city)}&days=14&aqi=no&alerts=no`);
      
      if (!res.ok) {
        throw new Error(`API Error: ${res.status}`);
      }
      
      const weatherJson = await res.json();
      console.log('📊 Données météo complètes:', weatherJson); // Pour debug

      if (weatherJson && weatherJson.forecast?.forecastday) {
        const byDate = {};
        
        weatherJson.forecast.forecastday.forEach(day => {
          // Format de la date API: "2025-01-27" → besoin de convertir pour matcher vos événements
          const apiDate = day.date; // "2025-01-27"
          
          // Conversion vers le format de vos événements DD/MM/YYYY
          const [year, month, dayNum] = apiDate.split('-');
          const eventDateFormat = `${dayNum}/${month}/${year}`; // "27/01/2025"
          
          // 🆕 Extraction des données horaires par moment de la journée
          const hourlyData = day.hour || [];
          const weatherByTime = {
            matin: hourlyData.find(h => new Date(h.time).getHours() === 9) || 
                   hourlyData.find(h => new Date(h.time).getHours() === 10),
            midi: hourlyData.find(h => new Date(h.time).getHours() === 12),
            aprem: hourlyData.find(h => new Date(h.time).getHours() === 16),
            soir: hourlyData.find(h => new Date(h.time).getHours() === 21)
          };
          
          // Stockage avec les deux formats pour plus de flexibilité
          const weatherData = {
            // 📊 Données générales (existantes)
            icon: day.day.condition.icon,
            condition: day.day.condition.text,
            avgTemp: Math.round(day.day.avgtemp_c),
            maxTemp: Math.round(day.day.maxtemp_c),
            minTemp: Math.round(day.day.mintemp_c),
            chanceOfRain: day.day.daily_chance_of_rain,
            humidity: day.day.avghumidity,
            windKph: Math.round(day.day.maxwind_kph),
            uv: day.day.uv,
            
            // 🆕 Données par moment de la journée
            weatherByTime: weatherByTime
          };
          
          // Stockage avec le format API (YYYY-MM-DD)
          byDate[apiDate] = weatherData;
          
          // Stockage avec le format de vos événements (DD/MM/YYYY)
          byDate[eventDateFormat] = weatherData;
        });
        
        console.log('🗓️ Données météo par date:', byDate); // Pour debug
        setWeatherByDate(byDate);
      } else {
        console.warn('⚠️ Aucune donnée météo trouvée');
      }
    } catch (err) {
      console.error('❌ Erreur météo:', err);
    }
  };

  loadData();
}, []);




  // Mise à jour avec les données importées
  useEffect(() => {
    if (importedData && Array.isArray(importedData) && importedData.length > 0) {
      console.log('📥 TravelRoadmap - Données importées reçues:', importedData);
      
      const newData = {
        roadmap: importedData,
        shops: allData.shops || [],
        vinyl: allData.vinyl || []
      };
      
      setAllData(newData);
      setStats(getDataStats(newData));
      
      // Notifier le parent
      if (onDataUpdate) {
        onDataUpdate(newData);
      }
    }
  }, [importedData]);

  // Gestionnaires d'événements
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleUpdateRoadmap = (updatedItem) => {
    const updatedRoadmap = allData.roadmap.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    );
    
    const newData = {
      ...allData,
      roadmap: updatedRoadmap
    };
    
    setAllData(newData);
    setStats(getDataStats(newData));
    saveAllDataToLocalStorage(newData);
    
    if (onDataUpdate) {
      onDataUpdate(newData);
    }
  };

  const handleUpdateShop = (updatedShop) => {
    const updatedShops = allData.shops.map(shop => 
      shop.id === updatedShop.id ? updatedShop : shop
    );
    
    const newData = {
      ...allData,
      shops: updatedShops
    };
    
    setAllData(newData);
    setStats(getDataStats(newData));
    saveAllDataToLocalStorage(newData);
  };

  const handleUpdateVinylShop = (updatedVinylShop) => {
    const updatedVinyl = allData.vinyl.map(vinyl => 
      vinyl.id === updatedVinylShop.id ? updatedVinylShop : vinyl
    );
    
    const newData = {
      ...allData,
      vinyl: updatedVinyl
    };
    
    setAllData(newData);
    setStats(getDataStats(newData));
    saveAllDataToLocalStorage(newData);
  };

  const handleExport = () => {
    try {
      exportDataToJSON(allData);
      showSnackbar('Données exportées avec succès!', 'success');
    } catch (error) {
      showSnackbar('Erreur lors de l\'export', 'error');
    }
  };

  const handleClearData = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer toutes les données ?')) {
      clearAllData();
      setAllData({ roadmap: [], shops: [], vinyl: [] });
      setStats({ roadmap: { total: 0, completed: 0 }, shops: { total: 0, visited: 0 }, vinyl: { total: 0, visited: 0 } });
      showSnackbar('Toutes les données ont été supprimées', 'info');
      
      if (onRefresh) {
        onRefresh();
      }
    }
  };

const handleFileUpload = (importedData) => {
  console.log('📥 Données importées:', importedData);

  const newData = {
    roadmap: importedData.roadmap || [],
    shops: importedData.shops || [],
    vinyl: importedData.vinyl || []
  };

  setAllData(newData);
  setLastSaved(new Date().toISOString());
  showSnackbar('Données importées avec succès!', 'success');
};


  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

// Ajoutez cette fonction dans votre composant
const getWeatherForEvent = (eventDate) => {
  if (!weatherByDate || !eventDate) return null;
  
  // Essaie d'abord avec le format direct
  let weather = weatherByDate[eventDate];
  
  // Si pas trouvé, essaie de convertir le format
  if (!weather) {
    // Si eventDate est au format DD/MM/YYYY, convertir vers YYYY-MM-DD
    if (eventDate.includes('/')) {
      const [day, month, year] = eventDate.split('/');
      const apiFormat = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      weather = weatherByDate[apiFormat];
    }
  }
  
  return weather;
};

// 🕘 Fonction pour déterminer le moment selon l'heure de l'événement
const getMomentFromTime = (eventTime) => {
  if (!eventTime) return 'midi'; // Par défaut
  
  const hour = parseInt(eventTime.split(':')[0]);
  
  if (hour >= 6 && hour < 11) return 'matin';
  if (hour >= 11 && hour < 14) return 'midi';
  if (hour >= 14 && hour < 19) return 'aprem';
  return 'soir';
};

// 🎯 Fonction pour obtenir l'icône du moment
const getMomentIcon = (moment) => {
  const icons = {
    matin: '🌅',
    midi: '☀️',
    aprem: '🌤️',
    soir: '🌙'
  };
  return icons[moment] || '☀️';
};



  // Actions du Speed Dial
  const speedDialActions = [
    {
      name: 'Importer',
      icon: <UploadIcon />,
      onClick: () => setImportDialog(true)
    },
    {
      name: 'Exporter',
      icon: <DownloadIcon />,
      onClick: handleExport
    },
    {
      name: 'Statistiques',
      icon: <StatsIcon />,
      onClick: () => setStatsDialog(true)
    },
    {
      name: 'Actualiser',
      icon: <RefreshIcon />,
      onClick: onRefresh
    },
    {
      name: 'Effacer',
      icon: <DeleteIcon />,
      onClick: handleClearData
    },
    {
      name: 'Paramètres',
      icon: <SettingsIcon />,
      onClick: () => setSettingsDialog(true)
    }
  ];

  // RETURN PRINCIPAL - UN SEUL RETURN
  return (
    <Box sx={{ width: '100%', minHeight: '100vh' }}>
      <WeatherSummary city={localStorage.getItem('travelCity')} />
      {/* Onglets */}
      <StyledTabs
        value={currentTab}
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{ mb: 3 }}
      >
        <Tab 
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              📅 Planning
              {stats && stats.roadmap.total > 0 && (
                <Chip 
                  label={stats.roadmap.total} 
                  size="small" 
                  color="primary"
                />
              )}
            </Box>
          }
        />
        <Tab 
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              🏪 Magasins
              {stats && stats.shops.total > 0 && (
                <Chip 
                  label={stats.shops.total} 
                  size="small" 
                  color="primary"
                />
              )}
            </Box>
          }
        />
        <Tab 
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              🎵 Vinyles
              {stats && stats.vinyl.total > 0 && (
                <Chip 
                  label={stats.vinyl.total} 
                  size="small" 
                  color="primary"
                />
              )}
            </Box>
          }
        />
      </StyledTabs>
      
{/* Contenu des onglets */}
{currentTab === 0 && (
  <Box>
    {allData.roadmap && allData.roadmap.length > 0 ? (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {allData.roadmap.map((item, index) => {
          const dateFR = item.date; // ex: "21/07/2025"
          
          // 🔄 Conversion vers le format ISO pour l'API météo
          const [day, month, year] = dateFR.split('/');
          const isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`; // "2025-07-21"
          
          // 📊 Récupération de la météo (essaie les deux formats)
          const weather = weatherByDate[isoDate] || weatherByDate[dateFR];
          
          // 🐛 Debug pour vérifier la correspondance
          console.log(`🗓️ Date événement: ${dateFR} → ISO: ${isoDate}`, weather ? '✅ Météo trouvée' : '❌ Pas de météo');

          return (
            <Box key={item.id || index}>
              <EditableTimelineCard
                event={item}
                onUpdate={handleUpdateRoadmap}
                weather={weather}
              />
            </Box>
          );
        })}
      </Box>
    ) : (
            <Paper elevation={1} sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                📅 Aucun planning importé
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Importez un fichier Excel ou CSV pour voir votre planning
              </Typography>
            </Paper>
          )}
        </Box>
      )}
      
      {currentTab === 1 && (
        <ShopsList 
          shops={allData.shops} 
          onUpdateShop={handleUpdateShop}
          title="🏪 Magasins à visiter"
        />
      )}
      
      {currentTab === 2 && (
        <VinylShops 
          shops={allData.vinyl} 
          onUpdateShop={handleUpdateVinylShop}
        />
      )}
      
      {/* Speed Dial */}
      <SpeedDial
        ariaLabel="Actions rapides"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
        open={speedDialOpen}
        onClose={() => setSpeedDialOpen(false)}
        onOpen={() => setSpeedDialOpen(true)}
      >
        {speedDialActions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={() => {
              action.onClick();
              setSpeedDialOpen(false);
            }}
          />
        ))}
      </SpeedDial>
      
      {/* Dialog des statistiques */}
      <Dialog
        open={statsDialog}
        onClose={() => setStatsDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>📊 Statistiques</DialogTitle>
        <DialogContent>
          {stats && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <StatsCard>
                  <CardContent>
                    <Typography variant="h6">📅 Planning</Typography>
                    <Typography variant="h4">{stats.roadmap.total}</Typography>
                    <Typography variant="body2">
                      ✅ {stats.roadmap.completed} terminées
                    </Typography>
                  </CardContent>
                </StatsCard>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <StatsCard>
                  <CardContent>
                    <Typography variant="h6">🏪 Magasins</Typography>
                    <Typography variant="h4">{stats.shops.total}</Typography>
                    <Typography variant="body2">
                      ⭐ {stats.shops.visited} visités
                    </Typography>
                  </CardContent>
                </StatsCard>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <StatsCard>
                  <CardContent>
                    <Typography variant="h6">🎵 Vinyles</Typography>
                    <Typography variant="h4">{stats.vinyl.total}</Typography>
                    <Typography variant="body2">
                      🎯 {stats.vinyl.visited} visités
                    </Typography>
                  </CardContent>
                </StatsCard>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatsDialog(false)}>Fermer</Button>
        </DialogActions>
      </Dialog>
      
      {/* Dialog d'import */}
      <Dialog
        open={importDialog}
        onClose={() => setImportDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>📥 Importer des données</DialogTitle>
        <DialogContent>
          <ImportExcel onImportSuccess={handleFileUpload} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImportDialog(false)}>Annuler</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog des paramètres */}
      <Dialog 
        open={settingsDialog} 
        onClose={() => setSettingsDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>⚙️ Paramètres</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Nom du voyage"
            margin="normal"
            variant="outlined"
            defaultValue="Mon voyage"
          />
          <TextField
            fullWidth
            label="Description"
            margin="normal"
            variant="outlined"
            multiline
            rows={3}
            defaultValue="Description de mon voyage"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsDialog(false)}>Annuler</Button>
          <Button onClick={() => setSettingsDialog(false)} variant="contained">
            Sauvegarder
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar pour les notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TravelRoadmap;
