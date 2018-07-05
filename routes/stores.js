const express = require('express');
const router = express.Router();
const stores_model = require('../models/stores');
const app = express();

//SHOWS LIST OF stores
app.get('/', (req, res, next) => {
    req.getConnection((error, conn) => {
        conn.query('SELECT * FROM inkedIn.stores ORDER BY id DESC', (err, rows, fields) => {
            if (err) {
                req.flash('error', err);
                res.render('stores/list', {
                    title: 'Store List',
                    data: ''
                })
            } else {
                res.render('stores/list', {
                    title: 'Store List',
                    data: rows
                })
            }
        })
    })
})

// SHOW ADD USER FORM
app.get('/add', (req, res, next) => {
    res.render('stores/add', {
        title: 'Add New Store',
        store_name: '',
        image: '',
        description: ''
    })
})

// ADD NEW USER POST ACTION
app.post('/add', (req, res, next) => {
    req.assert('store_name', 'First name is required.').notEmpty();
    req.assert('image', 'Last name is required. ').notEmpty();
    req.assert('description', 'A valid description is required').notEmpty();

    var errors = req.validationErrors();

    if (!errors) {
        var store = {
            store_name: req.sanitize('store_name').escape().trim(),
            image: req.sanitize('image').escape().trim(),
            description: req.sanitize('description').escape().trim()
        }

        req.getConnection((error, conn) => {
            conn.query('INSERT INTO inkedIn.stores SET ?', store, (err, result) => {
                if (err) {
                    req.flash('error', err);

                    res.render('stores/add', {
                        title: 'Add New Store ',
                        store_name: store.store_name,
                        image: store.image,
                        description: store.description
                    })
                } else {
                    req.flash('Success!', 'Data added successfully!')

                    res.render('stores/add', {
                        title: 'Add New Store',
                        store_name: '',
                        image: '',
                        description: ''
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

        res.render('stores/add', {
            title: 'Add New Store',
            store_name: req.body.store_name,
            image: req.body.image,
            description: req.body.description
        })
    }
})

// SHOW EDIT USER FORM
app.get('/edit/(:id)', (req, res, next) => {
    req.getConnection((error, conn) => {
        conn.query('SELECT * FROM inkedIn.stores WHERE id = ' + req.params.id, (err, rows, fields) => {
            if (err) throw err;
            if (rows.length <= 0) {
                req.flash('error', 'Store Owner not found with id = ' + req.params.id);
                res.redirect('/stores');
            }
            else {
                res.render('stores/edit', {
                    title: 'Edit Store Owner',
                    id: rows[0].id,
                    store_name: rows[0].store_name,
                    image: rows[0].image,
                    description: rows[0].description
                })
            }
        })
    })
})

// EDIT USER POST ACTION
app.put('./edit/(:id)', (req, res, next) => {
    req.assert('store_name', 'First name is required.').notEmpty();
    req.assert('image', 'Last name is required. ').notEmpty();
    req.assert('description', 'A valid description is required').notEmpty();
    
    var errors = req.validationErrors();

    if(!errors) {
        var store = {
            store_name: req.sanitize('store_name').escape().trim(),
            image: req.sanitize('image').escape().trim(),
            description: req.sanitize('description').escape().trim()
        }

        req.getConnection((error, conn) => {
            conn.query('UPDATE inkedIn.stores SET ? WHERE id = ' + req.params.id, store, (err, result) => {
                if (err) {
                    req.flash('error', err);

                    res.render('stores/edit', {
                        title: 'Edit Store',
                        id: req.params.id,
                        store_name: req.body.store_name,
                        image: req.body.image,
                        description: req.body.description
                    })
                } else {
                    req.flash('success', 'Data updated successfully!');
                    
                    res.render('stores/edit', {
                        title: 'Edit Store',
                        id: req.params.id,
                        store_name: req.body.store_name,
                        image: req.body.image,
                        description: req.body.description
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

        res.render('stores/edit', {
            title: 'Edit Store',
            id: req.params.id,
            store_name: req.body.store_name,
            image: req.body.image,
            description: req.body.description
        })
    }
})

//DELETE USER POST ACTION
app.delete('/delete/(:id)', () => {
    var store = { id: req.params.id }

    req.getConnection((error, conn) => {
        conn.query('DELETE FROM inkedIn.stores WHERE id = ' + req.params.id, store, (err, result) => {
            if (err) {
                req.flash('error', err);
                res.redirect('/stores');
            } else {
                req.flash('success', 'Store has been successfully deleted! id = ' + req.params.id);
                res.redirect('/stores');
            }
        })
    })
})


module.exports = app;