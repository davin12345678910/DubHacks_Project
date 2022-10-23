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

//Here we will want to add the rest of the code for our server
async function getDBConnection1() {
  const db = await sqlite.open({
    filename: 'students.db',
    driver: sqlite3.Database
  });
  return db;
}

async function getDBConnection2() {
  const db = await sqlite.open({
    filename: 'teachers.db',
    driver: sqlite3.Database
  });
  return db;
}


app.get('/budget/students/:wordsStudent', async (req, res) => {
  let currentDataBase = await getDBConnection1();
  // This is the username in which we will be getting information from
  let keywords = req.params.wordsStudent;
  // If the username is undefined, we will let the user know to input it
  if (keywords === undefined) {
    res.type('text').status(userError)
      .send("Missing one or more of the required params.");
  } else {
    try {
      let queryGetAll = "SELECT name, question, budget FROM " +
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


app.get('/budget/teachers/:wordsTeacher', async (req, res) => {
  let currentDataBase = await getDBConnection2();
  // This is the username in which we will be getting information from
  let keywords = req.params.wordsTeacher;
  // If the username is undefined, we will let the user know to input it
  if (keywords === undefined) {
    res.type('text').status(userError)
      .send("Missing one or more of the required params.");
  } else {
    try {
      let queryGetAll = "SELECT name, question, budget FROM " +
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
 app.post('/budget/students', async (req, res) => {
  const userError = 400;
  const serverError = 500;

  // This is the database
  let currentDataBase = await getDBConnection1();

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
 * This will update the number of likes and will also return the number of likes
 */
 app.post('/budget/students', async (req, res) => {
  const userError = 400;
  const serverError = 500;

  // This is the database
  let currentDataBase = await getDBConnection1();

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
 * This will update the number of likes and will also return the number of likes
 */
app.post('/yipper/likes', async (req, res) => {
  let currentDataBase = await getDBConnection();
});



app.use(express.static('public'));

const DEFAULT_PORT = 8000;

const PORT = process.env.PORT || DEFAULT_PORT;

app.listen(PORT);