const mainModel = require(__path__schemas + 'groups')

module.exports = {
    
    listItems: (params, options = null) => {
        let objWhere = {}
        let sort = {}
          if (params.currentStatus !== 'all') {
              objWhere.status = params.currentStatus
            }
          if (params.keyword !== '') {
            objWhere.name = new RegExp(params.keyword, 'i')
          }
         sort[params.sortField] = params.sortType

       return mainModel
        .find(objWhere)
        .select('name status ordering created modified groups_acp')
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
    deleteItem: (id, options = null) => {
     if(options.task == 'delete-one') {
      return mainModel.deleteOne({_id: id})
     }
     if(options.task == 'delete-many') {
      return mainModel.deleteMany({_id: {$in: id}})
     }
  },
    saveItem: (item, username, options = null) => {
      if (options.task == 'add') {
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
          content: item.content,
          groups_acp: item.groups_acp,
            modified : {
              user_id: 0, 
              user_name: username, 
              time: Date.now()   
          }
        })
      }
  },
  groupsACP: (id, currentGroups_acp, username, options = null) => {
    let groups_acp = (currentGroups_acp === 'yes') ? 'no' : 'yes'
    let data = {
      groups_acp: groups_acp,
      modified : {
        user_id: 0, 
        user_name: username, 
        time: Date.now()   
    }
  }
    return mainModel.updateOne({_id: id}, data)
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
  getItemsCondition: (params) => {
    return mainModel.find(params)
  }
}
