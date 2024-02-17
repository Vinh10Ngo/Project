
const notifyConfigs = require(__path__configs + 'notify');
const util = require('util')

const options = {
    username: {min: 5, max: 20},
    password: {min: 5, max: 20},
    new_password: {min: 5, max: 20}
}

module.exports = {
    validator: (req) => {
        req.checkBody('username', util.format(notifyConfigs.ERROR_USERNAME, options.username.min, options.username.max)).isLength({min: options.username.min, max: options.username.max})
        req.checkBody('password', util.format(notifyConfigs.ERROR_PASSWORD, options.password.min, options.password.max)).isLength({min: options.password.min, max: options.password.max})
        req.checkBody('new_password', util.format(notifyConfigs.ERROR_NEW_PASSWORD, options.password.min, options.password.max)).isLength({min: options.password.min, max: options.password.max})
        req.checkBody('confirm_new_password', util.format(notifyConfigs.ERROR_CONFIRM_PASSWORD_EMPTY)).notEmpty()
        
        let errors = req.validationErrors()
        
        return errors
    }
}