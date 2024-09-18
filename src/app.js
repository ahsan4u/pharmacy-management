const express = require('express');
const hbs = require('hbs');
const path = require('path');
const conectDB = require('./db');
const router = require('./router')

const app = express();

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '../templete/views'));
hbs.registerPartials(path.join(__dirname, '../templete/partial'));

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../public')))
app.use(express.json());
app.use('/', router);

conectDB().then(()=> {
    app.listen(8000, ()=> {console.log('server is live')});
});
