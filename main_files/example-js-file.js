/*
 * Name: Davin Win Kyi
 * Date: May 21, 2022
 * Section: CSE 154 AH
 * This is the JavaScript server code for yipper.
 * This will allow us to get the needed information for the yipper website
 * such as user data, the current post, the number of likes, as well as adding
 * on new posts
 */
// We will need this for JS files in CSE 154
"use strict";
const express = require('express');
const app = express();
// For multer:
const multer = require("multer");
// for application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true})); // built-in middleware
// for application/json
app.use(express.json()); // built-in middleware
// for multipart/form-data (required with FormData)
app.use(multer().none()); // requires the "multer" module
/**
 * This is needed in order to run our sql statements that
 * will allow us to update our database
 */
const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');
/**
 * This establishes a connection to the database that we will be working with
 * @returns {const} - the database object that we will be working with
 */
async function getDBConnection() {
  const db = await sqlite.open({
    filename: 'yipper.db',
    driver: sqlite3.Database
  });
  return db;
}
/**
 * this endpoint will either give us all of the yips in the database
 * or will give us the posts of a certain search query
 */
app.get('/yipper/yips', async (req, res) => {
  const serverError = 500;
  // This is the database
  let currentDataBase = await getDBConnection();
  // this is the search query in which we will be looking for
  let searchQuery = req.query.search;
  // this is the case when we did not pass in something for the query
  if (searchQuery === undefined) {
    // If there is no error, we will return the current post that we have
    try {
      let queryGetAll = "SELECT id, name, yip, hashtag, likes," +
      " date FROM yips ORDER BY DATETIME(date) DESC;";
      let allQueries = await currentDataBase.all(queryGetAll);
      res.type('json').send({"yips": allQueries});
    // If we run into an error we will return an error
    } catch (error) {
      res.type('text')
        .status(serverError)
        .send("An error occurred on the server. Try again later.");
    }
  // This is the case if the searchQuery is defined
  } else {
    try {
      let queryGetAll = "SELECT id FROM yips " +
      "WHERE yip LIKE ? ORDER BY id;";
      let yipValue = "%" + searchQuery + "%";
      let allQueries = await currentDataBase.all(queryGetAll, [yipValue]);
      res.type('json').send({"yips": allQueries});
    // If we run into an error we will retrun a message for error
    } catch (error) {
      res.type('text')
        .status(serverError)
        .send("An error occurred on the server. Try again later.");
    }
  }
});
/**
 * This will allow us to get the information of a certain user with a given id
 */
app.get('/yipper/user/:user', async (req, res) => {
  const userError = 400;
  const serverError = 500;
  // This is the database in which we will be using
  let currentDataBase = await getDBConnection();
  // This is the username in which we will be getting information from
  let userName = req.params.user;
  // If the username is undefined, we will let the user know to input it
  if (userName === undefined) {
    res.type('text').status(userError)
      .send("Missing one or more of the required params.");
  } else {
    try {
      let queryGetAll = "SELECT name, yip, hashtag, date FROM yips " +
      "WHERE name = ? ORDER BY DATETIME(date) DESC;";
      let allQueries = await currentDataBase.all(queryGetAll, [userName]);
      // If there are nothing for the given user, that means that the user does not exist
      if (allQueries.length === 0) {
        res.type('text').send("Yikes. User does not exist.");
        // This is the case if the user does exist
      } else {
        res.type('json').send(allQueries);
      }
    // This is the case if we run into a server error
    } catch (error) {
      res.type('text')
        .status(serverError)
        .send("An error occurred on the server. Try again later.");
    }
  }
});
/**
 * This will update the number of likes and will also return the number of likes
 */
