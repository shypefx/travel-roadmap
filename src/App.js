// App.js - VERSION SIMPLIFIÉE
import React, { useState, useEffect } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Box,
  Typography,
  Paper
} from '@mui/material';
import Header from './components/Header';
import TravelRoadmap from './components/TravelRoadmap';
import BudgetTracker from './components/BudgetTracker';
import Weather from './components/Weather';

// Thème personnalisé
const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
      light: '#9bb5ff',
      dark: '#3d5af1',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#764ba2',
      light: '#a777d3',
      dark: '#4a1973',
      contrastText: '#ffffff'
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff'
    }
  },
  typography: {
    fontFamily: '"Poppins", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 12
  }
});

// Composant temporaire pour les autres pages
const ComingSoon = ({ title, description }) => (
  <Paper 
    elevation={1} 
    sx={{ 
      p: 6, 
      textAlign: 'center',
      background: 'linear-gradient(135deg, #667eea20 0%, #764ba220 100%)'
    }}
  >
    <Typography variant="h4" gutterBottom>
      🚧 {title}
    </Typography>
    <Typography variant="body1" color="text.secondary">
      {description}
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
      Cette fonctionnalité sera disponible bientôt !
    </Typography>
  </Paper>
);

function App() {
  const [currentPage, setCurrentPage] = useState('roadmap');

  const handlePageChange = (pageId) => {
    console.log('📄 Changement de page:', pageId);
    setCurrentPage(pageId);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'roadmap':
        return <TravelRoadmap />;
      
      case 'budget':
        return (
          <BudgetTracker />
        );

      case 'weather':
        return (
          <Weather 
            title="Weather" 
            description="Trouvez les meilleurs disquaires de votre destination"
          />
        );
      
      case 'shops':
        return (
          <ComingSoon 
            title="Magasins" 
            description="Gérez votre liste de magasins à visiter"
          />
        );
      
      case 'vinyl':
        return (
          <ComingSoon 
            title="Disquaires" 
            description="Trouvez les meilleurs disquaires de votre destination"
          />
        );
      
      default:
        return <TravelRoadmap />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: 'background.default'
        }}
      >
        <Header 
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
        
        <Container 
          maxWidth="md" 
          sx={{ 
            py: { xs: 3, sm: 4 },
            px: { xs: 2, sm: 3 }
          }}
        >
          {renderCurrentPage()}
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
