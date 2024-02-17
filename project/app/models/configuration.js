

const mainModel = require(__path__schemas + 'configuration')

module.exports = {
    
  saveItem: (item, username, options = null) => {
  let updateFields = {}
    updateFields = {
      info: {
        address: item.info.address,
        copyright: item.info.copyright,
        content: item.info.content,
        phone: item.info.phone,
        logo: item.info.logo,
        social: {
          facebook: item.info.social.facebook,
          youtube: item.info.social.youtube,
          twitter: item.info.social.twitter, 
          pinterest: item.info.social.pinterest,
          instagram: item.info.social.instagram,
          email: item.info.social.email
        }
      },
      send_email: {
        email: item.send_email.email,
        password: item.send_email.password,
        BCC: item.send_email.BCC
      },
      about: item.about,
      modified: {
        user_id: 0,
        user_name: username,
        time: Date.now()
      }
    }
    return mainModel.updateOne({}, updateFields);
  },

  
 getFormData: (data, options = null) => {   
  return mainModel.findOne(data)
 },
 listConfigFrontend: (params = null, options = null) => {
  let find = {}
  return mainModel.find(find)
  },
}
