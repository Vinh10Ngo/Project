const itemsModel = require(__path__schemas + 'items')

let createFilterStatus = async (currentStatus) => {
    let statusFilter = [
        {name:'all', value: 'all', count: 4, link: '#', class: 'default'},
        {name:'active', value: 'active', count: 5, link: '#', class: 'default'},
        {name:'inactive',value: 'inactive', count: 6, link: '#', class: 'default'}
      ]
    
        for (let index = 0; index < statusFilter.length; index ++) {
        let item = statusFilter[index] 
        let condition = (item.value !== 'all') ? {status: item.value} : {}   
        if (item.value === currentStatus) statusFilter[index].class = 'success'

        await itemsModel.count(condition).then((data) => {
          statusFilter[index].count = data
        })
      }
      return statusFilter
}
module.exports = {
    createFilterStatus: createFilterStatus, 
}
