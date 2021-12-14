//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
// const encrypt = require("mongoose-encryption");

const saltRounds = 10;
const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("Public"));

app.set('view engine','ejs');

// console.log(process.env.API_KEY);

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema= new mongoose.Schema({
  email: String,
  password: String
});

// userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"] });

const User = mongoose.model("User", userSchema);

app.get("/", function(req, res){
  res.render("home");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});

app.post("/register", function(req, res){

bcrypt.hash(req.body.password, saltRounds, function(err, hash){
  const newUser = new User({
    email: req.body.username,
    password: hash
  });

  newUser.save(function(err){
    if (!err){
      res.render("login");
    }else{
      console.log(err);
    };
  });
});
});

app.post("/login", function(req, res){
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}, function(err, foundUser){
    if (!err){
      if (foundUser){
        bcrypt.compare(password, foundUser.password, function(err, result){
          if (result){
              res.render("secrets");
          };        
        });
      };
    }else{
      console.log(err);
    };
  });

});

app.listen(3000,function(){
  console.log("Server is running in PORT 3000.")
})
