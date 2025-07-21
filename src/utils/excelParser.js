// excelParser.js - VERSION COMPLÈTE AVEC CORRECTIONS POUR FEUILLES DISTINCTES
import * as XLSX from 'xlsx';
import { cleanCityName } from './cityNormalizer'; // si séparé


export const parseExcelFile = (file) => {
  if (!file) return Promise.reject(new Error('Aucun fichier fourni'));
  

  const extension = file.name.split('.').pop().toLowerCase();
  console.log('📂 Fichier importé:', file.name, 'Extension:', extension);
  const city = extractCityFromFilename(file.name); // 👈 ajout
  localStorage.setItem('travelCity', city); // 👈 sauvegarde

  if (extension === 'csv') return parseCSVFile(file);
  if (['xlsx', 'xls'].includes(extension)) return parseExcelWithAllSheets(file);

  return Promise.reject(new Error('Format non supporté'));
};

const extractCityFromFilename = (filename) => {
  const base = filename.split('.')[0];
  const parts = base.split(/[_\-]/);

  const cityCandidate = parts.find(part =>
    part.length > 3 &&
    !['activite', 'activité', 'activitée', 'activities', 'planning', 'roadmap', 'city', 'program', 'programme'].includes(part.toLowerCase())
  );

  if (cityCandidate) {
    const cleaned = cleanCityName(cityCandidate);
    console.log('[🏙️ Ville nettoyée]:', cleaned);
    return cleaned;
  }

  return 'New York'; // fallback
};

const capitalizeWords = (str) => {
  return str
    .replace(/_/g, ' ')
    .replace(/-/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

// 🔄 Lecture de toutes les feuilles et détection par nom
const parseExcelWithAllSheets = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const workbook = XLSX.read(e.target.result, { type: 'binary' });

        const result = { roadmap: [], vinyl: [], shops: [] };

        workbook.SheetNames.forEach((sheetName) => {
          const sheet = workbook.Sheets[sheetName];
          const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

          if (rows.length < 2) return;

          const type = detectTypeFromSheetName(sheetName);

          if (type === 'activities') {
            const [...dataRows] = rows;
            dataRows.forEach(row => {
              const activity = parseActivityRow(row);
              if (activity) result.roadmap.push(activity);
            });
          }

          if (type === 'vinyl') {
            const [...dataRows] = rows;
            dataRows.forEach((row, index) => {
              const shop = parseVinylRow(row, sheet, index);
              if (shop) result.vinyl.push(shop);
            });
          }

          if (type === 'shops') {
            const [...dataRows] = rows;
            dataRows.forEach(row => {
              const shop = parseShopRow(row);
              if (shop) result.shops.push(shop);
            });
          }
        });

        resolve(result);
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = (e) => reject(e);
    reader.readAsBinaryString(file);
  });
};

// 👁️ Détecter le type à partir du nom de la feuille
const detectTypeFromSheetName = (name) => {
  const lower = name.toLowerCase();
  if (lower.includes('vinyl')) return 'vinyl';
  if (lower.includes('shop')) return 'shops';
  return 'activities';
};

// 📅 Parser une ligne d'activité
const parseActivityRow = (row) => {
  if (!row[0] || row[0] === 'Jour' || row[0] === '-') return null;

  const date = parseDate(row[0]);
  const time = row[1] || '';
  const emoji = row[2] || '';
  const activity = row[3] || '';
  const place = row[4] || '';
  const remarque = row[5] || '';
  const pass = row[6] || '';
  const statut = row[7] || '';

  return {
    id: `activity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    date,
    time,
    activity: `${emoji} ${activity}`.trim(),
    place,
    address: place,
    remarque,
    pass,
    statut: parseStatus(statut),
    mapsUrl: generateMapsUrl(place),
    transport: '',
    duration: '',
    price: pass.includes('✅') ? 'Inclus' : '',
    notes: remarque,
    status: parseStatus(statut)
  };
};

// 🎵 Parser un disquaire
// 🎵 Parser un disquaire (mise à jour avec lien direct Google Maps)
// 🎵 Parser un disquaire (lecture du lien hypertexte Excel)
const parseVinylRow = (row, sheet, rowIndex) => {
  if (!row[0] || row[0] === '🏪 Boutique') return null;

  const name = row[0] || '';
  const notes = row[2] || '';

  // 👉 Lire le lien réel de la cellule B (index 1) via sheet
  const cellRef = XLSX.utils.encode_cell({ r: rowIndex, c: 1 }); // ligne=rowIndex, colonne=1 (B)
  const cell = sheet[cellRef];
  const mapsUrl = cell?.l?.Target || '';

  return {
    id: `vinyl-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name,
    address: '', // supprimé
    type: 'vinyl',
    visited: false,
    favorite: false,
    specialties: [],
    notes,
    rating: 0,
    phone: '',
    website: '',
    hours: '',
    wishlist: [],
    mapsUrl // ✅ Lien réel cliquable
  };
};



