const db = require('../config/database');

module.exports = {
    get_Artists_By_Id: function(id, callback) {
        return db.query("select * from inkedIn.artists where id=?", [id], callback);
    }

}