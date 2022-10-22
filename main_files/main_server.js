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



app.use(express.static('public'));

const DEFAULT_PORT = 8000;

const PORT = process.env.PORT || DEFAULT_PORT;

app.listen(PORT);