const express = require('express');
const router = express.Router();
const customer_addresses_model = require('../models/customer_addresses');
const app = express();

//SHOWS LIST OF customer_addresses
app.get('/', (req, res, next) => {
    req.getConnection((error, conn) => {
        conn.query('SELECT * FROM inkedIn.customer_addresses ORDER BY id DESC', (err, rows, fields) => {
            if (err) {
                req.flash('error', err);
                res.render('customer_addresses/list', {
                    title: 'Customer Address List',
                    data: ''
                })
            } else {
                res.render('customer_addresses/list', {
                    title: 'Customer Address List',
                    data: rows
                })
            }
        })
    })
})

// SHOW ADD USER FORM
app.get('/add', (req, res, next) => {
    res.render('customer_addresses/add', {
        title: 'Add New Customer Address',
        address: '',
        address2: '',
        city: '',
        state: '',
        zip_code: ''
    })
})

// ADD NEW USER POST ACTION
app.post('/add', (req, res, next) => {
    req.assert('address', 'An Address is required. ').notEmpty();
    req.assert('city', 'A City is required').notEmpty();
    req.assert('state', 'A State is required.').notEmpty();
    req.assert('zip_code', 'A zip code is required.').notEmpty();

    var errors = req.validationErrors();

    if (!errors) {
        var customer_address = {
            address: req.sanitize('address').escape().trim(),
            address2: req.sanitize('address2').escape().trim(),
            city: req.sanitize('city').escape().trim(),
            state: req.sanitize('state').escape().trim(),
            zip_code: req.sanitize('zip_code').escape().trim()
        }

        req.getConnection((error, conn) => {
            conn.query('INSERT INTO inkedIn.customer_addresses SET ?', customer_address, (err, result) => {
                if (err) {
                    req.flash('error', err);

                    res.render('customer_addresses/add', {
                        title: 'Add Customer Address',
                        address: customer_addresses.address,
                        address2: customer_addresses.address2,
                        city: customer_addresses.city,
                        state: customer_addresses.state,
                        zip_code: customer_addresses.zip_code
                    })
                } else {
                    req.flash('Success!', 'Data added successfully!')

                    res.render('customer_addresses/add', {
                        title: 'Add Customer Address',
                        address: '',
                        address2: '',
                        city: '',
                        state: '',
                        zip_code: ''
                    })
                }
            })
        })
    }
    else {
        var error_msg = '';
        errors.forEach((error) => {
            error_msg += error.msg + '<br>';
        })
        req.flash('error', error_msg);

        res.render('customer_addresses/add', {
            title: 'Add Customer Address',
            address: customer_addresses.address,
            address2: customer_addresses.address2,
            city: customer_addresses.city,
            state: customer_addresses.state,
            zip_code: customer_addresses.zip_code
        })
    }
})

// SHOW EDIT USER FORM
app.get('/edit/(:id)', (req, res, next) => {
    req.getConnection((error, conn) => {
        conn.query('SELECT * FROM inkedIn.customer_addresses WHERE id = ' + req.params.id, (err, rows, fields) => {
            if (err) throw err;
            if (rows.length <= 0) {
                req.flash('error', 'Customer Address not found with id = ' + req.params.id);
                res.redirect('/customer_addresses');
            }
            else {
                res.render('customer_addresses/edit', {
                    title: 'Edit customer_address',
                    id: rows[0].id,
                    address: rows[0].address,
                    address2: rows[0].address2,
                    city: rows[0].city,
                    state: rows[0].state,
                    zip_code: rows[0].zip_code
                })
            }
        })
    })
})

// EDIT USER POST ACTION
app.put('./edit/(:id)', (req, res, next) => {
    req.assert('address', 'Address is required. ').notEmpty();
    req.assert('city', 'A city is required').notEmpty();
    req.assert('state', 'A State is required.').notEmpty();
    req.assert('zip_code', 'A zip code is required.').notEmpty();
    
    var errors = req.validationErrors();

    if(!errors) {
        var customer_address = {
            address: req.sanitize('address').escape().trim(),
            address2: req.sanitize('address2').escape().trim(),
            city: req.sanitize('city').escape().trim(),
            state: req.sanitize('state').escape().trim(),
            zip_code: req.sanitize('zip_code').escape().trim()
        }

        req.getConnection((error, conn) => {
            conn.query('UPDATE inkedIn.customer_addresses SET ? WHERE id = ' + req.params.id, customer_address, (err, result) => {
                if (err) {
                    req.flash('error', err);

                    res.render('customer_addresses/edit', {
                        title: 'Edit Customer Address',
                        id: req.params.id,
                        address: req.body.address,
                        address2: req.body.address2,
                        city: req.body.city,
                        state: req.body.state,
                        zip_code: req.body.zip_code
                    })
                } else {
                    req.flash('success', 'Data updated successfully!');
                    
                    res.render('customer_addresses/edit', {
                        title: 'Edit Customer Address',
                        id: req.params.id,
                        address: req.body.address,
                        address2: req.body.address2,
                        city: req.body.city,
                        state: req.body.state,
                        zip_code: req.body.zip_code
                    })
                }
            })
        })
    }
    else {
        var error_msg = '';
        errors.forEach((error) => {
            error_msg += error.msg + '<br>';
        })
        req.flash('error', error_msg)

        res.render('customer_addresses/edit', {
            title: 'Edit Customer Address',
            id: req.params.id,
            address: req.body.address,
            address2: req.body.address2,
            city: req.body.city,
            state: req.body.state,
            zip_code: req.body.zip_code

        })
    }
})

//DELETE USER POST ACTION
app.delete('/delete/(:id)', () => {
    var customer_address = { id: req.params.id }

    req.getConnection((error, conn) => {
        conn.query('DELETE FROM inkedIn.customer_addresses WHERE id = ' + req.params.id, user, (err, result) => {
            if (err) {
                req.flash('error', err);
                res.redirect('/customer_addresses');
            } else {
                req.flash('success', 'Address has been successfully deleted! id = ' + req.params.id);
                res.redirect('/customer_addresses');
            }
        })
    })
})


module.exports = app;