const {
  Command
} = require('commander')
const tar = require('./tar')
const zip = require('./zip')
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
  const destpath = program.args[1];
  (async () => {
    await compressFunction(target, destpath)
  })()
}
