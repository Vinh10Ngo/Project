const multer  = require('multer')
var randomstring = require("randomstring");
const path = require('path')
const fs  = require('fs')

let uploadFile = (field, folderDes = 'users', fileNameLength = 7, fileSizeMin = 1, fileType = 'jpeg|jpg|png|gif', error = 'phần mở rộng không phù hợp') => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, __path__upload + folderDes)
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, randomstring.generate(fileNameLength) + path.extname(file.originalname))
    }
  })
  const upload = multer({
     storage: storage,
     limits: {fileSize: fileSizeMin * 1000 * 1000 },
     fileFilter: function (req, file, cb) {
      fileTypes = new RegExp(fileType)
      const extname = fileTypes.test(path.extname(file.originalname).toLowerCase())
      const mimetype = fileTypes.test(file.mimetype)
      if (extname && mimetype) {
        return cb(null, true)
      } else {
        cb(error)
      }
    }
   }).single(field)
   return upload
}

let removeFile = (folder, fileName) => {
  let path = folder + fileName
  if (fs.existsSync(path)) {
    fs.unlink(path, (err) => {
      if (err) throw err;
    });  
  }    
}
module.exports = {
    uploadFile,
    remove: removeFile,
}
