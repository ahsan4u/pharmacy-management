const mongoose = require('mongoose');

const dbConect = async ()=> {
    mongoose.connect('mongodb://127.0.0.1:27017/pharmacy')
    .then(()=> {
        console.log('Database Conected');
    })
    .catch((err)=> {
        console.log('ERROR: '+err);
    });
};

module.exports = dbConect;