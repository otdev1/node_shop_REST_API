const express = require('express');
const app = express();
const morgan = require('morgan'); //morgan logs activities calling the next() function
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const config = require('./config');

const dotenv = require('dotenv');

dotenv.config();
/*Dotenv is a zero-dependency module that loads environment 
variables from a .env file into process.env. Storing configuration 
in the environment separate from code is based on The Twelve-Factor 
App methodology.*/

const mongodbUrl = config.MONGODB_URL;

mongoose.Promise = global.Promise;
//mongoose.connect('mongodb://localhost/node-rest-shop-db', { useCreateIndex: true, useUnifiedTopology: true, useNewUrlParser: true });

mongoose.connect(mongodbUrl, { useCreateIndex: true, useUnifiedTopology: true, useNewUrlParser: true });

// mongoose
//     .connect("mongodb+srv://nrs-admin:"+process.env.MONGODB_PW+"@node-rest-shop-hbzsi.mongodb.net/restapi-db?retryWrites=true", 
//                 { useCreateIndex: true, useUnifiedTopology: true, useNewUrlParser: true, })
//     .catch((error) => console.log(error.reason));

/*
    CORS - Cross Origin Resource Sharing enablement
*/
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


/*
    allows requests to sent to files specified in require('path/to/file')
*/
const productRoutes = require('./api/routes/products'); 
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');


app.use(morgan('dev'));
app.use('/uploads', express.static('uploads')); 
/*parses requests made to only URLs containing /uploads i.e express.static middleware is only executed when
a URL contains /uploads*/
//express.static('uploads') makes a folder staticly/publicly accessible
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//the use method sets up a middleware, an incoming request must go through app.use
// app.use((req, res, next) => {
//     res.status(200).json({
//         message: 'working'
//     })
// }); 

/*
   middlewares which specify the files to use that contain the route handlers for requests made to various URL filters i.e /products /orders etc 
 */
app.use('/products', productRoutes); //the /products filter i.e URL is handled by the productRoutes route handler
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);

/*
    middleware which handle requests to URLs for which no other middlewares exist
*/
app.use((req, res, next) => {
    const error = new Error('Not found'); //the error object is available by default so does not need to imported i.e required
    error.status = 404;
    next(error);
})

/*
    middleware which handles errors generated by other components of this app e.g the database
*/
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
})

module.exports = app;