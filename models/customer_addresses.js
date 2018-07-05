const db = require('../config/database');

module.exports = {
    get_Customer_Addresses_By_Id: function(id, callback) {
        return db.query("select * from inkedIn.customer_addresses where id=?", [id], callback);
    }

}