
$('.ordering').change(function () {
  let current = $(this)
  let ordering = $(this).val()
  let id = $(this).data('id')
  let link = $(this).data('link')
  
  $.ajax({
    type: 'POST',
    url: link,
    data: {'id': id, 'ordering': ordering},
    dataType: 'json',
    success: function (data) {
      toastr["success"]("cập nhập ordering thành công") 
         }
    })
  })
  $('a.ajax-groups_acp').click(function (e) {
     e.preventDefault()
    let currentElement = $(this)
    let currentClass = currentElement.attr('data-current')
    let link = currentElement.attr('href')
    $.ajax({
      type: 'POST',
      url: link,
      dataType: 'json',
      success: function (data) {
        toastr["success"]("cập nhập groupsACP thành công") 
        let groupsACP = data.groups_acp
        let classGroupsACP = currentElement.data(groupsACP)
        let linkGroups = link.replace(link.match('[^/]+$'), groupsACP)
        currentElement.attr('data-current', classGroupsACP)
        currentElement.removeClass(currentClass).addClass(classGroupsACP)
        currentElement.attr('href', linkGroups)
      }
    })
  })
  $('a.ajax-special').click(function (e) {
    e.preventDefault()
   let currentElement = $(this)
   let currentClass = currentElement.attr('data-current')
   let link = currentElement.attr('href')
   $.ajax({
     type: 'POST',
     url: link,
     dataType: 'json',
     success: function (data) {
       toastr["success"]("cập nhập special thành công") 
       let special = data.special
       let classSpecial = currentElement.data(special)
       let linkSpecial = link.replace(link.match('[^/]+$'), special)
       currentElement.attr('data-current', classSpecial)
       currentElement.removeClass(currentClass).addClass(classSpecial)
       currentElement.attr('href', linkSpecial)
     }
   })
 })
 $('a.ajax-view-type').click(function (e) {
  e.preventDefault()
 let currentElement = $(this)
 let currentClass = currentElement.attr('data-current-class')
 let currentName = currentElement.attr('data-current-name')
 let link = currentElement.attr('href')
 $.ajax({
   type: 'POST',
   url: link,
   dataType: 'json',
   success: function (data) {
     toastr["success"]("cập nhập view type thành công") 
     let view_type = data.view_type
     let classViewType = currentElement.data(view_type + '-class')
     let nameViewType = currentElement.data(view_type + '-name')
     let linkViewType = link.replace(link.match('[^/]+$'), view_type)
     currentElement.attr('data-current-class', classViewType)
      currentElement.attr('data-current-name', nameViewType)
     currentElement.removeClass(currentClass).addClass(classViewType)
     currentElement.text(nameViewType)
     currentElement.attr('href', linkViewType)
   }
 })
})
  $('a.ajax-status').click(function (e) {
    e.preventDefault()
   let currentElement = $(this)
   let currentClass = currentElement.attr('data-current-class')
   let currentIcon = currentElement.attr('data-current-icon')
   let link = currentElement.attr('href')
   $.ajax({
     type: 'POST',
     url: link,
     dataType: 'json',
     success: function (data) {
       toastr["success"]("cập nhập Status thành công") 
       let status = data.status
       let classStatus = currentElement.data(status + '-class')
       let iconStatus = currentElement.data(status + '-icon')

       let linkStatus = link.replace(link.match('[^/]+$'), status)
       currentElement.attr('data-current-class', classStatus)
       currentElement.attr('data-current-icon', iconStatus)
       currentElement.removeClass(currentClass).addClass(classStatus)
       currentElement.children().removeClass(currentIcon).addClass(iconStatus)
       currentElement.attr('href', linkStatus)
     }
   })
 })
$('select[name=item_groups]').change(function (e) {
  let current = $(this)
  let id = current.val()
  let name = current.find('option:selected').text();
  let idItem = current.data('iditem')
  let link = current.data('link') 
  $.ajax({
    type: 'POST',
    url: link,
    data: {'id': idItem, 'groups_id': id, 'groups_name': name},
    dataType: 'json',
    success: function (data) {
      toastr["success"]("Thay đổi group thành công") 
    }
  })
})  
$('select[name=item_category]').change(function (e) {
  let current = $(this)
  let id = current.val()
  let name = current.find('option:selected').text();
  let idItem = current.data('iditem')
  let link = current.data('link') 
  $.ajax({
    type: 'POST',
    url: link,
    data: {'id': idItem, 'category_id': id, 'category_name': name},
    dataType: 'json',
    success: function (data) {
      toastr["success"]("Thay đổi category thành công") 
    }
  })
})