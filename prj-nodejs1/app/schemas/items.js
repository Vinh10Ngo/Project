const mongoose = require('mongoose')
const databaseConfigs = require(__path__configs + 'database')

const schema = new mongoose.Schema({ 
    name: String, 
    status: String, 
    ordering: Number, 
});
module.exports= mongoose.model(databaseConfigs.col_items, schema)