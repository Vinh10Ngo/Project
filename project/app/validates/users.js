
const notifyConfigs = require(__path__configs + 'notify');
const util = require('util')
const fs  = require('fs')
const uploadLink = 'public/uploads/users/'


const options = {
    name: {min: 5, max: 20},
    ordering: {min: 0, max: 100},
    status: {value: 'novalue'},
    groups: {value: 'allvalue'},
    content: {min: 5, max: 200},
    username: {min: 5, max: 20},
    passwordEdit: {min: 5, max: 20},
    passwordAdd: {min: 5, max: 20}
}

module.exports = {
    validator: (req, item, err, taskCurrent) => {
        req.checkBody('name', util.format(notifyConfigs.ERROR_NAME, options.name.min, options.name.max)).isLength({min: options.name.min, max: options.name.max})
        req.checkBody('username', util.format(notifyConfigs.ERROR_USERNAME, options.username.min, options.username.max)).isLength({min: options.username.min, max: options.username.max})
        req.checkBody('ordering', util.format(notifyConfigs.ERROR_ORDERING, options.ordering.min, options.ordering.max)).isInt({gt: options.ordering.min, lt: options.ordering.max})
        req.checkBody('status', notifyConfigs.ERROR_STATUS).isNotEqual(options.status.value)
        req.checkBody('content', util.format(notifyConfigs.ERROR_NAME, options.content.min, options.content.max)).isLength({min: options.content.min, max: options.content.max})
        req.checkBody('groups_id', notifyConfigs.ERROR_GROUPS).isNotEqual(options.groups.value)
        req.checkBody('password', util.format(notifyConfigs.ERROR_PASSWORD, options.passwordAdd.min, options.passwordAdd.max)).isLength({min: options.passwordAdd.min, max: options.passwordAdd.max})
        let errors = req.validationErrors()
        if (err == undefined) { // không có lỗi avatar || chưa up avatar
            if (taskCurrent == 'add') {
                err = notifyConfigs.ERROR_UPLOADS_AVATAR 
                if (errors == false) { // errors == false => không có lỗi errors                 
                    if (!fs.existsSync(uploadLink + item.avatar)) { // không up avatar
                        errors = []
                        errors.push({ param: 'avatar', msg: err });
                    }  
                }  else { // errors = [...] => có lỗi errors
                    errors.push({ param: 'avatar', msg: err });
                    if (fs.existsSync(uploadLink + item.avatar)) errors.pop()
                }
            }
                
        } else {
            if (err.code == 'LIMIT_FILE_SIZE') err = notifyConfigs.ERROR_LIMIT
            if (errors == false) {
                errors = []
            } 
            errors.push({ param: 'avatar', msg: err });
        }
        return errors
    }
}