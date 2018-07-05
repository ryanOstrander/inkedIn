var mysql = require('mysql');

// Create connection
const db = mysql.createConnection({
    host     : '54.202.126.159',
    user     : 'ryan',
    password : 'stanton81',
    database : 'inkedIn'
});

// Connect
db.connect((err) => {
    if(err){
        throw err;
    }
    console.log('MySQL Connected...');
});

module.exports = db;