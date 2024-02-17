
const notifyConfigs = require(__path__configs + 'notify');
const util = require('util')

const options = {
    name: {min: 5, max: 20},
    ordering: {min: 0, max: 100},
    status: {value: 'novalue'},
    content: {min: 5, max: 200},
    view_type: {value: 'novalue'}
}

module.exports = {
    validator: (req) => {
        req.checkBody('name', util.format(notifyConfigs.ERROR_NAME, options.name.min, options.name.max)).isLength({min: options.name.min, max: options.name.max})
        req.checkBody('ordering', util.format(notifyConfigs.ERROR_ORDERING, options.ordering.min, options.ordering.max)).isInt({gt: options.ordering.min, lt: options.ordering.max})
        req.checkBody('status', notifyConfigs.ERROR_STATUS).isNotEqual(options.status.value)
        req.checkBody('content', util.format(notifyConfigs.ERROR_NAME, options.content.min, options.content.max)).isLength({min: options.content.min, max: options.content.max})
        req.checkBody('special', notifyConfigs.ERROR_SPECIAL).notEmpty()
        req.checkBody('view_type', notifyConfigs.ERROR_VIEW_TYPE).isNotEqual(options.view_type.value)
 
        let errors = req.validationErrors()
        
        return errors

    }
}