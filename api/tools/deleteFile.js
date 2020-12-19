const fs = require('fs')


module.exports = (path, callback)=>{
  fs.unlink(path, (err, result)=>{
    if(err) return callback(err, result)
    callback(err, result)
  })
  
}


