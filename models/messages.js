const db = require('../config/database');

module.exports = {
    get_messages_By_Id: function(id, callback) {
        return db.query("select * from inkedIn.message where id=?", [id], callback);
    }

}