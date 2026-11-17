const { Value } = require('@sinclair/typebox/value');

function validate(schema, source = 'body') {
  return (req, res, next) => {
    let data = req[source];

    // Coerce strings to numbers for params
    if (source === 'params') {
      data = Value.Convert(schema, data);
      req.params = data;
    }

    if (!Value.Check(schema, data)) {
      const errors = [...Value.Errors(schema, data)].map((e) => ({
        path: e.path,
        message: e.message,
      }));
      return res.status(400).json({ error: 'Validation failed', details: errors });
    }

    next();
  };
}

module.exports = validate;