const bodyParser = require("body-parser");
const cors = require("cors");
const balancesController = require("../controller/balancesController");

module.exports = (app) => {
    app.use(cors());
    app.use(bodyParser.json());
    app.get('/balances', balancesController.fetchBalances);
}