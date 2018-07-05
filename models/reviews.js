const db = require('../config/database');

module.exports = {
    get_Reviews_By_Id: function(id, callback) {
        return db.query("select * from inkedIn.reviews where id=?", [id], callback);
    }

}