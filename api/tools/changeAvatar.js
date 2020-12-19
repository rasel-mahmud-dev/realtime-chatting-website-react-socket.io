const multer = require('multer')

const makeDir = require('./makeDir')

module.exports = (path, fileType, name)=>{
  const storage = multer.diskStorage({
    destination: (req, file, next)=>{
      makeDir(path, ()=> {
        next(null, path)
      })
    },

    filename: (req, file, next)=>{
      const FileTools = require('./fileTools')
      const fileNameTool = new FileTools(null, file.originalname)      
      next(null, fileNameTool.fileName)
    }
  })

  const fileFilter = (req, file, cb) => {
    for(let i=0; i < fileType.length; i++){
      if(file.mimetype === `image/${fileType[i]}`){
        cb(null, true);
      } else{
        cb(null, false);
      }
    }
  };

  return multer({ storage, fileFilter }).single(name)
}
