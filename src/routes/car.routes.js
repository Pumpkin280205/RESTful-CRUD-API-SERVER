const express = require('express');
const router = express.Router();

const validate = require('../middleware/validate');
const apiKeyAuth = require('../middleware/auth');
const {
  createCarSchema,
  updateCarSchema,
  idParamSchema,
} = require('../schemas/car.schema');
const controller = require('../controllers/car.controller');

// All car routes require the API key
router.use(apiKeyAuth);

router.post('/', validate(createCarSchema, 'body'), controller.createCar);
router.get('/', controller.listCars);
router.get('/:id', validate(idParamSchema, 'params'), controller.getCar);
router.put(
  '/:id',
  validate(idParamSchema, 'params'),
  validate(updateCarSchema, 'body'),
  controller.updateCar
);
router.delete('/:id', validate(idParamSchema, 'params'), controller.deleteCar);

module.exports = router;