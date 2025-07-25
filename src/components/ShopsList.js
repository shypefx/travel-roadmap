// ShopsList.js
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from '@mui/material';
import {
  Store as StoreIcon,
  LocationOn as LocationIcon,
  Launch as LaunchIcon,
  Search as SearchIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Check as CheckIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

const ShopsList = ({ shops, onUpdateShop, title = "🏪 Magasins" }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredShops = shops.filter(shop => {
    const matchesSearch = shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shop.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || 
                         (filter === 'visited' && shop.visited) ||
                         (filter === 'favorites' && shop.favorite) ||
                         (filter === 'todo' && !shop.visited);
    
    const matchesCategory = categoryFilter === 'all' || shop.category === categoryFilter;
    
    return matchesSearch && matchesFilter && matchesCategory;
  });

  const categories = [...new Set(shops.map(shop => shop.category))];
  const stats = {
    total: shops.length,
    visited: shops.filter(s => s.visited).length,
    favorites: shops.filter(s => s.favorite).length
  };

  const handleMapsClick = (shop) => {
    if (shop.mapsUrl) {
      window.open(shop.mapsUrl, '_blank');
    }
  };

  const handleToggleVisited = (shop) => {
    onUpdateShop({ ...shop, visited: !shop.visited });
  };

  const handleToggleFavorite = (shop) => {
    onUpdateShop({ ...shop, favorite: !shop.favorite });
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" component="h2">
            {title}
          </Typography>
          <Box display="flex" gap={1}>
            <Chip label={`Total: ${stats.total}`} variant="outlined" />
            <Chip label={`Visités: ${stats.visited}`} color="success" variant="outlined" />
            <Chip label={`Favoris: ${stats.favorites}`} color="warning" variant="outlined" />
          </Box>
        </Box>

        {/* Filtres et recherche */}
        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Statut</InputLabel>
              <Select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                label="Statut"
              >
                <MenuItem value="all">Tous</MenuItem>
                <MenuItem value="todo">À visiter</MenuItem>
                <MenuItem value="visited">Visités</MenuItem>
                <MenuItem value="favorites">Favoris</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Catégorie</InputLabel>
              <Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                label="Catégorie"
              >
                <MenuItem value="all">Toutes</MenuItem>
                {categories.map(category => (
                  <MenuItem key={category} value={category}>{category}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Liste des magasins */}
        <List>
          {filteredShops.map((shop) => (
            <ListItem
              key={shop.id}
              sx={{
                border: '1px solid #e0e0e0',
                borderRadius: 2,
                mb: 2,
                backgroundColor: shop.visited ? '#e8f5e8' : 'white',
                '&:hover': { backgroundColor: '#f5f5f5' }
              }}
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: shop.visited ? 'success.main' : 'primary.main' }}>
                  <StoreIcon />
                </Avatar>
              </ListItemAvatar>
              
              <ListItemText
                primary={
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="h6" component="span">
                      {shop.name}
                    </Typography>
                    {shop.favorite && <StarIcon color="warning" />}
                    {shop.visited && <CheckCircleIcon color="success" />}
                  </Box>
                }
                secondary={
                  <Box>
                    {shop.address && (
                      <Typography variant="body2" color="text.secondary" display="flex" alignItems="center" gap={0.5}>
                        <LocationIcon fontSize="small" />
                        {shop.address}
                      </Typography>
                    )}

                  </Box>
                }
              />
              
              <Box display="flex" flexDirection="column" gap={1}>
                <Tooltip title={shop.visited ? "Marquer comme non visité" : "Marquer comme visité"}>
                  <IconButton
                    onClick={() => handleToggleVisited(shop)}
                    color={shop.visited ? "success" : "default"}
                  >
                    <CheckIcon />
                  </IconButton>
                </Tooltip>
                
                <Tooltip title={shop.favorite ? "Retirer des favoris" : "Ajouter aux favoris"}>
                  <IconButton
                    onClick={() => handleToggleFavorite(shop)}
                    color="warning"
                  >
                    {shop.favorite ? <StarIcon /> : <StarBorderIcon />}
                  </IconButton>
                </Tooltip>
                
                {(shop.mapsUrl || shop.address) && (
                  <Tooltip title="Ouvrir dans Google Maps">
                    <IconButton
                      onClick={() => handleMapsClick(shop)}
                      color="primary"
                    >
                      <LaunchIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            </ListItem>
          ))}
        </List>

        {filteredShops.length === 0 && (
          <Box textAlign="center" py={4}>
            <Typography color="text.secondary">
              Aucun magasin trouvé pour les critères sélectionnés
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ShopsList;
