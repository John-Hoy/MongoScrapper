////////////////////
// dependencies
////////////////////

const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const path = require("path");
const app = require("express");
const exphbs = require("express-handlebars");

////////////////////
// scrapper's
////////////////////

const request = require("request");
const cheerio = require("cheerio");

////////////////////
// port
////////////////////

const port = process.env.PORT || 3000