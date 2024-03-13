const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./dbconfig/db');


// Configure env
dotenv.config();

// Database configuration
connectDB();

// Rest Object
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/v1/auth', require('./routes/userRoute'));
app.use('/api/v1/order', require('./routes/ordersRoute'));

// Port
const port = process.env.PORT || 7070;

//App Listen
app.listen(port, () => console.log(`Server Running at ${port}`));
