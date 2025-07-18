// src/components/BudgetTracker.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Alert,
  LinearProgress,
  Fab,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Avatar,
  ListItemAvatar,
  Snackbar
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AccountBalanceWallet as WalletIcon,
  Restaurant as RestaurantIcon,
  Hotel as HotelIcon,
  DirectionsBus as TransportIcon,
  LocalActivity as ActivityIcon,
  ShoppingBag as ShoppingIcon,
  LocalGasStation as FuelIcon,
  Phone as PhoneIcon,
  MoreHoriz as OtherIcon
} from '@mui/icons-material';

// Catégories de dépenses
const EXPENSE_CATEGORIES = [
  { id: 'food', label: 'Nourriture', icon: <RestaurantIcon />, color: '#ff6b6b' },
  { id: 'accommodation', label: 'Hébergement', icon: <HotelIcon />, color: '#4ecdc4' },
  { id: 'transport', label: 'Transport', icon: <TransportIcon />, color: '#45b7d1' },
  { id: 'activities', label: 'Activités', icon: <ActivityIcon />, color: '#f9ca24' },
  { id: 'shopping', label: 'Shopping', icon: <ShoppingIcon />, color: '#f0932b' },
  { id: 'fuel', label: 'Carburant', icon: <FuelIcon />, color: '#eb4d4b' },
  { id: 'communication', label: 'Communication', icon: <PhoneIcon />, color: '#6c5ce7' },
  { id: 'other', label: 'Autres', icon: <OtherIcon />, color: '#a0a0a0' }
];

