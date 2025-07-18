// VinylShops.js
import React, { useState } from 'react';
import ShopsList from './ShopsList';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  MusicNote as MusicNoteIcon
} from '@mui/icons-material';

const VinylShops = ({ shops, onUpdateShop }) => {
  const [selectedShop, setSelectedShop] = useState(null);
  const [wishlistDialog, setWishlistDialog] = useState(false);
  const [newWishlistItem, setNewWishlistItem] = useState('');

  const handleAddToWishlist = (shop) => {
    setSelectedShop(shop);
    setWishlistDialog(true);
  };

  const handleSaveWishlistItem = () => {
    if (selectedShop && newWishlistItem.trim()) {
      const updatedShop = {
        ...selectedShop,
        wishlist: [...(selectedShop.wishlist || []), newWishlistItem.trim()]
      };
      onUpdateShop(updatedShop);
      setNewWishlistItem('');
      setWishlistDialog(false);
    }
  };

  const handleRemoveFromWishlist = (shop, index) => {
    const updatedWishlist = shop.wishlist.filter((_, i) => i !== index);
    onUpdateShop({ ...shop, wishlist: updatedWishlist });
  };

  // Wrapper pour ajouter les fonctionnalités vinyle
  const VinylShopItem = ({ shop, onUpdate }) => (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box flex={1}>
            <Typography variant="h6" gutterBottom>
              🎵 {shop.name}
            </Typography>
            
            {shop.address && (
              <Typography variant="body2" color="text.secondary" gutterBottom>
                📍 {shop.address}
              </Typography>
            )}
            
            {shop.speciality && (
              <Chip 
                label={shop.speciality} 
                size="small" 
                sx={{ mb: 1 }}
                icon={<MusicNoteIcon />}
              />
            )}
            
            {shop.wishlist && shop.wishlist.length > 0 && (
              <Box mt={2}>
                <Typography variant="subtitle2" gutterBottom>
                  🎯 Wishlist ({shop.wishlist.length})
                </Typography>
                <List dense>
                  {shop.wishlist.map((item, index) => (
                    <ListItem key={index} sx={{ py: 0.5 }}>
                      <ListItemText primary={item} />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          size="small"
                          onClick={() => handleRemoveFromWishlist(shop, index)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </Box>
          
          <Box display="flex" flexDirection="column" gap={1}>
            <Button
              size="small"
              startIcon={<AddIcon />}
              onClick={() => handleAddToWishlist(shop)}
              variant="outlined"
            >
              Wishlist
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <ShopsList 
        shops={shops} 
        onUpdateShop={onUpdateShop} 
        title="🎵 Magasins de Vinyles"
      />
      
      {/* Dialog pour ajouter à la wishlist */}
      <Dialog open={wishlistDialog} onClose={() => setWishlistDialog(false)}>
        <DialogTitle>
          Ajouter à la wishlist - {selectedShop?.name}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Album / Artiste"
            fullWidth
            variant="outlined"
            value={newWishlistItem}
            onChange={(e) => setNewWishlistItem(e.target.value)}
            placeholder="ex: Pink Floyd - Dark Side of the Moon"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setWishlistDialog(false)}>Annuler</Button>
          <Button onClick={handleSaveWishlistItem} variant="contained">
            Ajouter
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VinylShops;