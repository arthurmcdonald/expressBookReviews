const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
      if (!doesExist(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  const getBooksPromise = new Promise((resolve, reject) => {
    if (books) {
      resolve(res.send(JSON.stringify(books)));
    } else {
      reject("No books in the database.");
    }
  });

  getBooksPromise.then(function() {
    console.log("promise resolved");
  }).catch(function() {
    console.log("No books in the database.");
  });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const getByIsbnPromise = new Promise((resolve, reject) => {
    const isbn = req.params.isbn;
    if (books[isbn]) {
      resolve(res.send(books[isbn]));
    } else {
      reject(res.send("ISBN not found"));
    }
  });

  
  getByIsbnPromise.then(function() {
    console.log("promise resolved");
  }).catch(function() {
    console.log("ISBN not found");
  }); 
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const getByAuthorPromise = new Promise((resolve, reject) => {
    const author = req.params.author;
    let return_books = [];
    for (var key in books) {
      if (books[key].author === author) {
        return_books.push(books[key]);
      }
    }
    if (return_books.length > 0) {
      resolve(res.send(return_books));
    } else {
      reject(res.send("No book with that author found."));
    }
  });
  
  getByAuthorPromise.then(function() {
    console.log("promise resolved");
  }).catch(function() {
    console.log("No book with that author found");
  });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const getByTitlePromise = new Promise((resolve, reject) => {
    const title = req.params.title;
    let return_books = []
    for (var key in books) {
      if (books[key].title === title) {
        return_books.push(books[key]);
      }
    }
    if (return_books.length > 0) {
      resolve(res.send(return_books));
    } else {
      reject(res.send("No book with that title found."));
    }
  });
  
  getByTitlePromise.then(function() {
    console.log("promise resolved");
  }).catch(function() {
    console.log("No book with that title found");
  });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const getReviewsPromise = new Promise((resolve, reject) => {
    const isbn = req.params.isbn;
    if (books[isbn]) {
      resolve(res.send(books[isbn].reviews));
    } else {
      reject(res.send("ISBN not found"));
    }
  });
  
  getReviewsPromise.then(function() {
    console.log("promise resolved");
  }).catch(function() {
    console.log("ISBN not found");
  });
});

module.exports.general = public_users;