app.post('/yipper/likes', async (req, res) => {
  const userError = 400;
  const serverError = 500;
  // This is the database
  let currentDataBase = await getDBConnection();
  // This is the case in which the user did not input a body param, so we will return an error
  if (req.body.id === undefined) {
    // Here we will give an error message
    res.type('text').status(userError)
      .send("Missing one or more of the required params.");
  } else {
    // This is to make sure that the given id is valid or not
    let idCheckValid = "";
    try {
      // Here we call a query to get the results of the id
      idCheckValid = await getIDResults(currentDataBase, req.body.id);
    // This is the case if we get a server error
    } catch (error) {
      res.type('text').status(serverError)
        .send("An error occurred on the server. Try again later.");
    }
    // If the id does not have any results, it means the user does not exist in the db
    if (idCheckValid > 0) {
      res.type('text')
        .send("Yikes. ID does not exist.");
    // This is the case if the id does exist
    } else {
      // Here we will be getting the number of likes
      try {
        let newValue =
          await getUpdatedNumberOfLikesAndUpdateDataBaseLikes(currentDataBase, req.body.id);
        res.type('text').send("" + newValue);
      // This is the case in which we ran into a server error
      } catch (error) {
        res.type('text').status(serverError)
          .send("An error occurred on the server. Try again later.");
      }
    }
  }
});
/**
 * This will allow us to insert in a new post and will return the post we inserted
 */
app.post('/yipper/new', async (req, res) => {
  const userError = 400;
  const serverError = 500;
  // This gets the current database
  let currentDB = await getDBConnection();
  // Here we will check if we got all the body parameters required
  if (req.body.name === undefined || req.body.full === undefined) {
    res.type('text').status(userError)
      .send("Missing one or more of the required params.");
  } else {
    let allQueries = await getAllQueries(currentDB, req.body.name);
    // This is the case if the if the user is not in the database
    if (allQueries.length === 0) {
      res.type('text').status(userError)
        .send("Yikes. User does not exist.");
    // This is the case if the user is in the database
    } else {
      try {
        let validation = validRegExp(req.body.full);
        // This is the case if the full was not valid
        if (validation === null) {
          res.type('text')
            .send("Yikes. Yip format is invalid.");
        // This is the case if the full is valid
        } else {
          let result = await insertAndReturnElement(currentDB, req.body.name, req.body.full);
          res.type('json').send(result);
        }
      // This is the case in which we get a server error
      } catch (error) {
        res.type('text')
          .status(serverError)
          .send("An error occurred on the server. Try again later.");
      }
    }
  }
});
/**
 * this will update the number of likes as well as update the number of likes in the database
 * @param {let} currentDataBase This is the current database in which we are working with
 * @param {let} idLikes This is the id of the thing in which we are working with
 * @returns {let} The new value of the post in which we are curently on
 */
async function getUpdatedNumberOfLikesAndUpdateDataBaseLikes(currentDataBase, idLikes) {
  let newValue = await updatedNumberOfLikes(currentDataBase, idLikes);
  await updateLikesInDataBase(currentDataBase, newValue, idLikes);
  return newValue;
}
/**
 * this will method will give us all of the post of the current id given
 * @param {let} currentDataBase This is the current database in which we are working with
 * @param {let} idLikes This is the id of the thing in which we will update the likes for
 * @returns {let[]} This will give us all of the posts for a certain id
 */
async function getIDResults(currentDataBase, idLikes) {
  let idResults = "SELECT* FROM yips WHERE id = ?;";
  let idCheckValid = await currentDataBase.all(idResults, [idLikes]);
  return idCheckValid;
}
/**
 * this will give us the updated number of likes for the current database we are on
 * @param {let} currentDataBase this is the database in which we will be updating
 * @param {let} idLikes This is the id of the thing in which we will be changing likes for
 * @returns {let} returns the new number of likes
 */
