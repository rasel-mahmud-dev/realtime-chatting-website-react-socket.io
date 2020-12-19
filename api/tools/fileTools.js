class FileTools {
  constructor(date, file) {
    this.date = date;
    if (date === null) {
      this.date = new Date().toISOString();
    }
    this.file = file;
  }

  get dateName (){
    return this.date
    .replace(/:/g, "-")
    .match(/\d{4}-\d{2}-\d{2}/g)
    .toString()
    .replace(/-/g, "");
  }

  get timeName (){
    return this.date
    .replace(/:/g, "-")
    .match(/T\d\d-\d\d-\d\d.\d/g)
    .toString()
    .replace(/-/g, "")
    .replace(/\./g, "")
    .substr(1);
  }

  get dateFileName(){
    return this.dateName + "_" + this.timeName
  }
    
  get extention(){
    let lastdot = this.file.lastIndexOf(".");
    return this.file.slice(lastdot);
  }

  get name() {
    let lastdot = this.file.lastIndexOf(".");
    return this.file.slice(0, lastdot);
  }

  get fileName() {
    return this.name + "_" + this.dateFileName + this.extention
  }

}

module.exports = FileTools