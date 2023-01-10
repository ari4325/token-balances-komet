require('dotenv').config();
const bodyParser = require("body-parser");
const cors = require("cors");

const express = require('express');
const app = express();

require('./startup/routes')(app);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log("App listening to port: "+PORT);
});