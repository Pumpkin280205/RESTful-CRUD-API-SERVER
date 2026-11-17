const CarModel = require('../models/car.model');

exports.createCar = async (req, res, next) => {
  try {
    const car = await CarModel.create(req.body);
    res.status(201).json(car);
  } catch (err) {
    next(err);
  }
};

exports.listCars = async (req, res, next) => {
  try {
    const cars = await CarModel.findAll();
    res.json(cars);
  } catch (err) {
    next(err);
  }
};

exports.getCar = async (req, res, next) => {
  try {
    const car = await CarModel.findById(req.params.id);
    if (!car) return res.status(404).json({ error: 'Car not found' });
    res.json(car);
  } catch (err) {
    next(err);
  }
};

exports.updateCar = async (req, res, next) => {
  try {
    const car = await CarModel.update(req.params.id, req.body);
    if (!car) return res.status(404).json({ error: 'Car not found' });
    res.json(car);
  } catch (err) {
    next(err);
  }
};

exports.deleteCar = async (req, res, next) => {
  try {
    const car = await CarModel.remove(req.params.id);
    if (!car) return res.status(404).json({ error: 'Car not found' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};