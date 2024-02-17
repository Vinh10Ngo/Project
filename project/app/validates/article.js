
const notifyConfigs = require(__path__configs + 'notify');
const util = require('util')
const fs  = require('fs')
const uploadLink = 'public/uploads/article/'


const options = {
    name: {min: 5, max: 100},
    ordering: {min: 0, max: 100},
    status: {value: 'novalue'},
    category: {value: 'allvalue'},
    content: {min: 5, max: 10000},
    special: {value: 'novalue'},
} 

module.exports = {
    validator: (req, item, err, taskCurrent) => {
        req.checkBody('name', util.format(notifyConfigs.ERROR_NAME, options.name.min, options.name.max)).isLength({min: options.name.min, max: options.name.max})
        req.checkBody('ordering', util.format(notifyConfigs.ERROR_ORDERING, options.ordering.min, options.ordering.max)).isInt({gt: options.ordering.min, lt: options.ordering.max})
        req.checkBody('status', notifyConfigs.ERROR_STATUS).isNotEqual(options.status.value)
        req.checkBody('content', util.format(notifyConfigs.ERROR_NAME, options.content.min, options.content.max)).isLength({min: options.content.min, max: options.content.max})
        req.checkBody('category_id', notifyConfigs.ERROR_CATEGORY).isNotEqual(options.category.value)
        req.checkBody('special', notifyConfigs.ERROR_SPECIAL).notEmpty()
        let errors = req.validationErrors()
        if (err == undefined) { // không có lỗi thumb || chưa up thumb
            if (taskCurrent == 'add') {
                err = notifyConfigs.ERROR_UPLOADS_THUMB 
                if (errors == false) { // errors == false => không có lỗi errors                 
                    if (!fs.existsSync(uploadLink + item.thumb)) { // không up thumb
                        errors = []
                        errors.push({ param: 'thumb', msg: err });
                    }  
                }  else { // errors = [...] => có lỗi errors
                    errors.push({ param: 'thumb', msg: err });
                    if (fs.existsSync(uploadLink + item.thumb)) errors.pop()
                }
            }
                
        } else {
            if (err.code == 'LIMIT_FILE_SIZE') err = notifyConfigs.ERROR_LIMIT
            if (errors == false) {
                errors = []
            } 
            errors.push({ param: 'thumb', msg: err });
        }
        return errors
    }
}