async function updatedNumberOfLikes(currentDataBase, idLikes) {
  // This is what we will ask to get the current number of likes
  let queryGetLikes = "SELECT* FROM yips " +
  "WHERE id= ?;";
  let allQueries = await currentDataBase.get(queryGetLikes, [idLikes]);
  // Here we will update our variable for the number of likes
  let newValue = allQueries['likes'] + 1;
  return newValue;
}
/**
 * This will update the number of likes of the given id in the database
 * @param {let} currentDataBase This is the current database in which we are working with
 * @param {let} newValue This is the new value in which we will, be inserting
 * @param {let} idLikes This is the id og the thing in which we will be updating the likes for
 */
async function updateLikesInDataBase(currentDataBase, newValue, idLikes) {
  let updateQuery = "UPDATE yips SET likes = ?" +
  " WHERE id= ?;";
  await currentDataBase.run(updateQuery, [newValue, idLikes]);
}
/**
 * This will tell us if we have a valid regExp or not
 * @param {let} full This is the text that we will be validating
 * @returns {let} If the regExp is valid or not
 */
function validRegExp(full) {
  const input = full;
  const regExp = /^[a-zA-Z\d\s_.!?]+\s#\S+$/;
  const validFull = input.match(regExp);
  return validFull;
}
/**
 * This will give us all of the queries for a name
 * @param {let} currentDataBase This is the current database in which we are working with
 * @param {let} name This will e the queries of a certain dog in which you will be getting
 * @returns {let} Returns all the posts of this dog
 */
async function getAllQueries(currentDataBase, name) {
  let queryGetAll = "SELECT name, yip, hashtag, date FROM yips " +
  "WHERE name = ? ORDER BY DATETIME(date) DESC;";
  let allQueries = await currentDataBase.all(queryGetAll, [name]);
  return allQueries;
}
/**
 * this will insert and return the element that was just inserted in
 * @param {let} currentDB This is the current database in which we are working with
 * @param {let} name This is the name of the dog who is posting
 * @param {let} full this is the yip and hashtag of the post
 * @returns {let} Will give the element in which we just added in
 */
async function insertAndReturnElement(currentDB, name, full) {
  let result = await insertElementResult(currentDB, name, "" + full);
  // Here we are going to get the elmenet that we just addded into the database
  let addedElementJson = await getAddedElement(currentDB, result);
  return addedElementJson;
}
/**
 * This will allow us to insert in a new post
 * @param {let} currentDataBase This is the current database in which we are working with
 * @param {let} name this is the name of the current dog
 * @param {let} full Thisn is the place where you will get the hashtag and the yip
 * @returns {let} This will give us the information needed to get the id of the thing
 * that we just inserted in
 */
async function insertElementResult(currentDataBase, name, full) {
  // Here we will be getting the yip and the hashtag
  let yip = "";
  let hashtag = "";
  // Here we will do the needed parsin to get the yip and the hashtag
  let indexHash = full.indexOf("#");
  yip = full.substring(0, indexHash).trim();
  hashtag = full.substring(indexHash + 1);
  // Here we will be inserting in the new post
  let addPost = "INSERT INTO yips(name, yip, hashtag, likes) " +
  "VALUES(?, ?, ?, ?);";
  // Here we will add the post in
  let result = await currentDataBase.run(addPost, [name, yip, hashtag, 0]);
  return result;
}
/**
 * This will gie us the elmeent that we just inserted in
 * @param {let} currentDataBase This is the current database
 * @param {let} result This is the object that we will get the current post's id from
 * @returns {let} This will give us the element that we just inserted in
 */
async function getAddedElement(currentDataBase, result) {
  // This is the id of the thing in which we just inserted in
  let currentID = result.lastID;
  // Here is the query
  let addedElement = "SELECT id, name, yip, hashtag, likes, date FROM yips WHERE id= ?;";
  // Here you will execute the query, and get the json from it, and then send it
  let addedElementJson = await currentDataBase.get(addedElement, [currentID]);
  return addedElementJson;
}
/**
 * You want to have a constant port, so
 * that you listen from many different PORTS
 */
app.use(express.static('public'));
const DEFAULT_PORT = 8000;
const PORT = process.env.PORT || DEFAULT_PORT;
app.listen(PORT);
