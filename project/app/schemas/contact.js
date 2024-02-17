const mongoose = require('mongoose')
const databaseConfigs = require(__path__configs + 'database')

const schema = new mongoose.Schema({ 
    name: String,
    status: String,
    email: String,
    phone: String,
    website: String,
    message: String,
    time: Date,
    

});

module.exports= mongoose.model(databaseConfigs.col_contact, schema)