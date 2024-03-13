const express = require('express');
const { saveOrdersController, userOrdersController } = require('../controllers/ordersController');
const router = express.Router();

// To save all order
router.post("/save-order", saveOrdersController);
// Get all orders of a user
router.get('/user-orders/:userId', userOrdersController);
module.exports = router;