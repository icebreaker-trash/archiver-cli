const { Command } = require('commander')
const { tar, zip } = require('./index.js')
const version = require('../package.json').version

function getCompress (format) {
  switch (format) {
    case 'tar':
      return tar
    case 'zip':
      return zip
    default:
      throw new Error('Can not find any compress function')
  }
}

module.exports = function createCli (format) {
  const compressFunction = getCompress(format)
  const program = new Command()
  program.version(version)

  program.parse(process.argv)

  const target = program.args[0]
  ;(async () => {
    await compressFunction(target)
  })()
}
