const db = require('../config/database');

module.exports = {
    get_Customers_By_Id: function(id, callback) {
        return db.query("select * from inkedIn.customers where id=?", [id], callback);
    }

}