// 🏪 Parser un magasin classique
const parseShopRow = (row) => {
  if (!row[0] || row[0] === 'Name') return null;

  return {
    id: `shop-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: row[0] || '',
    address: row[1] || '',
    type: 'shop',
    visited: false,
    favorite: false,
    specialties: [],
    notes: '',
    rating: 0,
    phone: '',
    website: '',
    hours: '',
    wishlist: [],
    mapsUrl: generateMapsUrl(row[1])
  };
};

// 📅 Formatage date Excel
const parseDate = (value) => {
  if (!value) return '';
  if (typeof value === 'number') {
    const date = new Date((value - 25569) * 86400 * 1000);
    return date.toLocaleDateString('fr-FR');
  }
  const date = new Date(value);
  return isNaN(date.getTime()) ? String(value) : date.toLocaleDateString('fr-FR');
};

// 📍 Google Maps URL
const generateMapsUrl = (address) => {
  if (!address) return '';
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
};

// 🔄 Statut simplifié
const parseStatus = (statut) => {
  const s = String(statut).toLowerCase();
  if (s.includes('✅') || s.includes('terminé')) return 'Terminé';
  if (s.includes('🔄') || s.includes('cours')) return 'En cours';
  if (s.includes('❌') || s.includes('annulé')) return 'Annulé';
  return 'À faire';
};

// ❗ Dummy CSV support pour compatibilité
const parseCSVFile = (file) => {
  return Promise.reject(new Error('CSV non supporté dans cette version'));
};

export const saveAllDataToLocalStorage = (data) => {
  try {
    const dataToSave = {
      roadmap: data.roadmap || [],
      shops: data.shops || [],
      vinyl: data.vinyl || [],
      lastUpdated: new Date().toISOString()
    };

    const jsonString = JSON.stringify(dataToSave);
    localStorage.setItem('travelRoadmapData', jsonString);
    return true;
  } catch (error) {
    console.error('❌ Erreur sauvegarde locale:', error);
    return false;
  }
};

export const loadAllDataFromLocalStorage = () => {
  try {
    const data = localStorage.getItem('travelRoadmapData');

    if (!data || data === 'undefined' || data === 'null') {
      return {
        roadmap: [],
        shops: [],
        vinyl: []
      };
    }

    return JSON.parse(data);
  } catch (error) {
    console.error('❌ Erreur chargement données:', error);
    return {
      roadmap: [],
      shops: [],
      vinyl: []
    };
  }
};

export const clearAllData = () => {
  try {
    localStorage.removeItem('travelRoadmapData');
    return true;
  } catch (error) {
    console.error('❌ Erreur suppression données:', error);
    return false;
  }
};

export const getDataStats = (data) => {
  try {
    const stats = {
      roadmap: {
        total: data.roadmap?.length || 0,
        completed: data.roadmap?.filter(item => item.status === 'Terminé').length || 0,
        pending: data.roadmap?.filter(item => item.status === 'À faire').length || 0,
        inProgress: data.roadmap?.filter(item => item.status === 'En cours').length || 0
      },
      shops: {
        total: data.shops?.length || 0,
        visited: data.shops?.filter(item => item.visited).length || 0,
        favorites: data.shops?.filter(item => item.favorite).length || 0
      },
      vinyl: {
        total: data.vinyl?.length || 0,
        visited: data.vinyl?.filter(item => item.visited).length || 0,
        favorites: data.vinyl?.filter(item => item.favorite).length || 0,
        wishlistItems: data.vinyl?.reduce((acc, s) => acc + (s.wishlist?.length || 0), 0) || 0
      }
    };
    return stats;
  } catch (err) {
    console.error('❌ Erreur statistiques:', err);
    return null;
  }
};


export const exportDataToJSON = (data) => {
  try {
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const fileName = `travel-roadmap-${new Date().toISOString().split('T')[0]}.json`;

    const link = document.createElement('a');
    link.setAttribute('href', dataUri);
    link.setAttribute('download', fileName);
    link.click();
    return true;
  } catch (error) {
    console.error('❌ Erreur export JSON:', error);
    return false;
  }
};

export const importDataFromJSON = (jsonData) => {
  try {
    const data = JSON.parse(jsonData);
    saveAllDataToLocalStorage(data);
    return data;
  } catch (error) {
    console.error('❌ Erreur import JSON:', error);
    return null;
  }
};

