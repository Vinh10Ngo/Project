const util = require('util')
const notifyConfigs = require(__path__configs + 'notify');

module.exports = {
    show: (req, res, linkIndex, params = null) => {
        let notifyContent = ''
        switch (params.task) {
            case 'edit':
                notifyContent = notifyConfigs.EDIT_SUCCESS
                break;
            case 'add':
                notifyContent = notifyConfigs.ADD_SUCCESS
                break;
            case 'change_status':
                notifyContent = notifyConfigs.STATUS_SUCCESS
                break;
            case 'change_status_multi':
                notifyContent = util.format(notifyConfigs.STATUS_MULTI_SUCCESS, params.total)
                break;
            case 'delete':
                notifyContent = notifyConfigs.DELETE_SUCCESS
                break; 
            case 'delete_multi':
                notifyContent = util.format(notifyConfigs.DELETE_MULTI_SUCCESS, params.total)
                break; 
            case 'groups_acp':
                notifyContent = notifyConfigs.GROUPS_ACP_SUCCESS
                break; 
            case 'special':
                notifyContent = notifyConfigs.SPECIAL_SUCCESS
                break;
            case 'change_ordering':
                notifyContent = notifyConfigs.ORDERING_SUCCESS
                break;     
            case 'contact':
                notifyContent = notifyConfigs.SUCCESS_CONTACT
                break;                              
            default:
                notifyContent = ''
                break;
        }
        req.flash('success', notifyContent);
        res.redirect(linkIndex)
    }
}