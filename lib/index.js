const zip = require('./zip')
const tar = require('./tar')
const util = require('./util')
const factory = require('./factory')
const cli = require('./cli')
const VERSION = require('../package.json').version
module.exports = {
  zip,
  tar,
  util,
  factory,
  cli,
  VERSION
}
