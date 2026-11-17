// 404 handler — must be registered after all routes
function notFound(req, res) {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
}

// Central error handler — 4 args makes Express treat it as error middleware
function errorHandler(err, req, res, next) {
  console.error(err);

  // PostgreSQL unique violation (e.g. duplicate VIN)
  if (err.code === '23505') {
    return res.status(409).json({ error: 'Duplicate value', detail: err.detail });
  }

  // PostgreSQL check/not-null violations
  if (err.code === '23514' || err.code === '23502') {
    return res.status(400).json({ error: 'Database constraint violation', detail: err.detail });
  }

  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
}

module.exports = { notFound, errorHandler };