const childProcess = require('child_process')
const fs = require('fs')
const path = require('path')
process.chdir(path.resolve(__dirname, './fixtures'))
const EXECUTABLE_PATH = path.resolve(path.join(__dirname, '../bin/zip.js'))

// describe('bin/zip.js', () => {
//   const forkedProcesses = new Set()

//   function runSomZip (args, options) {
//     const newProcess = childProcess.fork(
//       EXECUTABLE_PATH,
//       args,
//       Object.assign(
//         {
//           silent: true
//         },
//         options
//       )
//     )
//     forkedProcesses.add(newProcess)
//     return newProcess
//   }
// })
