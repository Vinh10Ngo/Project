

const mainModel = require(__path__schemas + 'contact')

module.exports = {
    
  saveItem: (item, username, options = null) => {
    item.time = Date.now()
    item.status = 'inactive'

    return new mainModel(item).save()
  },
    
  listItems: (params, options = null) => {
    let objWhere = {}
    let sort = {'time': 'desc'}
      if (params.currentStatus !== 'all') {
          objWhere.status = params.currentStatus
        }
      if (params.keyword !== '') {
        let keywordRegex = new RegExp(params.keyword, 'i');
        objWhere.$or = [
          { name: keywordRegex },
          { email: keywordRegex },
          { phone: keywordRegex },
          { website: keywordRegex },
          { message: keywordRegex }
        ];
      }

   return mainModel
    .find(objWhere)
    .select('name status email phone website message time')
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
  deleteItem: (id, options = null) => {
  if(options.task == 'delete-one') {
    return mainModel.deleteOne({_id: id})
  }
  if(options.task == 'delete-many') {
    return mainModel.deleteMany({_id: {$in: id}})
  }
  },
}

  
