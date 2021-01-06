const klaw = require('klaw')
const path = require('path')

/**
 * format size for human reading
 * @param {Number} bytes
 */
function bytesToSize (bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (bytes === 0) return '0 Byte'
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i]
}

/**
 * Get the size of all files in a directory
 * @param {String} path
 */
async function directorySize (path) {
  let size = 0
  for await (const file of klaw(path)) {
    const {
      stats
    } = file
    if (!stats.isDirectory()) {
      size += stats.size
    }
  }
  return size
}

/**
 * get absolute path of file or folder
 * @param {String} p
 */
function getAbsolutePath (p, cwd) {
  let cwdPath = cwd
  if (!cwdPath) {
    cwdPath = process.cwd()
  }
  return path.isAbsolute(p) ? p : path.resolve(cwdPath, p)
}

module.exports = {
  bytesToSize,
  directorySize,
  getAbsolutePath
}
