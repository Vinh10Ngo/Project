const mainModel = require(__path__schemas + 'users')
const groupsModel = require(__path__schemas + 'groups')
const fileHelpers  = require(__path__helpers + 'file')
const uploadLink = 'public/uploads/users/'
const crypto = require('crypto');
var md5 = require('md5');


module.exports = {
    
    listItems: (params, options = null) => {
      let objWhere = {}
        let sort = {}
        if (params.currentStatus !== 'all') {
          objWhere.status = params.currentStatus
        }

        if(params.groupID !== 'allvalue') objWhere['groups.id'] = params.groupID 

        if (params.keyword !== '') {
          objWhere.name = new RegExp(params.keyword, 'i')
        }
         sort[params.sortField] = params.sortType
       return mainModel
        .find(objWhere)
        .select('name status ordering created modified groups.name groups.id avatar')
        .sort(sort)
        .skip((params.pagination.currentPage-1)*params.pagination.totalItemsPerPage)
        .limit(params.pagination.totalItemsPerPage)
    }, 
    getItems: (id) => {
      return mainModel.findById(id)
    }, 
    countItems: (params, options = null) => {
      let objWhere = {}
      if (params.currentStatus !== 'all') {
        objWhere.status = params.currentStatus
      }
      if (params.groupID !== 'allvalue') {
        objWhere['groups.id'] = params.groupID    
      }
      if (params.keyword !== '') {
        objWhere.name = new RegExp(params.keyword, 'i')
      }
       return mainModel.count(objWhere)
    }, 
    changeStatus: (id, currentStatus, username, options = null) => {
        let status = (currentStatus === 'active') ? 'inactive' : 'active'
        let data = {
          status: status,
          modified : {
            user_id: 0, 
            user_name: username, 
            time: Date.now()   
        }
      }
      if(options.task == "update-one") {
        return mainModel.updateOne({_id: id}, data)
      }
      if(options.task == "update-multi") {
        data.status = currentStatus
        return mainModel.updateMany({_id: {$in: id}}, data)
      }       
    },
    changeOdering: async (cids, orderings, username, options = null) => {
        let data = {
            ordering: parseInt(orderings),
            modified : {
              user_id: 0, 
              user_name: username, 
              time: Date.now()   
          }
        }
        if(Array.isArray(cids)) {
            for (let index = 0; index < cids.length; index++) {
              data.ordering = parseInt(orderings[index])  
              await mainModel.updateOne({_id: cids[index]}, data)
              return Promise.resolve('Success')
            }
          } else {
              return mainModel.updateOne({_id: cids}, data)
          }
    },
    changeOrderingAjax: (id, ordering, username, option = null) => {
      let data = {
        ordering: parseInt(ordering),
        modified : {
          user_id: 0, 
          user_name: username, 
          time: Date.now()   
      }
    }
    return mainModel.updateOne({_id: id}, data)
    },
    deleteItem: async (id, options = null) => {
     if(options.task == 'delete-one') {
        await mainModel.findById(id).then(result => {
          fileHelpers.remove(uploadLink, result.avatar)
    }); 
      return mainModel.deleteOne({_id: id})
     }
     if(options.task == 'delete-many') {
      if (Array.isArray(id)) {
        for (let index = 0; index < id.length; index++) {
          await mainModel.findById(id[index]).then(result => {
            fileHelpers.remove(uploadLink, result.avatar)  
          }); 
        }
      } else {
        await mainModel.findById(id).then(result => {
          fileHelpers.remove(uploadLink, result.avatar)     
        }); 
      }
      return mainModel.deleteMany({_id: {$in: id}})
     }
  },
  saveItem: (item, username, options = null, itemReq = null) => {
    if (options.task == 'change-password') {
      return mainModel.updateOne({_id: item.id},
        {password: md5(itemReq.new_password),
          modified : {
            user_id: 0, 
            user_name: username, 
            time: Date.now()   
          }
        })
    }
    if (options.task == 'add') {
      item.password = md5(item.password)
      item.groups = {
        id: item.groups_id,
        name: item.groups_name
      },
      item.created = {
        user_id: 0, 
        user_name: username, 
        time: Date.now()
      }
      return new mainModel(item).save()
    }
    if (options.task == 'edit') {
      return mainModel.updateOne({_id: item.id},
        {status: item.status, 
         ordering: parseInt(item.ordering),
         name: item.name,
         username: item.username,
         avatar: item.avatar,
         content: item.content,
         groups: {
          id: item.groups_id,
          name: item.groups_name
        },
        modified : {
          user_id: 0, 
          user_name: username, 
          time: Date.now()   
         }
       })
    }
    if (options.task == 'change-groups-name') {
      return mainModel.updateMany({'groups.id': item.id},
        {
         groups: {
          id: item.id,
          name: item.name
        },
        modified : {
          user_id: 0, 
          user_name: username, 
          time: Date.now()   
        }
       })
    }
  },
  listItemInSelectBox: (params, option = null) => {
    return groupsModel.find({}, {_id: 1, name: 1})
  },
  changeGroup: (id, groupID, groupName, username) => {
    return mainModel.updateOne({_id: id}, {
      groups: {
        id: groupID,
        name: groupName
      },
      modified : {
        user_id: 0, 
        user_name: username, 
        time: Date.now()   
      }
    })    
  }, 
  getItemsByUserName: (username, options = null) => {
    if(options == null) {
    return mainModel.find({status: 'active', username: username}).select('username password avatar status groups.name')
    }
  },
  getItemsCondition: (params) => {
    return mainModel.find(params)
    }
 
}
