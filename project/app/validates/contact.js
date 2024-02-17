
const notifyConfigs = require(__path__configs + 'notify');
const util = require('util')

const options = {
    name: {min: 5, max: 20},
    email: {min: 5, max: 50},
    phone: {min: 5, max: 20},
    message: {min: 5, max: 100},
    
}

module.exports = {
    validator: (req) => {
        req.checkBody('name', util.format(notifyConfigs.ERROR_NAME, options.name.min, options.name.max)).isLength({min: options.name.min, max: options.name.max})
        req.checkBody('email', util.format(notifyConfigs.ERROR_NAME, options.email.min, options.email.max)).isLength({min: options.email.min, max: options.email.max})
        req.checkBody('phone', util.format(notifyConfigs.ERROR_NAME, options.phone.min, options.phone.max)).isLength({min: options.phone.min, max: options.phone.max})
        let errors = req.validationErrors()
        
        return errors
    }
}