const BudgetTracker = () => {
  const [budget, setBudget] = useState({
    total: 0,
    spent: 0,
    remaining: 0
  });
  const [expenses, setExpenses] = useState([]);
  const [addExpenseDialog, setAddExpenseDialog] = useState(false);
  const [setBudgetDialog, setSetBudgetDialog] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // Formulaire nouvelle dépense
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    category: 'food',
    date: new Date().toISOString().slice(0, 10)
  });

  // Chargement des données depuis le localStorage
  useEffect(() => {
    const savedBudget = localStorage.getItem('travelBudget');
    const savedExpenses = localStorage.getItem('travelExpenses');
    
    if (savedBudget) {
      setBudget(JSON.parse(savedBudget));
    }
    
    if (savedExpenses) {
      const parsedExpenses = JSON.parse(savedExpenses);
      setExpenses(parsedExpenses);
      calculateBudget(parsedExpenses);
    }
  }, []);

  // Calcul du budget
  const calculateBudget = (expensesList = expenses) => {
    const totalSpent = expensesList.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
    const updatedBudget = {
      ...budget,
      spent: totalSpent,
      remaining: budget.total - totalSpent
    };
    setBudget(updatedBudget);
    localStorage.setItem('travelBudget', JSON.stringify(updatedBudget));
  };

  // Sauvegarde des dépenses
  const saveExpenses = (expensesList) => {
    setExpenses(expensesList);
    localStorage.setItem('travelExpenses', JSON.stringify(expensesList));
    calculateBudget(expensesList);
  };

  // Gestion du formulaire
  const handleAddExpense = () => {
    if (!newExpense.description || !newExpense.amount) {
      showSnackbar('Veuillez remplir tous les champs obligatoires', 'error');
      return;
    }

    const expense = {
      id: Date.now(),
      ...newExpense,
      amount: parseFloat(newExpense.amount),
      timestamp: new Date().toISOString()
    };

    const updatedExpenses = [...expenses, expense];
    saveExpenses(updatedExpenses);
    
    setNewExpense({
      description: '',
      amount: '',
      category: 'food',
      date: new Date().toISOString().slice(0, 10)
    });
    setAddExpenseDialog(false);
    showSnackbar('Dépense ajoutée avec succès', 'success');
  };

  // Suppression d'une dépense
  const handleDeleteExpense = (id) => {
    const updatedExpenses = expenses.filter(expense => expense.id !== id);
    saveExpenses(updatedExpenses);
    showSnackbar('Dépense supprimée', 'success');
  };

  // Définir le budget total
  const handleSetBudget = (amount) => {
    const updatedBudget = {
      total: parseFloat(amount),
      spent: budget.spent,
      remaining: parseFloat(amount) - budget.spent
    };
    setBudget(updatedBudget);
    localStorage.setItem('travelBudget', JSON.stringify(updatedBudget));
    setSetBudgetDialog(false);
    showSnackbar('Budget mis à jour', 'success');
  };

  // Statistiques par catégorie
  const getCategoryStats = () => {
    const stats = {};
    EXPENSE_CATEGORIES.forEach(cat => {
      stats[cat.id] = {
        ...cat,
        amount: expenses
          .filter(exp => exp.category === cat.id)
          .reduce((sum, exp) => sum + exp.amount, 0),
        count: expenses.filter(exp => exp.category === cat.id).length
      };
    });
    return stats;
  };

  // Affichage des notifications
  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const categoryStats = getCategoryStats();
  const budgetPercentage = budget.total > 0 ? (budget.spent / budget.total) * 100 : 0;

  return (
    <Box sx={{ width: '100%' }}>
      {/* En-tête du budget */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WalletIcon /> Budget de voyage
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6">Budget total</Typography>
            <Typography variant="h4">{budget.total.toFixed(2)} €</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6">Dépensé</Typography>
            <Typography variant="h4" color={budgetPercentage > 90 ? '#ff6b6b' : 'inherit'}>
              {budget.spent.toFixed(2)} €
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={Math.min(budgetPercentage, 100)}
              sx={{ mt: 1, bgcolor: 'rgba(255,255,255,0.3)' }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6">Restant</Typography>
            <Typography variant="h4" color={budget.remaining < 0 ? '#ff6b6b' : '#4ecdc4'}>
              {budget.remaining.toFixed(2)} €
            </Typography>
          </Grid>
        </Grid>

        {budget.remaining < 0 && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            ⚠️ Budget dépassé de {Math.abs(budget.remaining).toFixed(2)} €
          </Alert>
        )}
      </Paper>

      {/* Statistiques par catégorie */}
      <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>📊 Dépenses par catégorie</Typography>
        <Grid container spacing={2}>
          {Object.values(categoryStats).map((cat) => (
            <Grid item xs={12} sm={6} md={3} key={cat.id}>
              <Card sx={{ height: '100%', border: cat.amount > 0 ? `2px solid ${cat.color}` : '1px solid #e0e0e0' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Avatar sx={{ bgcolor: cat.color, margin: '0 auto', mb: 1 }}>
                    {cat.icon}
                  </Avatar>
                  <Typography variant="h6" gutterBottom>{cat.label}</Typography>
                  <Typography variant="h5" color="primary">{cat.amount.toFixed(2)} €</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {cat.count} dépense{cat.count > 1 ? 's' : ''}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Liste des dépenses */}
      <Paper elevation={1} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          📝 Historique des dépenses ({expenses.length})
        </Typography>
        
        {expenses.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              Aucune dépense enregistrée
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Cliquez sur le bouton + pour ajouter votre première dépense
            </Typography>
          </Box>
        ) : (
          <List>
            {expenses.slice().reverse().map((expense, index) => {
              const category = EXPENSE_CATEGORIES.find(cat => cat.id === expense.category);
              return (
                <React.Fragment key={expense.id}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: category?.color || '#grey' }}>
                        {category?.icon || <OtherIcon />}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={expense.description}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {category?.label} • {new Date(expense.date).toLocaleDateString('fr-FR')}
                          </Typography>
                        </Box>
                      }
                    />
                    <Box sx={{ textAlign: 'right', mr: 2 }}>
                      <Typography variant="h6" color="error">
                        -{expense.amount.toFixed(2)} €
                      </Typography>
                    </Box>
                    <ListItemSecondaryAction>
                      <IconButton 
                        edge="end" 
                        onClick={() => handleDeleteExpense(expense.id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < expenses.length - 1 && <Divider />}
                </React.Fragment>
              );
            })}
          </List>
        )}
      </Paper>

      {/* Boutons d'action */}
      <Box sx={{ position: 'fixed', bottom: 16, right: 16, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Fab 
          color="secondary" 
          onClick={() => setSetBudgetDialog(true)}
          sx={{ mb: 1 }}
        >
          <WalletIcon />
        </Fab>
        <Fab 
          color="primary" 
          onClick={() => setAddExpenseDialog(true)}
        >
          <AddIcon />
        </Fab>
      </Box>

      {/* Dialog Ajouter une dépense */}
      <Dialog open={addExpenseDialog} onClose={() => setAddExpenseDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>💸 Ajouter une dépense</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Description"
            value={newExpense.description}
            onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Montant (€)"
            type="number"
            value={newExpense.amount}
            onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
            margin="normal"
            required
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Catégorie</InputLabel>
            <Select
              value={newExpense.category}
              onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
            >
              {EXPENSE_CATEGORIES.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {cat.icon} {cat.label}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Date"
            type="date"
            value={newExpense.date}
            onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddExpenseDialog(false)}>Annuler</Button>
          <Button onClick={handleAddExpense} variant="contained">Ajouter</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Définir le budget */}
      <SetBudgetDialog 
        open={setBudgetDialog}
        onClose={() => setSetBudgetDialog(false)}
        onSetBudget={handleSetBudget}
        currentBudget={budget.total}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

// Composant pour définir le budget
const SetBudgetDialog = ({ open, onClose, onSetBudget, currentBudget }) => {
  const [amount, setAmount] = useState(currentBudget || 0);

  const handleSubmit = () => {
    if (amount > 0) {
      onSetBudget(amount);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>💰 Définir le budget total</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Budget total (€)"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          margin="normal"
          helperText="Définissez le budget total pour votre voyage"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button onClick={handleSubmit} variant="contained">Définir</Button>
      </DialogActions>
    </Dialog>
  );
};

export default BudgetTracker;
