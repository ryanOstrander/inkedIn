const express = require('express');
const router = express.Router();
const artists_model = require('../models/artists');
const app = express();

//SHOWS LIST OF artists
app.get('/', (req, res, next) => {
    req.getConnection((error, conn) => {
        conn.query('SELECT * FROM inkedIn.artists ORDER BY id DESC', (err, rows, fields) => {
            if (err) {
                req.flash('error', err);
                res.render('artists/list', {
                    title: 'Artist List',
                    data: ''
                })
            } else {
                res.render('artists/list', {
                    title: 'Artist List',
                    data: rows
                })
            }
        })
    })
})

// SHOW ADD USER FORM
app.get('/add', (req, res, next) => {
    res.render('artists/add', {
        title: 'Add New Artists',
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
        var artist = {
            first_name: req.sanitize('first_name').escape().trim(),
            last_name: req.sanitize('last_name').escape().trim(),
            email: req.sanitize('email').escape().trim()
        }

        req.getConnection((error, conn) => {
            conn.query('INSERT INTO inkedIn.artists SET ?', artist, (err, result) => {
                if (err) {
                    req.flash('error', err);

                    res.render('artists/add', {
                        title: 'Add New artist',
                        first_name: artist.first_name,
                        last_name: artist.last_name,
                        email: artist.email
                    })
                } else {
                    req.flash('Success!', 'Data added successfully!')

                    res.render('artists/add', {
                        title: 'Add New Artist',
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

        res.render('artists/add', {
            title: 'Add New Artist',
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email
        })
    }
})

// SHOW EDIT USER FORM
app.get('/edit/(:id)', (req, res, next) => {
    req.getConnection((error, conn) => {
        conn.query('SELECT * FROM inkedIn.artists WHERE id = ' + req.params.id, (err, rows, fields) => {
            if (err) throw err;
            if (rows.length <= 0) {
                req.flash('error', 'Artist not found with id = ' + req.params.id);
                res.redirect('/artists');
            }
            else {
                res.render('artists/edit', {
                    title: 'Edit Artist',
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
        var artist = {
            first_name: req.sanitize('first_name').escape().trim(),
            last_name: req.sanitize('last_name').escape().trim(),
            email: req.sanitize('email').escape().trim()
        }

        req.getConnection((error, conn) => {
            conn.query('UPDATE inkedIn.artists SET ? WHERE id = ' + req.params.id, artist, (err, result) => {
                if (err) {
                    req.flash('error', err);

                    res.render('artists/edit', {
                        title: 'Edit Artist',
                        id: req.params.id,
                        first_name: req.body.first_name,
                        last_name: req.body.last_name,
                        email: req.body.email
                    })
                } else {
                    req.flash('success', 'Data updated successfully!');
                    
                    res.render('artists/edit', {
                        title: 'Edit Artist',
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

        res.render('artists/edit', {
            title: 'Edit Artist',
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
        conn.query('DELETE FROM inkedIn.artists WHERE id = ' + req.params.id, user, (err, result) => {
            if (err) {
                req.flash('error', err);
                res.redirect('/artists');
            } else {
                req.flash('success', 'User has been successfully deleted! id = ' + req.params.id);
                res.redirect('/artists');
            }
        })
    })
})


module.exports = app;