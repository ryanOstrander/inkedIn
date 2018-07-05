const db = require('../config/database');

module.exports = {
    get_Image_Collection_By_Id: function(id, callback) {
        return db.query("select * from inkedIn.image_collection where id=?", [id], callback);
    }

}