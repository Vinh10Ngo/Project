const mongoose = require('mongoose')
const databaseConfigs = require(__path__configs + 'database')
const bcrypt = require('bcrypt');

const schema = new mongoose.Schema({ 
    name: String, 
    status: String, 
    ordering: Number, 
    username: String,
    password: String,
    content: String,
    avatar: String,
    groups: {
        id: String,
        name: String,
        groups_acp: String,
    },
    created: {
        user_id: Number, 
        user_name: String, 
        time: Date
    },
    modified : {
        user_id: Number, 
        user_name: String, 
        time: Date   
    },

});

module.exports= mongoose.model(databaseConfigs.col_users, schema)