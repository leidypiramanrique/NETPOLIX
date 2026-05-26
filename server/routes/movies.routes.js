const router = require('express').Router();
const prisma = require('../utils/prismaClient');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/roles');

function generateId() {
  return Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 9);
}

// GET /api/movies - Public with filters
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { search, category, year, classification, rating, sort } = req.query;
    
    const where = { active: true };
    if (classification) where.classification = classification;
    if (rating) where.rating = rating;
    if (year) where.year = parseInt(year);
    if (category) where.categories = { has: category };

    let movies = await prisma.movie.findMany({ where });

    // Text search (case insensitive)
    if (search) {
      const q = search.toLowerCase();
      movies = movies.filter(m => m.title.toLowerCase().includes(q) || m.description?.toLowerCase().includes(q));
    }

    if (sort === 'price_asc') movies.sort((a, b) => a.salePrice - b.salePrice);
    else if (sort === 'price_desc') movies.sort((a, b) => b.salePrice - a.salePrice);
    else if (sort === 'year_desc') movies.sort((a, b) => b.year - a.year);
    else if (sort === 'rating') movies.sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0));
    else movies.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/movies/:id
router.get('/:id', async (req, res) => {
  try {
    const movie = await prisma.movie.findUnique({ where: { id: req.params.id } });
    if (!movie) return res.status(404).json({ error: 'Película no encontrada' });

    // Resolve people names
    const allPeopleIds = [...(movie.actors || []), ...(movie.directors || []), ...(movie.producers || [])];
    const people = allPeopleIds.length > 0
      ? await prisma.person.findMany({ where: { id: { in: allPeopleIds } } })
      : [];

    const resolvePeople = (ids) => (ids || []).map(id => {
      const person = people.find(p => p.id === id);
      return person ? { id: person.id, name: person.name } : { id, name: 'Desconocido' };
    });

    res.json({
      ...movie,
      actorDetails: resolvePeople(movie.actors),
      directorDetails: resolvePeople(movie.directors),
      producerDetails: resolvePeople(movie.producers),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/movies
router.post('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    if (!req.body.title || !req.body.isan) {
      return res.status(400).json({ error: 'Título e ISAN son requeridos' });
    }

    const existing = await prisma.movie.findFirst({ where: { isan: req.body.isan } });
    if (existing) {
      return res.status(400).json({ error: 'Ya existe una película con ese ISAN' });
    }

    const movie = await prisma.movie.create({
      data: {
        id: generateId(),
        isan: req.body.isan,
        title: req.body.title,
        year: req.body.year || 0,
        duration: req.body.duration || 0,
        classification: req.body.classification || null,
        categories: req.body.categories || [],
        originalLanguage: req.body.originalLanguage || null,
        subtitles: req.body.subtitles || [],
        dubbing: req.body.dubbing || [],
        actors: req.body.actors || [],
        directors: req.body.directors || [],
        producers: req.body.producers || [],
        salePrice: req.body.salePrice || 0,
        rentalPrice: req.body.rentalPrice || 0,
        imageUrl: req.body.imageUrl || null,
        description: req.body.description || null,
        trailerUrl: req.body.trailerUrl || null,
        rating: req.body.rating || null,
        avgRating: 0,
        totalRatings: 0,
        active: true
      }
    });

    res.status(201).json(movie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/movies/:id
router.put('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const existing = await prisma.movie.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ error: 'Película no encontrada' });

    const { id, ...updateData } = req.body;
    const movie = await prisma.movie.update({ where: { id: req.params.id }, data: updateData });
    res.json(movie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/movies/:id
router.delete('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const existing = await prisma.movie.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ error: 'Película no encontrada' });

    await prisma.movie.update({ where: { id: req.params.id }, data: { active: false } });
    res.json({ message: 'Película eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/movies/:id/rate  (cliente — solo si compró o alquiló)
router.post('/:id/rate', authenticateToken, authorizeRoles('cliente'), async (req, res) => {
  try {
    const stars = parseInt(req.body.stars);
    if (!stars || stars < 1 || stars > 5) {
      return res.status(400).json({ error: 'Calificación inválida. Usa un número entre 1 y 5.' });
    }

    const movie = await prisma.movie.findUnique({ where: { id: req.params.id } });
    if (!movie) return res.status(404).json({ error: 'Película no encontrada' });

    // Verificar que el usuario compró o alquiló esta película
    const purchase = await prisma.order.findFirst({
      where: { userId: req.user.id, itemId: req.params.id, itemType: 'movie' }
    });
    if (!purchase) {
      return res.status(403).json({ error: 'Solo puedes calificar películas que hayas comprado o alquilado.' });
    }

    // Calcular nuevo promedio acumulado (preserva el rating inicial predeterminado)
    const currentTotal = movie.totalRatings || 0;
    const currentAvg = movie.avgRating || 0;
    const newTotal = currentTotal + 1;
    const newAvg = ((currentAvg * currentTotal) + stars) / newTotal;

    const updated = await prisma.movie.update({
      where: { id: req.params.id },
      data: {
        avgRating: Math.round(newAvg * 10) / 10,
        totalRatings: newTotal
      }
    });

    res.json({ avgRating: updated.avgRating, totalRatings: updated.totalRatings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
