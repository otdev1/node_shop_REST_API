//SEE ALSO NODE REST SHOP API TUT 12
const express = require('express');
const router = express.Router(); //see https://stackoverflow.com/questions/28305120/differences-between-express-router-and-app-get
const mongoose = require('mongoose');
//const multer = require('multer'); 
/*multer package is used parses form body data, image/file will be sent as form data instead
of raw JSON data*/

const checkAuth = require('../middleware/check-auth');
const ProductsController = require('../controllers/products');

router.get("/", ProductsController.products_get_all);

router.post("/", checkAuth, ProductsController.products_create_product);

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
