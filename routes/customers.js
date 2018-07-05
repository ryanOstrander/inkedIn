const express = require('express');
const router = express.Router();
const customers_model = require('../models/customers');
const app = express();

//SHOWS LIST OF CUSTOMERS
app.get('/', (req, res, next) => {
    req.getConnection((error, conn) => {
        conn.query('SELECT * FROM inkedIn.customers ORDER BY id DESC', (err, rows, fields) => {
            if (err) {
                req.flash('error', err);
                res.render('customers/list', {
                    title: 'Customer List',
                    data: ''
                })
            } else {
                res.render('customers/list', {
                    title: 'Customer List',
                    data: rows
                })
            }
        })
    })
})

// SHOW ADD USER FORM
app.get('/add', (req, res, next) => {
    res.render('customers/add', {
        title: 'Add New Customer',
        first_name: '',
        last_name: '',
        email: ''
    })
})

// ADD NEW USER POST ACTION
app.post('/add', (req, res, next) => {
    req.assert('first_name', 'First name is required.').notEmpty();
    req.assert('last_name', 'Last name is required. ').notEmpty();
    req.assert('email', 'A valid email is required').isEmail();

    var errors = req.validationErrors();

    if (!errors) {
        var customer = {
            first_name: req.sanitize('first_name').escape().trim(),
            last_name: req.sanitize('last_name').escape().trim(),
            email: req.sanitize('email').escape().trim()
        }

        req.getConnection((error, conn) => {
            conn.query('INSERT INTO inkedIn.customers SET ?', customer, (err, result) => {
                if (err) {
                    req.flash('error', err);

                    res.render('customers/add', {
                        title: 'Add New Customer',
                        first_name: customer.first_name,
                        last_name: customer.last_name,
                        email: customer.email
                    })
                } else {
                    req.flash('Success!', 'Data added successfully!')

                    res.render('customers/add', {
                        title: 'Add New Customer',
                        first_name: '',
                        last_name: '',
                        email: ''
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

        res.render('customers/add', {
            title: 'Add New Customer',
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email
        })
    }
})

// SHOW EDIT USER FORM
app.get('/edit/(:id)', (req, res, next) => {
    req.getConnection((error, conn) => {
        conn.query('SELECT * FROM inkedIn.customers WHERE id = ' + req.params.id, (err, rows, fields) => {
            if (err) throw err;
            if (rows.length <= 0) {
                req.flash('error', 'Customer not found with id = ' + req.params.id);
                res.redirect('/customers');
            }
            else {
                res.render('customers/edit', {
                    title: 'Edit Customer',
                    id: rows[0].id,
                    first_name: rows[0].first_name,
                    last_name: rows[0].last_name,
                    email: rows[0].email
                })
            }
        })
    })
})

// EDIT USER PUT ACTION
app.put('./edit/(:id)', (req, res, next) => {
    req.assert('first_name', 'First name is required.').notEmpty();
    req.assert('last_name', 'Last name is required. ').notEmpty();
    req.assert('email', 'A valid email is required').isEmail();
    
    var errors = req.validationErrors();

    if(!errors) {
        var customer = {
            first_name: req.sanitize('first_name').escape().trim(),
            last_name: req.sanitize('last_name').escape().trim(),
            email: req.sanitize('email').escape().trim()
        }

        req.getConnection((error, conn) => {
            conn.query('UPDATE inkedIn.customers SET ? WHERE id = ' + req.params.id, customer, (err, result) => {
                if (err) {
                    req.flash('error', err);

                    res.render('customers/edit', {
                        title: 'Edit Customer',
                        id: req.params.id,
                        first_name: req.body.first_name,
                        last_name: req.body.last_name,
                        email: req.body.email
                    })
                } else {
                    req.flash('success', 'Data updated successfully!');
                    
                    res.render('customers/edit', {
                        title: 'Edit Customer',
                        id: req.params.id,
                        first_name: req.body.first_name,
                        last_name: req.body.last_name,
                        email: req.body.email
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

        res.render('customers/edit', {
            title: 'Edit Customer',
            id: req.params.id,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email
        })
    }
})

//DELETE USER POST ACTION
app.delete('/delete/(:id)', () => {
    var user = { id: req.params.id }

    req.getConnection((error, conn) => {
        conn.query('DELETE FROM inkedIn.customers WHERE id = ' + req.params.id, user, (err, result) => {
            if (err) {
                req.flash('error', err);
                res.redirect('/customers');
            } else {
                req.flash('success', 'User has been successfully deleted! id = ' + req.params.id);
                res.redirect('/customers');
            }
        })
    })
})


module.exports = app;