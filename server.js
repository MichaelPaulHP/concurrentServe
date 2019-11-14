"use strict";
let port = process.env.PORT || 1337;

let express = require("express");
let bodyParser = require("body-parser");
let cors = require("cors");
let firebaseAdmin = require("firebase-admin");
var mongoose = require("mongoose");

let app = express();




// Config   cors
//app.use(cors());

// BodyParser ==============================================================
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


//Routes ==============================================================
var routes = require("./App/Routes");
routes.assignRoutes(app);

// configuration DB ===============================================================

var configDB = require('./Config/database');

mongoose.connect(
    configDB.url,
    { useNewUrlParser: true,useFindAndModify: false },
    function (err) {
        if (err) {
            console.error("ERROR MongoDB: " + err.message);
        }
    }
);

// start server =========================================================
let server = app.listen(port);

// init socketIO serve =========================================================
let io = require("socket.io")(server);


// CONFIG FIREBASE =========================================================
const firebaseConfig = require("./Config/firebase");
firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(firebaseConfig.credential),
    databaseURL: firebaseConfig.databaseURL
});


app.get("/", (req, res) => {
    res.send("GG! Concurrent");
});

// INIT concurrent  =========================================================
let Concurrent =require("./App/Models/Concurrent");
let concurrent= new Concurrent(io);


console.log("GG!");
