var fs = require('fs-extra')

var dir = 'dist'
fs.ensureDir(dir, function (err) {
  if (err) {
    console.log(err)
  }
})
