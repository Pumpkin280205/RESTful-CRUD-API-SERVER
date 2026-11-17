const pool = require('../config/db');

const CarModel = {
  async create({ make, model, year, price, vin, status }) {
    const sql = `
      INSERT INTO cars (make, model, year, price, vin, status)
      VALUES ($1, $2, $3, $4, $5, COALESCE($6, 'available'))
      RETURNING *
    `;
    const { rows } = await pool.query(sql, [make, model, year, price, vin, status]);
    return rows[0];
  },

  async findAll() {
    const { rows } = await pool.query('SELECT * FROM cars ORDER BY id');
    return rows;
  },

  async findById(id) {
    const { rows } = await pool.query('SELECT * FROM cars WHERE id = $1', [id]);
    return rows[0] || null;
  },

  async update(id, fields) {
    const keys = Object.keys(fields);
    if (keys.length === 0) return this.findById(id);

    const setClauses = keys.map((k, i) => `${k} = $${i + 1}`);
    const values = keys.map((k) => fields[k]);
    values.push(id);

    const sql = `
      UPDATE cars
      SET ${setClauses.join(', ')}
      WHERE id = $${values.length}
      RETURNING *
    `;
    const { rows } = await pool.query(sql, values);
    return rows[0] || null;
  },

  async remove(id) {
    const { rows } = await pool.query(
      'DELETE FROM cars WHERE id = $1 RETURNING *',
      [id]
    );
    return rows[0] || null;
  },
};

module.exports = CarModel;