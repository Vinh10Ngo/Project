const itemsModel = require('./../schemas/items')

let createFilterStatus = (currentStatus) => {
    let statusFilter = [
        {name:'all', value: 'all', count: 4, link: '#', class: 'default'},
        {name:'active', value: 'active', count: 5, link: '#', class: 'default'},
        {name:'inactive',value: 'inactive', count: 6, link: '#', class: 'default'}
      ]
    
      statusFilter.forEach((item, index) => {
        let condition = {}
        if (item.value !== 'all') condition = {status: item.value};
        if (item.value === currentStatus) statusFilter[index].class = 'success'

        itemsModel.count(condition).then((data) => {
          statusFilter[index]= data
        })
      })
      return statusFilter
}
module.exports = {
    createFilterStatus: createFilterStatus, 
}
