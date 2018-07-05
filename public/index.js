const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.render('index', {title: 'Welcome to InkedIn!'})
});

module.exports = app;