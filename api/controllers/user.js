const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/userModel");

exports.user_login = (req, res, next) => {
    User.find({ email: req.body.email })
    //find returns an array where as findOne returns 1 object(document) 
      .exec()
      .then(user => {
        if (user.length >= 1) {
          bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            /*checks if the password in the body and the stored password were hased using the same
              algorithm in bcrypt
              user[0] is the first element i.e user object(document) in the user array and
              and as defined in the model password is a property of the user document */
              if (err) {
                return res.status(401).json({
                  message: "Auth failed"
                });
              }
              if (result) { /*bcrypt.compare returns either true or false see https://www.npmjs.com/package/bcrypt*/
                const token = jwt.sign( //see usage on https://github.com/auth0/node-jsonwebtoken
                  //payload
                  {
                    email: user[0].email,
                    userId: user[0]._id
                  },
                  //secretorprivatekey
                  process.env.JWT_KEY, // see nodemon.json file
                  {
                      expiresIn: "1h" //jwt key expires in 1 hour
                  }
                ); /*the sign function accepts payload and secretorprivatekey as arguments and generates 
                   a token i.e string of characters which can be used for authentication of routes*/
                return res.status(200).json({
                  message: "Auth successful",
                  token: token
                });
              }
              res.status(401).json({
                message: "Auth failed"
              });
            });
        }
        else
        {
            return res.status(401).json({
                message: "Auth failed"
              });
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  };