// https://www.bezkoder.com/node-js-watch-folder-changes/
const chokidar = require("chokidar"); 
const max = require('max-api')
const watcher = chokidar.watch('absentListener', { persistent: true });

watcher
  .on('add', (path) => {
      console.log(`File ${path} has been added`)
      max.outlet(`File ${path} has been added`)
      max.post(`File ${path} has been added`)
  })

 