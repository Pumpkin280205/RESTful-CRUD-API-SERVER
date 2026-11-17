const { Type } = require('@sinclair/typebox');

const currentYear = new Date().getFullYear();

const carBase = {
  make: Type.String({ minLength: 1, maxLength: 50 }),
  model: Type.String({ minLength: 1, maxLength: 50 }),
  year: Type.Integer({ minimum: 1900, maximum: currentYear + 1 }),
  price: Type.Number({ exclusiveMinimum: 0 }),
  vin: Type.String({ minLength: 17, maxLength: 17 }),
  status: Type.Optional(
    Type.Union([
      Type.Literal('available'),
      Type.Literal('reserved'),
      Type.Literal('sold'),
    ])
  ),
};

// POST body — all required except status
const createCarSchema = Type.Object(carBase, { additionalProperties: false });

// PUT body — every field optional, but at least the shape is enforced
const updateCarSchema = Type.Partial(
  Type.Object(carBase, { additionalProperties: false })
);

// /:id param
const idParamSchema = Type.Object({
  id: Type.Integer({ minimum: 1 }),
});

module.exports = { createCarSchema, updateCarSchema, idParamSchema };