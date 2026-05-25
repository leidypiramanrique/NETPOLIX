/**
 * Default configuration values for NetPolix
 */
module.exports = {
  // Pricing defaults en pesos colombianos (COP)
  pricing: {
    movieRentalPrice: 15000,      // COP
    movieSalePrice: 45000,        // COP

    seriesRentalPrice: 25000,     // COP
    seriesSalePrice: 70000,       // COP

    collectionRentalPrice: 40000, // COP
    collectionSalePrice: 120000   // COP
  },
  
  // Points system
  points: {
    pointsPerRental: 10,
    pointsPerSale: 25,
    pointsPerReferral: 50,
    pointsRedemptionRate: 1000 // 1000 puntos = 1000 COP
  },

  // Currency
  currency: 'COP',

  // Valid classifications
  classifications: ['G', 'PG', 'PG-13', 'R', 'NC-17'],
  
  // Valid ratings
  ratings: ['excelente', 'buena', 'regular', 'mala'],
  
  // Default languages
  defaultLanguages: [
    'Inglés', 'Español', 'Portugués', 'Alemán',
    'Japonés', 'Francés', 'Italiano', 'Ruso', 'Chino'
  ],

  // Default categories
  defaultCategories: [
    'Comedia', 'Terror', 'Acción', 'Suspenso', 'Drama', 'Independiente'
  ],

  // Password validation
  passwordMinLength: 7,
  passwordMaxLength: 15,
  emailMinLength: 6,
  emailMaxLength: 25
};
