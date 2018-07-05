const express = require('express');
const router = express.Router();
const store_addresses_model = require('../models/store_addresses');
const app = express();

//SHOWS LIST OF store_addresses
app.get('/', (req, res, next) => {
    req.getConnection((error, conn) => {
        conn.query('SELECT * FROM inkedIn.store_addresses ORDER BY id DESC', (err, rows, fields) => {
            if (err) {
                req.flash('error', err);
                res.render('store_addresses/list', {
                    title: 'Store Address List',
                    data: ''
                })
            } else {
                res.render('store_addresses/list', {
                    title: 'Store Address List',
                    data: rows
                })
            }
        })
    })
})

// SHOW ADD USER FORM
app.get('/add', (req, res, next) => {
    res.render('store_addresses/add', {
        title: 'Add New Store Address',
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
        var store_address = {
            address: req.sanitize('address').escape().trim(),
            address2: req.sanitize('address2').escape().trim(),
            city: req.sanitize('city').escape().trim(),
            state: req.sanitize('state').escape().trim(),
            zip_code: req.sanitize('zip_code').escape().trim()
        }

        req.getConnection((error, conn) => {
            conn.query('INSERT INTO inkedIn.store_addresses SET ?', store_address, (err, result) => {
                if (err) {
                    req.flash('error', err);

                    res.render('store_addresses/add', {
                        title: 'Add Store Address',
                        address: store_addresses.address,
                        address2: store_addresses.address2,
                        city: store_addresses.city,
                        state: store_addresses.state,
                        zip_code: store_addresses.zip_code
                    })
                } else {
                    req.flash('Success!', 'Data added successfully!')

                    res.render('store_addresses/add', {
                        title: 'Add Store Address',
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

        res.render('store_addresses/add', {
            title: 'Add Store Address',
            address: store_addresses.address,
            address2: store_addresses.address2,
            city: store_addresses.city,
            state: store_addresses.state,
            zip_code: store_addresses.zip_code
        })
    }
})

// SHOW EDIT USER FORM
app.get('/edit/(:id)', (req, res, next) => {
    req.getConnection((error, conn) => {
        conn.query('SELECT * FROM inkedIn.store_addresses WHERE id = ' + req.params.id, (err, rows, fields) => {
            if (err) throw err;
            if (rows.length <= 0) {
                req.flash('error', 'Store Address not found with id = ' + req.params.id);
                res.redirect('/store_addresses');
            }
            else {
                res.render('store_addresses/edit', {
                    title: 'Edit store_address',
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
    req.assert('address', 'Last name is required. ').notEmpty();
    req.assert('city', 'A city is required').notEmpty();
    req.assert('state', 'A State is required.').notEmpty();
    req.assert('zip_code', 'A zip code is required.').notEmpty();
    
    var errors = req.validationErrors();

    if(!errors) {
        var store_address = {
            address: req.sanitize('address').escape().trim(),
            address2: req.sanitize('address2').escape().trim(),
            city: req.sanitize('city').escape().trim(),
            state: req.sanitize('state').escape().trim(),
            zip_code: req.sanitize('zip_code').escape().trim()
        }

        req.getConnection((error, conn) => {
            conn.query('UPDATE inkedIn.store_addresses SET ? WHERE id = ' + req.params.id, store_address, (err, result) => {
                if (err) {
                    req.flash('error', err);

                    res.render('store_addresses/edit', {
                        title: 'Edit Store Address',
                        id: req.params.id,
                        address: req.body.address,
                        address2: req.body.address2,
                        city: req.body.city,
                        state: req.body.state,
                        zip_code: req.body.zip_code
                    })
                } else {
                    req.flash('success', 'Data updated successfully!');
                    
                    res.render('store_addresses/edit', {
                        title: 'Edit Store Address',
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

        res.render('store_addresses/edit', {
            title: 'Edit Store Address',
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
    var store_address = { id: req.params.id }

    req.getConnection((error, conn) => {
        conn.query('DELETE FROM inkedIn.store_addresses WHERE id = ' + req.params.id, store_address, (err, result) => {
            if (err) {
                req.flash('error', err);
                res.redirect('/store_addresses');
            } else {
                req.flash('success', 'Address has been successfully deleted! id = ' + req.params.id);
                res.redirect('/store_addresses');
            }
        })
    })
})


module.exports = app;