//SEE ALSO NODE REST SHOP API TUT 12
const express = require('express');
const router = express.Router(); //see https://stackoverflow.com/questions/28305120/differences-between-express-router-and-app-get
const mongoose = require('mongoose');
const multer = require('multer'); 
/*multer package is used parses form body data, image/file will be sent as form data instead
of raw JSON data*/

const checkAuth = require('../middleware/check-auth');
const ProductsController = require('../controllers/products');

const storage = multer.diskStorage({ //specifies how files should be stored see https://github.com/expressjs/multer 
  destination: function(req, file, cb) { //cb is a built-in multer call back function
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    // cb(null, new Date().toISOString() + file.originalname); toISOString() usage produces an error
    cb(null, Date.now() + file.originalname); 
    /*altenately file.fieldname can also be used since fieldname is property of the file object
    e.g{
      fieldname: 'productImage',
      originalname: 'action-asphalt-automobile-627678.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      destination: './uploads/',
      filename: '1588862807973action-asphalt-automobile-627678.jpg',
      path: 'uploads\\1588862807973action-asphalt-automobile-627678.jpg',
      size: 414855
    }*/
  }
});

//const upload = multer({dest: 'uploads/'}); //  uploads/ is relative path but /uploads/ is an absolute path
/*specifies destination where multer  stores incoming files*/

const fileFilter = (req, file, cb) => { //arrow function equivalent of function (req, file, cb)

  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false); 
    /*this only prevents the file from being stored it does not generate a notification of rejection
    code resembling cb(new Error('message'), true) would have to be used to enable this behaviour*/
                   
  }

  //cb(null, false); //reject a file, file will not be stored
  //cb(null, true); //accept a file to store it

  //if null is not set an error will be returned

};

const upload = multer({
  storage: storage, 
  limits: {
    filesize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
}); 
/*the storage constant which holds the storage strategy i.e destination and filename properties is set to the storage property
o the configuration object object {} being passed to multer*/

//const Product = require('../models/productModel');

router.get("/", ProductsController.products_get_all);

router.post("/", checkAuth, upload.single('productImage'), ProductsController.products_create_product);

router.get("/:productId", ProductsController.products_get_product);

router.patch("/:productId", checkAuth, ProductsController.products_update_product);

router.delete("/:productId", checkAuth, ProductsController.products_delete);

//handle a request for or return of 1 product
// router.get('/:productId', (req, res, next) => {
//     const id = req.params.productId;
//     if (id === 'special') {
//         res.status(200).json({
//             message: 'discovered special id',
//             id: id
//         })
//     } else {
//         res.status(200).json({
//             message: 'you passed an id'
//         });
//     }
// });
// router.get("/:productId", (req, res, next) => {
//     const id = req.params.productId;
//     /*Product imported using const Product = require('../models/productModel')
//       the Product is a model and this allows the finById function to be available for use
//       see https://mongoosejs.com/docs/models.html#querying
//           https://mongoosejs.com/docs/queries.html
//     */
//     Product.findById(id)
//       .select('name price _id productImage') 
//       .exec()
//       .then(doc => {
//         console.log("From database", doc);
//         if (doc) {
//           //res.status(200).json(doc);
//           res.status(200).json({
//             product: doc,
//             request: {
//                 type: 'GET',
//                 description: 'Get all products',
//                 url: 'http://localhost:3000/products'
//             }
//           });
//         } else {
//           res
//             .status(404)
//             .json({ message: "No valid entry found for provided ID" });
//         }
//       })
//       .catch(err => {
//         console.log(err);
//         res.status(500).json({ error: err });
//       });
//   });


// router.patch('/:productId', (req, res, next) => {
//         res.status(200).json({
//             message: 'updated product',
//         });
// });
// router.patch("/:productId", checkAuth, (req, res, next) => {
//   const id = req.params.productId;
//   const updateOps = {};
//   for (const ops of req.body) { /*loops through each operation i.e each product(made up of a name and price property) 
//     of the request body, request body is expected to be an array*/
//     updateOps[ops.propName] = ops.value; /*propName is a place holder for the properties of req.body
//     in this case name and price as defined in productModel
//     updateOps can store changes made to both name and price or to a single one of these properties
//     in postman along with id of object to be updated Body req object must be passed in this format
//     [
	
//       {"propName":"name", "value": "Harry Potter 6"}
      
//     ]
//     */
//   }
//   Product.update({ _id: id }, { $set: updateOps })
//     .exec()
//     .then(result => {
//       console.log(result);
//       //res.status(200).json(result);
//       res.status(200).json({
//         message: 'Product updated',
//         request: {
//             type: 'GET',
//             url: 'http://localhost:3000/products/' + id
//         }
//       });
//     })
//     .catch(err => {
//       console.log(err);
//       res.status(500).json({
//         error: err
//       });
//     });
// });


// router.delete('/:productId', (req, res, next) => {
//     res.status(200).json({
//         message: 'deleted product',
//     });
// });
// router.delete("/:productId", checkAuth, (req, res, next) => {
//   const id = req.params.productId; //req.params.pathname corresponds to /:pathname in this case productId
//   Product.remove({ _id: id })
//     .exec()
//     .then(result => {
//       //res.status(200).json(result);
//       res.status(200).json({
//         message: 'Product deleted',
//         request: {
//             type: 'POST',
//             description: 'Create a new product',
//             url: 'http://localhost:3000/products',
//             body: { name: 'String', price: 'Number' }
//         }
//       });
//     })
//     .catch(err => {
//       console.log(err);
//       res.status(500).json({
//         error: err
//       });
//     });
// });

module.exports = router;