// src/components/Header.js - VERSION SIMPLIFIÉE
import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Container,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Map as MapIcon,
  Menu as MenuIcon,
  TravelExplore,
  AccountBalanceWallet,
  Store,
  LibraryMusic
} from '@mui/icons-material';

const Header = ({ currentPage, onPageChange }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const pages = [
    {
      id: 'roadmap',
      label: 'Roadmap',
      icon: <TravelExplore />,
      description: 'Planning de voyage'
    },
    {
      id: 'budget',
      label: 'Budget Tracker',
      icon: <AccountBalanceWallet />,
      description: 'Gestion du budget'
    },
    {
      id: 'shops',
      label: 'Magasins',
      icon: <Store />,
      description: 'Liste des magasins'
    },
    {
      id: 'vinyl',
      label: 'Disquaires',
      icon: <LibraryMusic />,
      description: 'Magasins de vinyles'
    }
  ];

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handlePageSelect = (pageId) => {
    onPageChange(pageId);
    handleMenuClose();
  };

  const currentPageData = pages.find(page => page.id === currentPage) || pages[0];

  return (
    <>
      <AppBar 
        position="static" 
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar 
            sx={{ 
              justifyContent: 'space-between',
              py: 2,
              px: { xs: 2, sm: 3 }
            }}
          >
            {/* Logo et titre */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <MapIcon sx={{ fontSize: 32, color: 'white' }} />
              <Box>
                <Typography
                  variant="h5"
                  component="h1"
                  sx={{
                    fontWeight: 700,
                    color: 'white',
                    letterSpacing: '-0.5px'
                  }}
                >
                  TravelPlan
                </Typography>
                {!isMobile && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'rgba(255,255,255,0.8)',
                      fontSize: '0.875rem',
                      fontWeight: 400
                    }}
                  >
                    {currentPageData.description}
                  </Typography>
                )}
              </Box>
            </Box>

            {/* Page actuelle + Menu */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Page actuelle */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {currentPageData.icon}
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: 'white',
                    fontWeight: 500,
                    display: { xs: 'none', sm: 'block' }
                  }}
                >
                  {currentPageData.label}
                </Typography>
              </Box>

              {/* Menu Button */}
              <IconButton
                size="large"
                edge="end"
                onClick={handleMenuOpen}
                sx={{
                  color: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.2)',
                  }
                }}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Menu déroulant */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 8,
          sx: {
            mt: 1.5,
            minWidth: 250,
            borderRadius: 2,
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 20,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {pages.map((page) => (
          <MenuItem
            key={page.id}
            onClick={() => handlePageSelect(page.id)}
            selected={page.id === currentPage}
            sx={{
              py: 1.5,
              px: 2,
              '&.Mui-selected': {
                backgroundColor: 'primary.light',
                color: 'primary.contrastText',
                '&:hover': {
                  backgroundColor: 'primary.main',
                }
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
              {page.icon}
              <Box>
                <Typography variant="body1" fontWeight={500}>
                  {page.label}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {page.description}
                </Typography>
              </Box>
            </Box>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default Header;
