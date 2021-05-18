////////////////////////////
///DEPENDENCIES///
//////////////////////////
//get .env variables
require("dotenv").config();
//pull PORT from .env, give default value of 4000
const {PORT = 3000, MONGODB_URL} = process.env;

//import EXPRESS////////
const express = require("express");

//create application object/////
const app = express();

///Import Mongoose////////////
const mongoose = require("mongoose");

///////////////////////////////////
//Import Middleware//////
//////////////////////////////////
const cors = require("cors");
const morgan = require("morgan");

////////////////////////////////////
//DATBASE CONNECTION
///////////////////////////////////
//Establish Connection
mongoose.connect(MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});

//Connection events////
mongoose.connection
.on("open", () => console.log("You are connected to mongoose"))
.on("close", () => console.log("You are disconnected from mongoose"))
.on("error", (error)=> console.log(error));


//////////////////////////////////////
//Mounting Middleware/////
////////////////////////////////////
app.use(cors()); // to prevent cors errors, open access to all origins
app.use(morgan("dev")); //logging messages
app.use(express.json()); //parse json body data

///////////////////////////
//ROUTES/////////
////////////////////////////
//create a test routes
app.get("/", (req, res) => {
      res.send("hello world");
});
//Cheese Index Route/////
app.get("/cheese", async(req, res) => {
    try {
        //send all cheese data
        res.json(await Cheese.find({}));
    } catch (error) {
        //send error
        res.status(400).json(error);
    }
});

//Cheese create Route
app.post("/cheese", async (req, res) => {
    try{
        //send new cheese data
        res.json(await Cheese.create(req.body));
    } catch (error) {
        //send error msg.
        res.status(400).json(error);
    }
});

//Cheese Update Route

app.put("/cheese/:id", async(req, res) => {
    try {
        //send update info
        res.json( await Cheese.findByIdAndUpdate(req.params.id, req.body, {new: true})); 
        
    } catch (error) {
        //send error
        res.status(400).json(error);
    }
});

//Cheese Delete Route
app.delete("/cheese/:id", async (req, res) => {
    try {
        //send all cheese
        res.json(await Cheese.findByIdAndRemove(req.params.id));

    } catch (error) {
        //send error
        res.status(400).json(error);
    }
});

///////////////////////////////////
//MODELS///////////
//////////////////////////////////
const CheeseSchema = new mongoose.Schema({
    name: String,
    countryOfOrigin: String,
    image: String,
});

const Cheese = mongoose.model("Cheese", CheeseSchema);

/////////////////////////////////////
//LISTENER////////////////////
/////////////////////////////////////
app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));