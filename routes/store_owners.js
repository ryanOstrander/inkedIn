const express = require('express');
const mysql = require('mysql');
const router = express.Router();
const db = require('../config/database');
const store_owners_model = require('../models/store_owners');
const app = express();

//SHOWS LIST OF store_owners
app.get('/', (req, res, next) => {
    req.getConnection((error, conn) => {
        conn.query('SELECT * FROM inkedIn.store_owners ORDER BY id DESC', (err, rows, fields) => {
            if (err) {
                req.flash('error', err);
                res.render('store_owners/list', {
                    title: 'Store Owner List',
                    data: ''
                })
            } else {
                res.render('store_owners/list', {
                    title: 'Store Owner List',
                    data: rows
                })
            }
        })
    })
})

// SHOW ADD USER FORM
app.get('/add', (req, res, next) => {
    res.render('store_owners/add', {
        title: 'Add New Store Owner',
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
        var store_owner = {
            first_name: req.sanitize('first_name').escape().trim(),
            last_name: req.sanitize('last_name').escape().trim(),
            email: req.sanitize('email').escape().trim()
        }

        req.getConnection((error, conn) => {
            conn.query('INSERT INTO inkedIn.store_owners SET ?', store_owner, (err, result) => {
                if (err) {
                    req.flash('error', err);

                    res.render('store_owners/add', {
                        title: 'Add New Store Owner',
                        first_name: store_owner.first_name,
                        last_name: store_owner.last_name,
                        email: store_owner.email
                    })
                } else {
                    req.flash('Success!', 'Data added successfully!')

                    res.render('store_owners/add', {
                        title: 'Add New Store Owner',
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

        res.render('store_owners/add', {
            title: 'Add New Store Owner',
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email
        })
    }
})

// SHOW EDIT USER FORM
app.get('/edit/(:id)', (req, res, next) => {
    req.getConnection((error, conn) => {
        conn.query('SELECT * FROM inkedIn.store_owners WHERE id = ' + req.params.id, (err, rows, fields) => {
            if (err) throw err;
            if (rows.length <= 0) {
                req.flash('error', 'Store Owner not found with id = ' + req.params.id);
                res.redirect('/store_owners');
            }
            else {
                res.render('store_owners/edit', {
                    title: 'Edit Store Owner',
                    id: rows[0].id,
                    first_name: rows[0].first_name,
                    last_name: rows[0].last_name,
                    email: rows[0].email
                })
            }
        })
    })
})

// EDIT USER POST ACTION
app.put('./edit/(:id)', (req, res, next) => {
    req.assert('first_name', 'First name is required.').notEmpty();
    req.assert('last_name', 'Last name is required. ').notEmpty();
    req.assert('email', 'A valid email is required').isEmail();
    
    var errors = req.validationErrors();

    if(!errors) {
        var store_owner = {
            first_name: req.sanitize('first_name').escape().trim(),
            last_name: req.sanitize('last_name').escape().trim(),
            email: req.sanitize('email').escape().trim()
        }

        req.getConnection((error, conn) => {
            conn.query('UPDATE inkedIn.store_owners SET ? WHERE id = ' + req.params.id, store_owner, (err, result) => {
                if (err) {
                    req.flash('error', err);

                    res.render('store_owners/edit', {
                        title: 'Edit Store Owner',
                        id: req.params.id,
                        first_name: req.body.first_name,
                        last_name: req.body.last_name,
                        email: req.body.email
                    })
                } else {
                    req.flash('success', 'Data updated successfully!');
                    
                    res.render('store_owners/edit', {
                        title: 'Edit Store Owner',
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

        res.render('store_owners/edit', {
            title: 'Edit Store Owner',
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
        conn.query('DELETE FROM inkedIn.store_owners WHERE id = ' + req.params.id, user, (err, result) => {
            if (err) {
                req.flash('error', err);
                res.redirect('/store_owners');
            } else {
                req.flash('success', 'User has been successfully deleted! id = ' + req.params.id);
                res.redirect('/store_owners');
            }
        })
    })
})


module.exports = app;