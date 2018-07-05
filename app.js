const express = require('express');
const mysql = require('mysql');
const app = express();
const db = require('./config/database');

const config = require('./config/config');
const dbOptions = {
    host: config.database.host,
    user: config.database.user,
    password: config.database.password,
    port: config.database.port,
    database: config.database.db
}

const myConnection = require('express-myconnection');
app.use(myConnection(mysql, dbOptions, 'pool'));
app.set('view engine', 'ejs');

const expressValidator = require('express-validator');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const index = require('./public/index');
const store_owners_route = require('./routes/store_owners');
const stores_route = require('./routes/stores');
const stores_addresses_route = require('./routes/store_addresses');
const reviews_route = require('./routes/reviews');
const messages_route = require('./routes/messages');
const image_collection_route = require('./routes/image_collection');
const customers_route = require('./routes/customers');
const customer_addresses_route = require('./routes/customer_addresses');
const artists_route = require('./routes/artists');
const artist_categories_route = require('./routes/artist_categories');

const port = 3000;

app.use(expressValidator());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      var method = req.body._method
      delete req.body._method
      return method
    }
  }));
  
app.use(cookieParser('keyboard cat'));
app.use(session({ 
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}));
app.use(flash());

app.listen(port, () => {
    console.log('Server started on port ' + port)
});

app.use('/', index);
app.use('/customers', customers_route);
app.use("/store_owner", store_owners_route);
app.use("/stores", stores_route);
