const db = require('../config/database');

module.exports = {
    get_Store_Addresses_By_Id: function(id, callback) {
        return db.query("select * from inkedIn.store_addresses where id=?", [id], callback);
    }

}