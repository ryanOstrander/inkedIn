const db = require('../config/database');

module.exports = {
    get_Artists_Categories_By_Id: function(id, callback) {
        return db.query("select * from inkedIn.artist_categories where id=?", [id], callback);
    }

}