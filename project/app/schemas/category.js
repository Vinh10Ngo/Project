const mongoose = require('mongoose')
const databaseConfigs = require(__path__configs + 'database')

const schema = new mongoose.Schema({ 
    name: String,
    slug: String,
    status: String, 
    ordering: Number, 
    content: String,
    special: String,
    view_type: String,
    created: {
        user_id: Number, 
        user_name: String, 
        time: Date
    },
    modified : {
        user_id: Number, 
        user_name: String, 
        time: Date   
    }
});
module.exports= mongoose.model(databaseConfigs.col_category, schema)