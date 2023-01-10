require('dotenv').config();
const bodyParser = require("body-parser");
const cors = require("cors");

const express = require('express');
const app = express();

require('./startup/routes')(app);
app.get('/', async (req, res) => {
    res.status(200).send({
        "message": "Welcome to Komet"
    })
})

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log("App listening to port: "+PORT);
});