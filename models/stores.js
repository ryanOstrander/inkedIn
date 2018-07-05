const db = require('../config/database');

module.exports = {
    get_Stores_By_Id: function(id, callback) {
        return db.query("select * from inkedIn.stores where id=?", [id], callback);
    }

}