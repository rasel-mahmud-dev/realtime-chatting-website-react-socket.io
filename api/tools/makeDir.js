const fs = require('fs')

function makeDir(path, callback){
  if(!fs.existsSync(path)){
    return fs.mkdir(path, { recursive: true }, (err)=>{
      if(err) return console.error(err);
      callback()
    })
  } else {
    callback()
  }
}

module.exports = makeDir