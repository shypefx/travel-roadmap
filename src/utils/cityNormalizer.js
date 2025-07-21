// 🔧 Liste des corrections spécifiques connues
const cityCorrections = {
  newyork: 'New York',
  sansebastian: 'San Sebastián',
  lasvegas: 'Las Vegas',
  saintpetersburg: 'Saint Petersburg',
  hongkong: 'Hong Kong',
  losangeles: 'Los Angeles',
  buenosaires: 'Buenos Aires',
  rio: 'Rio de Janeiro',
  capetown: 'Cape Town',
  hochiminh: 'Ho Chi Minh',
  // Ajoute d'autres villes ici si besoin
};

export const cleanCityName = (raw) => {
  if (!raw) return 'New York';

  const normalized = raw.replace(/[^a-zA-Z]/g, '').toLowerCase();

  // Si on a une correction spécifique connue
  if (cityCorrections[normalized]) {
    return cityCorrections[normalized];
  }

  // Sinon : met une majuscule au début, découpe à chaque mot long (pas optimal mais fallback)
  return raw
    .replace(/[_\-]/g, ' ')
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
};
