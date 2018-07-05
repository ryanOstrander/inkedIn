const db = require('../config/database');

module.exports = {
    get_Store_Owners_By_Id: function(id, callback) {
        return db.query("select * from inkedIn.store_owners where id=?", [id], callback);
    },
};