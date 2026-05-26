/**
 * NetPolix - Seed Script
 * Migra los datos de los archivos JSON a PostgreSQL
 */
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();
const dataDir = path.join(__dirname, '..', 'server', 'data');

function readJSON(filename) {
  const filePath = path.join(dataDir, filename);
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

async function main() {
  console.log('🌱 Iniciando seed de NetPolix...\n');

  // 1. Categorías
  const categories = readJSON('categories.json');
  console.log(`📁 Cargando ${categories.length} categorías...`);
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { id: cat.id },
      update: { name: cat.name, description: cat.description || '' },
      create: { id: cat.id, name: cat.name, description: cat.description || '' }
    });
  }

  // 2. Clasificaciones
  const classifications = readJSON('classifications.json');
  console.log(`📁 Cargando ${classifications.length} clasificaciones...`);
  for (const cls of classifications) {
    await prisma.classification.upsert({
      where: { id: cls.id },
      update: { type: cls.type, description: cls.description || '' },
      create: { id: cls.id, type: cls.type, description: cls.description || '' }
    });
  }

  // 3. Idiomas
  const languages = readJSON('languages.json');
  console.log(`📁 Cargando ${languages.length} idiomas...`);
  for (const lang of languages) {
    await prisma.language.upsert({
      where: { id: lang.id },
      update: { name: lang.name, code: lang.code },
      create: { id: lang.id, name: lang.name, code: lang.code }
    });
  }

  // 4. Personas
  const people = readJSON('people.json');
  console.log(`📁 Cargando ${people.length} personas...`);
  for (const person of people) {
    await prisma.person.upsert({
      where: { id: person.id },
      update: { name: person.name, birthDate: person.birthDate || null, roles: person.roles || [] },
      create: { id: person.id, name: person.name, birthDate: person.birthDate || null, roles: person.roles || [] }
    });
  }

  // 5. Usuarios
  const users = readJSON('users.json');
  console.log(`📁 Cargando ${users.length} usuarios...`);
  for (const user of users) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: {
        name: user.name,
        documentId: user.documentId,
        email: user.email,
        password: user.password,
        role: user.role,
        registrationDate: user.registrationDate ? new Date(user.registrationDate) : null,
        points: user.points || 0,
        referralCode: user.referralCode || null,
        referredBy: user.referredBy || null,
        penalized: user.penalized || false,
        penalizedReason: user.penalizedReason || null,
        active: user.active !== false,
        createdAt: user.createdAt ? new Date(user.createdAt) : new Date()
      },
      create: {
        id: user.id,
        name: user.name,
        documentId: user.documentId,
        email: user.email,
        password: user.password,
        role: user.role,
        registrationDate: user.registrationDate ? new Date(user.registrationDate) : null,
        points: user.points || 0,
        referralCode: user.referralCode || null,
        referredBy: user.referredBy || null,
        penalized: user.penalized || false,
        penalizedReason: user.penalizedReason || null,
        active: user.active !== false,
        createdAt: user.createdAt ? new Date(user.createdAt) : new Date()
      }
    });
  }

  // 6. Películas
  const movies = readJSON('movies.json');
  console.log(`📁 Cargando ${movies.length} películas...`);
  for (const movie of movies) {
    await prisma.movie.upsert({
      where: { id: movie.id },
      update: {
        isan: movie.isan,
        title: movie.title,
        year: movie.year || 0,
        duration: movie.duration || 0,
        classification: movie.classification || null,
        categories: movie.categories || [],
        originalLanguage: movie.originalLanguage || null,
        subtitles: movie.subtitles || [],
        dubbing: movie.dubbing || [],
        actors: movie.actors || [],
        directors: movie.directors || [],
        producers: movie.producers || [],
        rating: movie.rating || null,
        avgRating: movie.avgRating || 0,
        totalRatings: movie.totalRatings || 0,
        salePrice: movie.salePrice || 0,
        rentalPrice: movie.rentalPrice || 0,
        imageUrl: movie.imageUrl || null,
        description: movie.description || null,
          trailerUrl: movie.trailerUrl || null,
        active: movie.active !== false,
        createdAt: movie.createdAt ? new Date(movie.createdAt) : new Date()
      },
      create: {
        id: movie.id,
        isan: movie.isan,
        title: movie.title,
        year: movie.year || 0,
        duration: movie.duration || 0,
        classification: movie.classification || null,
        categories: movie.categories || [],
        originalLanguage: movie.originalLanguage || null,
        subtitles: movie.subtitles || [],
        dubbing: movie.dubbing || [],
        actors: movie.actors || [],
        directors: movie.directors || [],
        producers: movie.producers || [],
        rating: movie.rating || null,
        avgRating: movie.avgRating || 0,
        totalRatings: movie.totalRatings || 0,
        salePrice: movie.salePrice || 0,
        rentalPrice: movie.rentalPrice || 0,
        imageUrl: movie.imageUrl || null,
        description: movie.description || null,
          trailerUrl: movie.trailerUrl || null,
        active: movie.active !== false,
        createdAt: movie.createdAt ? new Date(movie.createdAt) : new Date()
      }
    });
  }

  // 7. Series
  const series = readJSON('series.json');
  console.log(`📁 Cargando ${series.length} series...`);
  for (const s of series) {
    await prisma.series.upsert({
      where: { id: s.id },
      update: {
        isan: s.isan || null,
        title: s.title,
        season: s.season || null,
        seasons: s.seasons || null,
        episodes: s.episodes || null,
        year: s.year || null,
        originalLanguage: s.originalLanguage || null,
        subtitles: s.subtitles || [],
        dubbing: s.dubbing || [],
        actors: s.actors || [],
        directors: s.directors || [],
        categories: s.categories || [],
        rating: s.rating || null,
        avgRating: s.avgRating || 0,
        totalRatings: s.totalRatings || 0,
        salePrice: s.salePrice || 0,
        rentalPrice: s.rentalPrice || 0,
        imageUrl: s.imageUrl || null,
        description: s.description || null,
          trailerUrl: s.trailerUrl || null,
        active: s.active !== false,
        createdAt: s.createdAt ? new Date(s.createdAt) : new Date()
      },
      create: {
        id: s.id,
        isan: s.isan || null,
        title: s.title,
        season: s.season || null,
        seasons: s.seasons || null,
        episodes: s.episodes || null,
        year: s.year || null,
        originalLanguage: s.originalLanguage || null,
        subtitles: s.subtitles || [],
        dubbing: s.dubbing || [],
        actors: s.actors || [],
        directors: s.directors || [],
        categories: s.categories || [],
        rating: s.rating || null,
        avgRating: s.avgRating || 0,
        totalRatings: s.totalRatings || 0,
        salePrice: s.salePrice || 0,
        rentalPrice: s.rentalPrice || 0,
        imageUrl: s.imageUrl || null,
        description: s.description || null,
          trailerUrl: s.trailerUrl || null,
        active: s.active !== false,
        createdAt: s.createdAt ? new Date(s.createdAt) : new Date()
      }
    });
  }

  // 8. Colecciones
  const collections = readJSON('collections.json');
  console.log(`📁 Cargando ${collections.length} colecciones...`);
  for (const col of collections) {
    await prisma.collection.upsert({
      where: { id: col.id },
      update: {
        isan: col.isan || null,
        title: col.title,
        volume: col.volume || 1,
        videos: col.videos || [],
        salePrice: col.salePrice || 0,
        rentalPrice: col.rentalPrice || 0,
        description: col.description || null,
        active: col.active !== false,
        createdAt: col.createdAt ? new Date(col.createdAt) : new Date()
      },
      create: {
        id: col.id,
        isan: col.isan || null,
        title: col.title,
        volume: col.volume || 1,
        videos: col.videos || [],
        salePrice: col.salePrice || 0,
        rentalPrice: col.rentalPrice || 0,
        description: col.description || null,
        active: col.active !== false,
        createdAt: col.createdAt ? new Date(col.createdAt) : new Date()
      }
    });
  }

  // 9. Órdenes
  const orders = readJSON('orders.json');
  console.log(`📁 Cargando ${orders.length} órdenes...`);
  for (const order of orders) {
    // Verificar que el usuario existe
    const userExists = await prisma.user.findUnique({ where: { id: order.userId } });
    if (!userExists) {
      console.log(`  ⚠️  Orden ${order.id} omitida: usuario ${order.userId} no existe`);
      continue;
    }
    await prisma.order.upsert({
      where: { id: order.id },
      update: {
        userId: order.userId,
        type: order.type,
        itemType: order.itemType,
        itemId: order.itemId,
        itemTitle: order.itemTitle,
        price: order.price,
        pointsEarned: order.pointsEarned || 0,
        pointsRedeemed: order.pointsRedeemed || 0,
        date: order.date ? new Date(order.date) : new Date()
      },
      create: {
        id: order.id,
        userId: order.userId,
        type: order.type,
        itemType: order.itemType,
        itemId: order.itemId,
        itemTitle: order.itemTitle,
        price: order.price,
        pointsEarned: order.pointsEarned || 0,
        pointsRedeemed: order.pointsRedeemed || 0,
        date: order.date ? new Date(order.date) : new Date()
      }
    });
  }

  // 10. Configuración
  const config = readJSON('config.json');
  console.log(`📁 Cargando configuración...`);
  await prisma.config.upsert({
    where: { id: 1 },
    update: {
      movieRentalPrice: config.pricing?.movieRentalPrice || 4.99,
      movieSalePrice: config.pricing?.movieSalePrice || 14.99,
      seriesRentalPrice: config.pricing?.seriesRentalPrice || 7.99,
      seriesSalePrice: config.pricing?.seriesSalePrice || 24.99,
      collectionRentalPrice: config.pricing?.collectionRentalPrice || 12.99,
      collectionSalePrice: config.pricing?.collectionSalePrice || 39.99,
      pointsPerRental: config.points?.pointsPerRental || 10,
      pointsPerSale: config.points?.pointsPerSale || 25,
      pointsPerReferral: config.points?.pointsPerReferral || 50,
      pointsRedemptionRate: config.points?.pointsRedemptionRate || 100,
      lastUpdated: config.lastUpdated ? new Date(config.lastUpdated) : new Date()
    },
    create: {
      id: 1,
      movieRentalPrice: config.pricing?.movieRentalPrice || 4.99,
      movieSalePrice: config.pricing?.movieSalePrice || 14.99,
      seriesRentalPrice: config.pricing?.seriesRentalPrice || 7.99,
      seriesSalePrice: config.pricing?.seriesSalePrice || 24.99,
      collectionRentalPrice: config.pricing?.collectionRentalPrice || 12.99,
      collectionSalePrice: config.pricing?.collectionSalePrice || 39.99,
      pointsPerRental: config.points?.pointsPerRental || 10,
      pointsPerSale: config.points?.pointsPerSale || 25,
      pointsPerReferral: config.points?.pointsPerReferral || 50,
      pointsRedemptionRate: config.points?.pointsRedemptionRate || 100,
      lastUpdated: config.lastUpdated ? new Date(config.lastUpdated) : new Date()
    }
  });

  // Resumen
  const counts = {
    categories: await prisma.category.count(),
    classifications: await prisma.classification.count(),
    languages: await prisma.language.count(),
    people: await prisma.person.count(),
    users: await prisma.user.count(),
    movies: await prisma.movie.count(),
    series: await prisma.series.count(),
    collections: await prisma.collection.count(),
    orders: await prisma.order.count(),
  };

  console.log('\n✅ Seed completado exitosamente!\n');
  console.log('📊 Resumen de datos cargados:');
  console.log('  ├── Categorías:      ', counts.categories);
  console.log('  ├── Clasificaciones: ', counts.classifications);
  console.log('  ├── Idiomas:         ', counts.languages);
  console.log('  ├── Personas:        ', counts.people);
  console.log('  ├── Usuarios:        ', counts.users);
  console.log('  ├── Películas:       ', counts.movies);
  console.log('  ├── Series:          ', counts.series);
  console.log('  ├── Colecciones:     ', counts.collections);
  console.log('  └── Órdenes:         ', counts.orders);
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
