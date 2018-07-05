const express = require('express');
const router = express.Router();
const artist_categories_model = require('../models/artist_categories');
const app = express();

//SHOWS LIST OF artist_categories
app.get('/', (req, res, next) => {
    req.getConnection((error, conn) => {
        conn.query('SELECT * FROM inkedIn.artist_categories ORDER BY id DESC', (err, rows, fields) => {
            if (err) {
                req.flash('error', err);
                res.render('artist_categories/list', {
                    title: 'Artist Categories List',
                    data: ''
                })
            } else {
                res.render('artist_categories/list', {
                    title: 'Artist Categories List',
                    data: rows
                })
            }
        })
    })
})

// SHOW ADD artist_category FORM
app.get('/add', (req, res, next) => {
    res.render('artist_categories/add', {
        title: 'Add New Artist Category',
        name: '',
        description: '',
        image: ''
    })
})

// ADD NEW artist_category POST ACTION
app.post('/add', (req, res, next) => {
    req.assert('name', 'A Category name is required.').notEmpty();
    req.assert('description', 'A description is required. ').notEmpty();
    req.assert('image', 'A valid image is required').notEmpty();

    var errors = req.validationErrors();

    if (!errors) {
        var artist_category = {
            name: req.sanitize('name').escape().trim(),
            description: req.sanitize('description').escape().trim(),
            image: req.sanitize('image').escape().trim()
        }

        req.getConnection((error, conn) => {
            conn.query('INSERT INTO inkedIn.artist_categories SET ?', artist, (err, result) => {
                if (err) {
                    req.flash('error', err);

                    res.render('artist_categories/add', {
                        title: 'Add New Artist Category',
                        name: artist_category.name,
                        description: artist_category.description,
                        image: artist_category.image
                    })
                } else {
                    req.flash('Success!', 'Data added successfully!')

                    res.render('artist_categories/add', {
                        title: 'Add New Artist Category',
                        name: '',
                        description: '',
                        image: ''
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

        res.render('artist_categories/add', {
            title: 'Add New Artist Categories',
            name: req.body.name,
            description: req.body.description,
            image: req.body.image
        })
    }
})

// SHOW EDIT ARTIST CATEGORY FORM
app.get('/edit/(:id)', (req, res, next) => {
    req.getConnection((error, conn) => {
        conn.query('SELECT * FROM inkedIn.artist_categories WHERE id = ' + req.params.id, (err, rows, fields) => {
            if (err) throw err;
            if (rows.length <= 0) {
                req.flash('error', 'Artist Category not found with id = ' + req.params.id);
                res.redirect('/artist_categories');
            }
            else {
                res.render('artist_categories/edit', {
                    title: 'Edit Artist',
                    id: rows[0].id,
                    name: rows[0].name,
                    description: rows[0].description,
                    image: rows[0].image
                })
            }
        })
    })
})

// EDIT ARTIST CATEGORY POST ACTION
app.put('./edit/(:id)', (req, res, next) => {
    req.assert('name', 'A Category name is required.').notEmpty();
    req.assert('description', 'A Description is required. ').notEmpty();
    req.assert('image', 'A valid Image is required').notEmpty();
    
    var errors = req.validationErrors();

    if(!errors) {
        var artist_category = {
            name: req.sanitize('name').escape().trim(),
            description: req.sanitize('description').escape().trim(),
            image: req.sanitize('image').escape().trim()
        }

        req.getConnection((error, conn) => {
            conn.query('UPDATE inkedIn.artist_categories SET ? WHERE id = ' + req.params.id, artist, (err, result) => {
                if (err) {
                    req.flash('error', err);

                    res.render('artist_categories/edit', {
                        title: 'Edit Artist',
                        id: req.params.id,
                        name: req.body.name,
                        description: req.body.description,
                        image: req.body.image
                    })
                } else {
                    req.flash('success', 'Data updated successfully!');
                    
                    res.render('artist_categories/edit', {
                        title: 'Edit Artist',
                        id: req.params.id,
                        name: req.body.name,
                        description: req.body.description,
                        image: req.body.image
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

        res.render('artist_categories/edit', {
            title: 'Edit Artist',
            id: req.params.id,
            name: req.body.name,
            description: req.body.description,
            image: req.body.image
        })
    }
})

//DELETE artist_category POST ACTION
app.delete('/delete/(:id)', () => {
    var artist_category = { id: req.params.id }

    req.getConnection((error, conn) => {
        conn.query('DELETE FROM inkedIn.artist_categories WHERE id = ' + req.params.id, artist_category, (err, result) => {
            if (err) {
                req.flash('error', err);
                res.redirect('/artist_categories');
            } else {
                req.flash('success', 'Category has been successfully deleted! id = ' + req.params.id);
                res.redirect('/artist_categories');
            }
        })
    })
})


module.exports = app;