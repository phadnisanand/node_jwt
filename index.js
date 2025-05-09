const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const app = express();
dotenv.config();

app.get('/', function (req,res) {
   res.json( { message: 'a sample api'});
})

app.post('/login', (req, res)=> {
  const user = {
    id: 1,
    username: "anil",
    email: "anil@gmail.com"
  }
  let jwtSecretKey = process.env.JWT_SECRET_KEY;
  const token = jwt.sign(user, jwtSecretKey);
  res.send({"token" : token});
})


function verifyToken(req,res,next) {
    const bearerToken =  req.headers['authorization'];
    if(typeof bearerToken !== 'undefined') {
        const bearer = bearerToken.split(" ");
        const token = bearer[1];
        req.token = token;
        next();
    } else {
      res.send({
        result: "Token is not valid"
      });
    }
 }

app.get('/profile',verifyToken, function (req,res) {
  let jwtSecretKey = process.env.JWT_SECRET_KEY;
  jwt.verify(req.token, jwtSecretKey, (err, authData) => {
      if(err) {
          res.send({result: "invalid token"})
      } else {
          res.json( {
              message: 'profile accessed',
              authData
          });
      }
  })
})

let PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('app is running on port', PORT);
})
