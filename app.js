const express = require('express');
const app = express();
const morgan = require('morgan'); 
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

require('dotenv').config()

mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB_URL, { useMongoClient: true, useCreateIndex: true, useUnifiedTopology: true, useNewUrlParser: true });

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELET, GET');
        return res.status(200).json({});
    }
    next();
});

const productRoutes = require('./api/routes/products'); 
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');


app.use(morgan('dev'));
app.use('/uploads', express.static('uploads')); 

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use('/products', productRoutes); 
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);

app.use((req, res, next) => {
    const error = new Error('Not found'); 
    error.status = 404;
    next(error);
})


app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
})

module.exports = app;
